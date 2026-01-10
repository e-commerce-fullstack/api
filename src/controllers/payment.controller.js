import Payment from "../database/models/payment.model.js";
import order from "../database/models/order.model.js";
import {
  BakongKHQR,
  MerchantInfo,
  IndividualInfo,
  khqrData,
} from "bakong-khqr";
import axios from "axios";
import crypto from "crypto";

/**
 * Helper function to calculate CRC16 (The "Check Digit" for KHQR)
 * This is required when we manually modify the QR string.
 */
function setCRC16(data) {
  let crc = 0xffff;
  const j = data.length;
  for (let i = 0; i < j; i++) {
    let x = ((crc >> 8) ^ data.charCodeAt(i)) & 0xff;
    x ^= x >> 4;
    crc = ((crc << 8) ^ (x << 12) ^ (x << 5) ^ x) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * @desc    Generate KHQR with Auto-Amount and Create Payment
 */
// ... (keep the CRC16 function at the top)

export const submitKHQRPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const foundOrder = await order.findById(orderId);
    if (!foundOrder) return res.status(404).json({ success: false });

    const khqr = new BakongKHQR();
    const amount = foundOrder.total.toFixed(2); // String: "179.98"
    const billNumber = foundOrder._id.toString().slice(-10);

    // 1. USE INDIVIDUAL INFO (Best for @bkrt / @bkus accounts)
    const individualInfo = new IndividualInfo(
      process.env.BAKONG_ACCOUNT_ID,
      "E Store",
      "Phnom Penh",
      parseFloat(amount), 
      khqrData.currency.usd, 
      billNumber
    );

    const khqrResponse = khqr.generateIndividual(individualInfo);
    let qrString = khqrResponse.data.qr;

    // 2. CLEANER OVERRIDE
    let baseStr = qrString.slice(0, -4);

    // Ensure USD Tag 53 is 840 (NBC Standard)
    if (baseStr.includes("5303116")) {
      baseStr = baseStr.replace("5303116", "5303840");
    }

    // Ensure Amount Tag 54 is present
    if (!baseStr.includes("54")) {
      const tag54 = `54${amount.length.toString().padStart(2, "0")}${amount}`;
      // Insert Tag 54 before the Country Code (Tag 58)
      baseStr = baseStr.replace("5802KH", `${tag54}5802KH`);
    }

    // 3. FINAL CRC RE-CALCULATION
    // This step is critical. If the CRC doesn't match the modified string, 
    // the bank will refund the money.
    const finalQr = baseStr + setCRC16(baseStr);
    const md5 = crypto.createHash("md5").update(finalQr).digest("hex");

    // 4. Save Record
    await Payment.create({
      order: foundOrder._id,
      md5: md5.toLowerCase(),
      amount: foundOrder.total,
      status: "PENDING",
      method: "KHQR",
    });

    res.status(201).json({
      success: true,
      qrString: finalQr,
      md5: md5,
    });
  } catch (err) {
    console.error("Payment Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Check real Bakong API status via MD5
 */
export const checkPaymentStatus = async (req, res) => {
  try {
    const { md5 } = req.params;
    const searchMd5 = md5.toLowerCase();

    const payment = await Payment.findOne({ md5: searchMd5 });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    if (payment.status === "PAID") {
      return res.status(200).json({ success: true, status: "PAID" });
    }

    // Call Bakong Gateway
    const bakongResponse = await axios.post(
      "https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5",
      { md5: searchMd5 },
      {
        headers: {
          Authorization: `Bearer ${process.env.BAKONG_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (bakongResponse.data && bakongResponse.data.responseCode === 0) {
      const bankData = bakongResponse.data.data;

      payment.status = "PAID";
      payment.transactionId = bankData.hash;
      await payment.save();

      await order.findByIdAndUpdate(payment.order, {
        paymentStatus: "paid",
        status: "processing",
      });

      return res.status(200).json({
        success: true,
        status: "PAID",
        message: "Payment verified!",
      });
    }

    res.status(200).json({ success: false, status: "PENDING" });
  } catch (err) {
    console.error("Bakong API Error:", err.response?.data || err.message);
    res.status(200).json({ success: false, status: "PENDING" });
  }
};

/**
 * @desc    Fetch all payments
 */
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("order")
      .sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching payments" });
  }
};

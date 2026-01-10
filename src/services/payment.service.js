import axios from 'axios';

/**
 * Calls the official Bakong API to verify a transaction
 * @param {string} md5 - The hash generated from your KHQR string
 * @returns {object|null} - Returns transaction data if paid, else null
 */
export const verifyWithBakong = async (md5) => {
  try {
    const response = await axios.post(
      'https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5',
      { md5: md5 },
      {
        headers: {
          'Authorization': `Bearer ${process.env.BAKONG_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // If responseCode is 0, the transaction is successful
    if (response.data && response.data.responseCode === 0) {
      return response.data.data; // This contains the 'hash', 'amount', etc.
    }

    return null; // Not found or still pending
  } catch (error) {
    // Log error but don't crash; the next poll might succeed
    console.error("Bakong API Error:", error.response?.data || error.message);
    return null;
  }
};
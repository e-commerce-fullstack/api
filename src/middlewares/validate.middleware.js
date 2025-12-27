export const validateProduct = (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request body missing" });
  }

  const allowedFields = ["name", "price", "category", "stock"];

  const extraFields = Object.keys(req.body).filter(
    (key) => !allowedFields.includes(key)
  );

  if (extraFields.length > 0) {
    return res.status(400).json({
      message: "Extra fields not allowed",
      extraFields,
    });
  }

  for (const field of allowedFields) {
    if (!req.body[field]) {
      return res.status(400).json({ message: `${field} is required` });
    }
  }

  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  next();
};


export const validateOrder = (req, res, next) => {
  // req.body is an object sent by the client in a POST request, e.g.:
  const { products } = req.body;
  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: "Product is required" });
  }

  for (const item of products) {
    if (!item.product || item.quantity <= 0) {
      return res.status(400).json({ message: "Invalid product or qty" });
    }
  }

  next();
};

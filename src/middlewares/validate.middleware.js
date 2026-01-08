export const validateProduct = (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request body missing" });
  }

  // UPDATE THIS LINE: Add "image" to the list
  const allowedFields = ["name", "price", "category", "stock", "image"];

  const extraFields = Object.keys(req.body).filter(
    (key) => !allowedFields.includes(key)
  );

  if (extraFields.length > 0) {
    return res.status(400).json({
      message: "Extra fields not allowed",
      extraFields,
    });
  }

  // Keep your required check for text fields
  // NOTE: We don't check req.body.image here because the file is in req.file
  const requiredFields = ["name", "price", "category", "stock"];
  for (const field of requiredFields) {
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

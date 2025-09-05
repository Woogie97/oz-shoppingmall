const productService = require('../services/productService');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, stock } = req.body;
    const userId = req.user.userId; // This is available thanks to the authMiddleware

    if (name === undefined || price === undefined || stock === undefined) {
      return res.status(400).json({ message: 'Name, price, and stock are required' });
    }

    const productData = { name, description, price, imageUrl, stock, userId };
    const productId = await productService.createProduct(productData);

    res.status(201).json({ productId, message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const result = await productService.getProducts(page, limit);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productService.getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.userId;
    const productData = req.body;

    const updatedProduct = await productService.updateProduct(productId, userId, productData);

    res.status(200).json(updatedProduct);
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'User not authorized') {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.userId;

    await productService.deleteProduct(productId, userId);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'User not authorized') {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}; 
const cartService = require('../services/cartService');

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.userId;

    if (!productId) {
      return res.status(400).json({ message: '상품 ID가 필요합니다.' });
    }

    await cartService.addToCart(userId, productId, quantity);
    res.status(200).json({ message: '장바구니에 추가되었습니다.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCartItems = async (req, res) => {
  try {
    const userId = req.user.userId;
    const items = await cartService.getCartItems(userId);
    
    const totalAmount = items.reduce((sum, item) => sum + item.total_price, 0);
    
    res.status(200).json({
      items,
      totalAmount,
      itemCount: items.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.userId;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: '올바른 수량을 입력해주세요.' });
    }

    await cartService.updateCartItem(userId, productId, quantity);
    res.status(200).json({ message: '장바구니가 업데이트되었습니다.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    await cartService.removeFromCart(userId, productId);
    res.status(200).json({ message: '상품이 장바구니에서 제거되었습니다.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    await cartService.clearCart(userId);
    res.status(200).json({ message: '장바구니가 비워졌습니다.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 
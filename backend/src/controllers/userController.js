const userService = require('../services/userService');

exports.getMe = async (req, res) => {
  try {
    // req.user.userId is attached by the authMiddleware
    const user = await userService.getUserById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 
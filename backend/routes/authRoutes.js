const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getProfile, 
  updateProfile,
  updateProfilePicture, 
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerValidation, loginValidation } = require('../middleware/validationMiddleware');
const upload = require('../config/s3Upload');

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profilePicture'), updateProfile);
router.put('/profile/picture', protect, upload.single('profilePicture'), updateProfilePicture);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
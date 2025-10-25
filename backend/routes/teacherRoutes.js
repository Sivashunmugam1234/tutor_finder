const express = require('express');
const router = express.Router();
const { 
  getAllTeachers, 
  getTeacherById, 
  updateTeacherProfile,
  getMyReviews 
} = require('../controllers/teacherController');
const { protect, isTeacher } = require('../middleware/authMiddleware');
const upload = require('../config/s3Upload');

router.get('/', getAllTeachers);
router.get('/my-reviews', protect, isTeacher, getMyReviews);
router.get('/:id', getTeacherById);
router.put('/profile', protect, isTeacher, upload.single('profilePicture'), updateTeacherProfile);

module.exports = router;
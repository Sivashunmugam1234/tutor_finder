const express = require('express');
const router = express.Router();
const { getAllTeachers, getTeacherById, updateTeacherProfile } = require('../controllers/teacherController');
const { protect, isTeacher } = require('../middleware/authMiddleware');

// Note: Configure S3 upload middleware here
const upload = require('../config/s3Upload'); // You'll create this file

router.route('/').get(getAllTeachers);
router.route('/:id').get(getTeacherById);
router.route('/profile').put(protect, isTeacher, upload.single('profilePicture'), updateTeacherProfile);

module.exports = router;
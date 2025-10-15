const express = require('express');
const router = express.Router();
const { createTeacherReview } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/teachers/:id/reviews').post(protect, createTeacherReview);

module.exports = router;

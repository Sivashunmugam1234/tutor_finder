const express = require('express');
const router = express.Router();
const { 
  createTeacherReview,
  getMyReviews,
  updateReview,
  deleteReview
} = require('../controllers/studentController');
const { protect, isStudent } = require('../middleware/authMiddleware');
const { reviewValidation } = require('../middleware/validationMiddleware');

router.post('/teachers/:id/reviews', protect, isStudent, reviewValidation, createTeacherReview);
router.get('/my-reviews', protect, isStudent, getMyReviews);
router.put('/reviews/:id', protect, isStudent, updateReview);
router.delete('/reviews/:id', protect, isStudent, deleteReview);

module.exports = router;
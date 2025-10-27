const Review = require('../models/Review');
const User = require('../models/User');
const { asyncHandler } = require('../utils/helpers');

// @desc    Create a new review
// @route   POST /api/students/teachers/:id/reviews
// @access  Private (Student only)
exports.createTeacherReview = asyncHandler(async (req, res) => {

  
  const { rating, comment } = req.body;
  const teacherId = req.params.id;

  // Check if teacher exists
  const teacher = await User.findById(teacherId);
  if (!teacher || teacher.role !== 'teacher') {

    res.status(404);
    throw new Error('Teacher not found');
  }

  // Ensure teacher has teacherProfile
  if (!teacher.teacherProfile) {
    teacher.teacherProfile = {
      subjects: [],
      qualifications: [],
      experience: 0,
      hourlyRate: 0,
      availability: [],
      bio: '',
      averageRating: 0,
      totalReviews: 0,
      totalStudents: 0,
      languages: [],
      teachingMode: ['both']
    };
  }

  // Check if review already exists
  const existingReview = await Review.findOne({
    student: req.user._id,
    teacher: teacherId
  });

  if (existingReview) {

    res.status(400);
    throw new Error('You have already reviewed this teacher');
  }

  // Create review
  const review = await Review.create({
    student: req.user._id,
    teacher: teacherId,
    rating,
    comment
  });
  


  // Update teacher's average rating
  const reviews = await Review.find({ teacher: teacherId, isActive: true });
  const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  
  teacher.teacherProfile.averageRating = avgRating;
  teacher.teacherProfile.totalReviews = reviews.length;
  await teacher.save();
  


  const populatedReview = await Review.findById(review._id)
    .populate('student', 'name profilePicture')
    .populate('teacher', 'name');

  res.status(201).json({
    success: true,
    data: populatedReview,
    message: 'Review added successfully'
  });
});

// @desc    Get student's own reviews
// @route   GET /api/students/my-reviews
// @access  Private (Student only)
exports.getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ student: req.user._id })
    .populate('teacher', 'name profilePicture teacherProfile.subjects')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: reviews,
    total: reviews.length
  });
});

// @desc    Update a review
// @route   PUT /api/students/reviews/:id
// @access  Private (Student only)
exports.updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if user owns the review
  if (review.student.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this review');
  }

  const { rating, comment } = req.body;
  
  review.rating = rating || review.rating;
  review.comment = comment || review.comment;

  const updatedReview = await review.save();

  // Recalculate teacher's average rating
  const reviews = await Review.find({ teacher: review.teacher, isActive: true });
  const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  
  await User.findByIdAndUpdate(review.teacher, {
    'teacherProfile.averageRating': avgRating
  });

  res.json({
    success: true,
    data: updatedReview,
    message: 'Review updated successfully'
  });
});

// @desc    Delete a review
// @route   DELETE /api/students/reviews/:id
// @access  Private (Student only)
exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if user owns the review
  if (review.student.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  await review.deleteOne();

  // Recalculate teacher's average rating
  const reviews = await Review.find({ teacher: review.teacher, isActive: true });
  const avgRating = reviews.length > 0 
    ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length 
    : 0;
  
  await User.findByIdAndUpdate(review.teacher, {
    'teacherProfile.averageRating': avgRating,
    'teacherProfile.totalReviews': reviews.length
  });

  res.json({
    success: true,
    message: 'Review deleted successfully'
  });
});
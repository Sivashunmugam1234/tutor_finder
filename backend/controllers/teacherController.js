const User = require('../models/User');
const Review = require('../models/Review');
const { asyncHandler, getPagination } = require('../utils/helpers');

// @desc    Get all teachers with filtering and pagination
// @route   GET /api/teachers
// @access  Public
exports.getAllTeachers = asyncHandler(async (req, res) => {
  const { subject, minRate, maxRate, rating, city, search, page, limit, sortBy } = req.query;
  
  const query = { role: 'teacher', isActive: true };

  // Search by name or subjects
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { 'teacherProfile.subjects': { $regex: search, $options: 'i' } }
    ];
  }

  if (subject) {
    query['teacherProfile.subjects'] = { $regex: subject, $options: 'i' };
  }
  
  if (minRate || maxRate) {
    query['teacherProfile.hourlyRate'] = {};
    if (minRate) query['teacherProfile.hourlyRate'].$gte = Number(minRate);
    if (maxRate) query['teacherProfile.hourlyRate'].$lte = Number(maxRate);
  }
  
  if (rating) {
    query['teacherProfile.averageRating'] = { $gte: Number(rating) };
  }

  if (city) {
    query['location.city'] = { $regex: city, $options: 'i' };
  }

  const { skip, limit: limitNum, page: pageNum } = getPagination(page, limit);

  // Sorting
  let sort = {};
  switch(sortBy) {
    case 'rating':
      sort = { 'teacherProfile.averageRating': -1 };
      break;
    case 'price_low':
      sort = { 'teacherProfile.hourlyRate': 1 };
      break;
    case 'price_high':
      sort = { 'teacherProfile.hourlyRate': -1 };
      break;
    case 'reviews':
      sort = { 'teacherProfile.totalReviews': -1 };
      break;
    default:
      sort = { createdAt: -1 };
  }

  const teachers = await User.find(query)
    .select('-password')
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    data: teachers,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
});

// @desc    Get single teacher profile
// @route   GET /api/teachers/:id
// @access  Public
exports.getTeacherById = asyncHandler(async (req, res) => {
  const teacher = await User.findById(req.params.id).select('-password');
  
  if (teacher && teacher.role === 'teacher') {
    // Get reviews for this teacher
    const reviews = await Review.find({ teacher: req.params.id, isActive: true })
      .populate('student', 'name profilePicture')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        ...teacher.toObject(),
        reviews
      }
    });
  } else {
    res.status(404);
    throw new Error('Teacher not found');
  }
});

// @desc    Update teacher profile
// @route   PUT /api/teachers/profile
// @access  Private (Teacher only)
exports.updateTeacherProfile = asyncHandler(async (req, res) => {
  const teacher = await User.findById(req.user._id);

  if (!teacher) {
    res.status(404);
    throw new Error('Teacher not found');
  }

  // Update basic info
  teacher.name = req.body.name || teacher.name;
  teacher.phone = req.body.phone || teacher.phone;
  
  if (req.body.location) {
    teacher.location = { ...teacher.location, ...req.body.location };
  }

  if (req.body.password) {
    teacher.password = req.body.password;
  }
  
  // Update teacher-specific fields
  if (req.body.subjects) {
    teacher.teacherProfile.subjects = req.body.subjects;
  }
  if (req.body.qualifications) {
    teacher.teacherProfile.qualifications = req.body.qualifications;
  }
  if (req.body.experience !== undefined) {
    teacher.teacherProfile.experience = req.body.experience;
  }
  if (req.body.hourlyRate !== undefined) {
    teacher.teacherProfile.hourlyRate = req.body.hourlyRate;
  }
  if (req.body.availability) {
    teacher.teacherProfile.availability = req.body.availability;
  }
  if (req.body.bio) {
    teacher.teacherProfile.bio = req.body.bio;
  }
  if (req.body.languages) {
    teacher.teacherProfile.languages = req.body.languages;
  }
  if (req.body.teachingMode) {
    teacher.teacherProfile.teachingMode = req.body.teachingMode;
  }
  
  // Handle S3 image upload
  if (req.file) {
    teacher.profilePicture = req.file.location;
  }

  const updatedTeacher = await teacher.save();
  
  res.json({
    success: true,
    data: updatedTeacher.getPublicProfile(),
    message: 'Teacher profile updated successfully'
  });
});

// @desc    Get teacher's own reviews
// @route   GET /api/teachers/my-reviews
// @access  Private (Teacher only)
exports.getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ teacher: req.user._id, isActive: true })
    .populate('student', 'name profilePicture')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: reviews,
    total: reviews.length
  });
});

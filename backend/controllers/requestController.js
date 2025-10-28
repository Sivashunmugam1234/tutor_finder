const StudentRequest = require('../models/StudentRequest');
const User = require('../models/User');
const { asyncHandler } = require('../utils/helpers');
const { sendRequestAcceptanceEmail, sendRequestRejectionEmail } = require('../utils/emailService');

// @desc    Send request to teacher
// @route   POST /api/requests
// @access  Private (Student only)
exports.sendRequest = asyncHandler(async (req, res) => {
  const { teacherId, subject, message } = req.body;

  // Check if teacher exists
  const teacher = await User.findById(teacherId);
  if (!teacher || teacher.role !== 'teacher') {
    res.status(404);
    throw new Error('Teacher not found');
  }

  // Check if request already exists
  const existingRequest = await StudentRequest.findOne({
    student: req.user._id,
    teacher: teacherId
  });

  if (existingRequest) {
    res.status(400);
    throw new Error('You have already sent a request to this teacher');
  }

  const request = await StudentRequest.create({
    student: req.user._id,
    teacher: teacherId,
    subject,
    message
  });

  const populatedRequest = await StudentRequest.findById(request._id)
    .populate('student', 'name email profilePicture')
    .populate('teacher', 'name email');

  res.status(201).json({
    success: true,
    data: populatedRequest,
    message: 'Request sent successfully'
  });
});

// @desc    Get student's sent requests
// @route   GET /api/requests/my-requests
// @access  Private (Student only)
exports.getMyRequests = asyncHandler(async (req, res) => {
  const requests = await StudentRequest.find({ student: req.user._id })
    .populate('teacher', 'name profilePicture teacherProfile.subjects')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: requests,
    total: requests.length
  });
});

// @desc    Get teacher's received requests
// @route   GET /api/requests/received
// @access  Private (Teacher only)
exports.getReceivedRequests = asyncHandler(async (req, res) => {
  const requests = await StudentRequest.find({ teacher: req.user._id })
    .populate('student', 'name email profilePicture phone location')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: requests,
    total: requests.length
  });
});

// @desc    Accept student request
// @route   PUT /api/requests/:id/accept
// @access  Private (Teacher only)
exports.acceptRequest = asyncHandler(async (req, res) => {
  const request = await StudentRequest.findById(req.params.id)
    .populate('student', 'name email')
    .populate('teacher', 'name email');

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  if (request.teacher._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to respond to this request');
  }

  if (request.status !== 'pending') {
    res.status(400);
    throw new Error('Request has already been responded to');
  }

  request.status = 'accepted';
  request.respondedAt = new Date();
  await request.save();

  // Send acceptance email to student
  sendRequestAcceptanceEmail(
    request.student.email,
    request.student.name,
    request.teacher.name,
    request.subject
  ).catch(err => {});

  res.json({
    success: true,
    data: request,
    message: 'Request accepted successfully'
  });
});

// @desc    Reject student request
// @route   PUT /api/requests/:id/reject
// @access  Private (Teacher only)
exports.rejectRequest = asyncHandler(async (req, res) => {
  const request = await StudentRequest.findById(req.params.id)
    .populate('student', 'name email')
    .populate('teacher', 'name email');

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  if (request.teacher._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to respond to this request');
  }

  if (request.status !== 'pending') {
    res.status(400);
    throw new Error('Request has already been responded to');
  }

  request.status = 'rejected';
  request.respondedAt = new Date();
  await request.save();

  // Send rejection email to student (optional)
  sendRequestRejectionEmail(
    request.student.email,
    request.student.name,
    request.teacher.name,
    request.subject
  ).catch(err => {});

  res.json({
    success: true,
    data: request,
    message: 'Request rejected'
  });
});

// @desc    Get teacher's accepted students
// @route   GET /api/requests/my-students
// @access  Private (Teacher only)
exports.getMyStudents = asyncHandler(async (req, res) => {
  const acceptedRequests = await StudentRequest.find({ 
    teacher: req.user._id,
    status: 'accepted'
  })
    .populate('student', 'name email profilePicture phone location')
    .sort({ respondedAt: -1 });

  res.json({
    success: true,
    data: acceptedRequests,
    total: acceptedRequests.length
  });
});
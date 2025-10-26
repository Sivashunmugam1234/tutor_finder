const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  sendRequest,
  getMyRequests,
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
  getMyStudents
} = require('../controllers/requestController');

// Student routes
router.post('/', protect, authorize('student'), sendRequest);
router.get('/my-requests', protect, authorize('student'), getMyRequests);

// Teacher routes
router.get('/received', protect, authorize('teacher'), getReceivedRequests);
router.put('/:id/accept', protect, authorize('teacher'), acceptRequest);
router.put('/:id/reject', protect, authorize('teacher'), rejectRequest);
router.get('/my-students', protect, authorize('teacher'), getMyStudents);

module.exports = router;
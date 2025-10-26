const mongoose = require('mongoose');

const studentRequestSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  subject: {
    type: String,
    required: [true, 'Please specify the subject'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
    maxlength: [500, 'Message cannot exceed 500 characters'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  respondedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Prevent duplicate requests from same student to same teacher
studentRequestSchema.index({ student: 1, teacher: 1 }, { unique: true });
studentRequestSchema.index({ teacher: 1, status: 1 });
studentRequestSchema.index({ student: 1, status: 1 });

const StudentRequest = mongoose.model('StudentRequest', studentRequestSchema);
module.exports = StudentRequest;
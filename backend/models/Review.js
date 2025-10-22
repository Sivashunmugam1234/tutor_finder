const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  rating: { 
    type: Number, 
    required: [true, 'Please add a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  comment: { 
    type: String, 
    required: [true, 'Please add a comment'],
    minlength: [10, 'Comment must be at least 10 characters'],
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  helpful: {
    type: Number,
    default: 0
  },
  reported: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

// Prevent duplicate reviews from same student for same teacher
reviewSchema.index({ teacher: 1, student: 1 }, { unique: true });
reviewSchema.index({ teacher: 1 });
reviewSchema.index({ student: 1 });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

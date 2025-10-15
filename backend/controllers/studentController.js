const Review = require('../models/Review');
const User = require('../models/User');

// @desc    Create a new review
// @route   POST /api/students/teachers/:id/reviews
exports.createTeacherReview = async (req, res) => {
    const { rating, comment } = req.body;
    const teacherId = req.params.id;

    const review = new Review({
        student: req.user._id, // from protect middleware
        teacher: teacherId,
        rating,
        comment,
    });

    try {
        await review.save();
        
        // After saving, update the teacher's average rating
        const reviews = await Review.find({ teacher: teacherId });
        const teacher = await User.findById(teacherId);
        
        teacher.teacherProfile.averageRating = 
            reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
            
        await teacher.save();

        res.status(201).json({ message: 'Review added' });
    } catch (error) {
        res.status(400).json({ message: 'Could not add review' });
    }
};
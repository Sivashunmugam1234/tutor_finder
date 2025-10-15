const User = require('../models/User');

// @desc    Get all teachers with filtering
// @route   GET /api/teachers
exports.getAllTeachers = async (req, res) => {
  const { subject, minRate, maxRate, rating } = req.query;
  const query = { role: 'teacher' };

  if (subject) query['teacherProfile.subjects'] = { $in: [subject] };
  if (minRate) query['teacherProfile.hourlyRate'] = { ...query['teacherProfile.hourlyRate'], $gte: Number(minRate) };
  if (maxRate) query['teacherProfile.hourlyRate'] = { ...query['teacherProfile.hourlyRate'], $lte: Number(maxRate) };
  if (rating) query['teacherProfile.averageRating'] = { $gte: Number(rating) };
  
  try {
    const teachers = await User.find(query).select('-password');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single teacher profile
// @route   GET /api/teachers/:id
exports.getTeacherById = async (req, res) => {
    const teacher = await User.findById(req.params.id).select('-password');
    if (teacher && teacher.role === 'teacher') {
        res.json(teacher);
    } else {
        res.status(404).json({ message: 'Teacher not found' });
    }
};

// @desc    Update teacher profile
// @route   PUT /api/teachers/profile
exports.updateTeacherProfile = async (req, res) => {
    const teacher = await User.findById(req.user._id);

    if (teacher) {
        teacher.name = req.body.name || teacher.name;
        if (req.body.password) {
            teacher.password = req.body.password;
        }
        
        // Update teacher-specific profile fields
        teacher.teacherProfile.subjects = req.body.subjects || teacher.teacherProfile.subjects;
        teacher.teacherProfile.hourlyRate = req.body.hourlyRate || teacher.teacherProfile.hourlyRate;
        teacher.teacherProfile.availability = req.body.availability || teacher.teacherProfile.availability;
        teacher.teacherProfile.bio = req.body.bio || teacher.teacherProfile.bio;
        
        // Handle S3 image upload URL
        if (req.file) {
            teacher.profilePicture = req.file.location; // URL from multer-s3
        }

        const updatedTeacher = await teacher.save();
        res.json({
            _id: updatedTeacher._id,
            name: updatedTeacher.name,
            email: updatedTeacher.email,
            // ...return updated fields
        });
    } else {
        res.status(404).json({ message: 'Teacher not found' });
    }
};
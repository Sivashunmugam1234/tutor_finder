require("dotenv").config();
const config = require('./config/env');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: config.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if using local storage
const fs = require('fs');
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files statically if using local storage
app.use('/uploads', express.static('uploads'));

// API Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Tutor Finder API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      teachers: '/api/teachers',
      students: '/api/students'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = config.PORT || 5000;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${config.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${config.MONGO_URI ? 'Connected' : 'Not configured'}`);
  console.log(`☁️  AWS S3: ${config.AWS_S3_BUCKET_NAME ? 'Configured' : 'Not configured (using local storage)'}`);
  console.log(`🌐 CORS: ${config.CLIENT_URL || 'http://localhost:3000'}`);
  console.log('='.repeat(50));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('❌ UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
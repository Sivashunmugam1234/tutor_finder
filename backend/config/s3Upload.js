const config = require('./env');
const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

// Check if AWS credentials are provided
const isS3Configured = config.AWS_ACCESS_KEY_ID && 
                       config.AWS_SECRET_ACCESS_KEY && 
                       config.AWS_S3_BUCKET_NAME;

let upload;

if (isS3Configured) {
  console.log("the s3 is configured");
  
  // Configure AWS S3
  // aws.config.update({
  //   secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  //   accessKeyId: config.AWS_ACCESS_KEY_ID,
  //   region: config.AWS_S3_BUCKET_REGION,
  // });
  const s3 = new S3Client({
    credentials: {
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    },
    region: config.AWS_S3_BUCKET_REGION,
  });

  // const s3 = new aws.S3();

  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: config.AWS_S3_BUCKET_NAME,
      // acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `profile-pictures/${uniqueSuffix}-${file.originalname}`);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    }
  });
} else {
  console.log("the s3 is not configured");

  // Use local storage if S3 is not configured
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });

  upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    }
  });

  console.warn('⚠️  AWS S3 not configured. Using local file storage.');
}

module.exports = upload;
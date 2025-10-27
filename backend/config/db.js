const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI||"mongodb://127.0.0.1:27017/tutorfinder", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

  } catch (error) {

    process.exit(1);
  }
};

module.exports = connectDB;
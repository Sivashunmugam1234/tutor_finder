const AWS = require('aws-sdk');

const ses = new AWS.SES({ 
  region: process.env.AWS_S3_BUCKET_REGION || 'ap-south-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const sendWelcomeEmail = async (email, name, role) => {
  const emailContent = role === 'teacher' 
    ? getTeacherWelcomeEmail(name)
    : getStudentWelcomeEmail(name);
  
  const params = {
    Source: process.env.SENDER_EMAIL,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: `Welcome to Tutor Finder, ${name}!` },
      Body: {
        Html: { Data: emailContent },
        Text: { Data: `Welcome to Tutor Finder, ${name}! We're excited to have you on board.` }
      }
    }
  };
  
  try {
    const result = await ses.sendEmail(params).promise();
    return result;
  } catch (error) {
    throw error;
  }
};

function getTeacherWelcomeEmail(name) {
  return `<h2>Welcome ${name}!</h2><p>Complete your teacher profile to start connecting with students.</p>`;
}

function getStudentWelcomeEmail(name) {
  return `<h2>Welcome ${name}!</h2><p>Start browsing qualified tutors for your learning journey.</p>`;
}

const sendRequestAcceptanceEmail = async (studentEmail, studentName, teacherName, subject) => {
  const emailContent = `
    <h2>Request Accepted!</h2>
    <p>Hi ${studentName},</p>
    <p>Great news! <strong>${teacherName}</strong> has accepted your request to learn <strong>${subject}</strong>.</p>
    <p>You can now contact your teacher to schedule your sessions.</p>
    <p>Best regards,<br>Tutor Finder Team</p>
  `;
  
  const params = {
    Source: process.env.SENDER_EMAIL,
    Destination: { ToAddresses: [studentEmail] },
    Message: {
      Subject: { Data: `Request Accepted - ${subject} with ${teacherName}` },
      Body: {
        Html: { Data: emailContent },
        Text: { Data: `Hi ${studentName}, ${teacherName} has accepted your request to learn ${subject}.` }
      }
    }
  };
  
  try {
    const result = await ses.sendEmail(params).promise();
    return result;
  } catch (error) {
    throw error;
  }
};

const sendRequestRejectionEmail = async (studentEmail, studentName, teacherName, subject) => {
  const emailContent = `
    <h2>Request Update</h2>
    <p>Hi ${studentName},</p>
    <p>Unfortunately, <strong>${teacherName}</strong> is unable to accept your request for <strong>${subject}</strong> at this time.</p>
    <p>Don't worry! There are many other qualified teachers available. Keep exploring!</p>
    <p>Best regards,<br>Tutor Finder Team</p>
  `;
  
  const params = {
    Source: process.env.SENDER_EMAIL,
    Destination: { ToAddresses: [studentEmail] },
    Message: {
      Subject: { Data: `Request Update - ${subject}` },
      Body: {
        Html: { Data: emailContent },
        Text: { Data: `Hi ${studentName}, ${teacherName} is unable to accept your request for ${subject} at this time.` }
      }
    }
  };
  
  try {
    const result = await ses.sendEmail(params).promise();
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = { sendWelcomeEmail, sendRequestAcceptanceEmail, sendRequestRejectionEmail };
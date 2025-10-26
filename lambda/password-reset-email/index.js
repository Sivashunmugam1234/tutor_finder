let ses;

const initializeSES = () => {
  if (!ses) {
    const AWS = require('aws-sdk');
    ses = new AWS.SES({ region: process.env.AWS_REGION || 'ap-south-1' });
  }
  return ses;
};

exports.handler = async (event) => {
  const requestId = event.requestContext?.requestId || 'unknown';
  console.log(`[${requestId}] Lambda invoked`);
  console.log(`[${requestId}] Event:`, JSON.stringify(event, null, 2));
  
  try {
    // Initialize SES
    const sesClient = initializeSES();
    
    // Validate environment variables
    if (!process.env.SENDER_EMAIL) {
      console.error(`[${requestId}] Missing SENDER_EMAIL environment variable`);
      return createErrorResponse(500, 'Server configuration error');
    }
    
    console.log(`[${requestId}] Sender email: ${process.env.SENDER_EMAIL}`);
    
    // Parse and validate request body
    let body;
    try {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (parseError) {
      console.error(`[${requestId}] JSON parse error:`, parseError.message);
      return createErrorResponse(400, 'Invalid JSON in request body');
    }
    
    console.log(`[${requestId}] Parsed body:`, body);
    
    const { email, name, resetToken, resetUrl } = body;
    
    // Validate required fields
    if (!email || !name || !resetToken) {
      console.error(`[${requestId}] Missing required fields`);
      return createErrorResponse(400, 'Missing required fields: email, name, resetToken');
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
      console.error(`[${requestId}] Invalid email format: ${email}`);
      return createErrorResponse(400, 'Invalid email format');
    }
    
    const finalResetUrl = resetUrl || `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    console.log(`[${requestId}] Reset URL generated`);
    
    const emailContent = getPasswordResetEmail(name, finalResetUrl);
    
    const params = {
      Source: process.env.SENDER_EMAIL,
      Destination: {
        ToAddresses: [email]
      },
      Message: {
        Subject: {
          Data: 'Password Reset Request - Tutor Finder',
          Charset: 'UTF-8'
        },
        Body: {
          Html: {
            Data: emailContent,
            Charset: 'UTF-8'
          },
          Text: {
            Data: `Hi ${name}, you requested a password reset. Click the link to reset your password: ${finalResetUrl}`,
            Charset: 'UTF-8'
          }
        }
      }
    };
    
    console.log(`[${requestId}] Sending email to: ${email}`);
    
    // Send email with timeout
    const result = await Promise.race([
      sesClient.sendEmail(params).promise(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email send timeout')), 10000)
      )
    ]);
    
    console.log(`[${requestId}] Email sent successfully. MessageId: ${result.MessageId}`);
    
    return createSuccessResponse({
      message: 'Password reset email sent successfully',
      messageId: result.MessageId
    });
    
  } catch (error) {
    console.error(`[${requestId}] Error:`, {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Handle specific error types
    if (error.code === 'MessageRejected') {
      console.error(`[${requestId}] Email rejected - verify sender in SES`);
      return createErrorResponse(500, 'Email delivery failed - sender not verified');
    }
    
    if (error.code === 'ValidationError') {
      console.error(`[${requestId}] Validation error in SES parameters`);
      return createErrorResponse(400, 'Invalid email parameters');
    }
    
    if (error.message === 'Email send timeout') {
      console.error(`[${requestId}] Email send timeout`);
      return createErrorResponse(504, 'Email send timeout');
    }
    
    return createErrorResponse(500, 'Failed to send password reset email');
  }
};

function createSuccessResponse(data) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ success: true, ...data })
  };
}

function createErrorResponse(statusCode, message) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ success: false, message })
  };
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function getPasswordResetEmail(name, resetUrl) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>You requested a password reset for your Tutor Finder account.</p>
          
          <p>Click the button below to reset your password:</p>
          
          <a href="${resetUrl}" class="button">Reset Password</a>
          
          <div class="warning">
            <strong>Important:</strong>
            <ul>
              <li>This link will expire in 1 hour</li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>For security, never share this link with anyone</li>
            </ul>
          </div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
          
          <p>Best regards,<br>The Tutor Finder Team</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 Tutor Finder. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
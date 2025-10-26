const axios = require('axios');

class EmailService {
  constructor() {
    this.lambdaEndpoints = {
      passwordReset: process.env.LAMBDA_PASSWORD_RESET_URL
    };
  }

  /**
   * Send password reset email via Lambda
   */
  async sendPasswordResetEmail(email, name, resetToken) {
    try {
      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
      
      const response = await axios.post(
        this.lambdaEndpoints.passwordReset,
        {
          email,
          name,
          resetToken,
          resetUrl
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000 // 10 seconds timeout
        }
      );
      
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
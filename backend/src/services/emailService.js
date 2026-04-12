/**
 * Core Email Service for OmniRent
 * Using Brevo's HTTP API (Bypasses Render's blocked SMTP ports)
 */
const emailService = {

  /**
   * Send a verification email to a new user
   */
  sendVerificationEmail: async (email, name, token, backendUrl) => {
    const verificationUrl = `${backendUrl}/api/auth/verify-email?token=${token}`;

    const html = `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 2rem; border-radius: 12px;">
        <h2 style="color: #4b5563;">Welcome to OmniRent, ${name}!</h2>
        <p>Please click the button below to verify your email address and activate your account.</p>
        <a href="${verificationUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 1rem 0;">Verify My Email</a>
        <p style="color: #9ca3af; font-size: 0.8rem;">If the button doesn't work, copy and paste this link: <br> ${verificationUrl}</p>
      </div>
    `;

    return emailService._send(email, name, 'Verify your OmniRent Account', html);
  },

  /**
   * Send a secure password recovery link
   */
  sendPasswordResetEmail: async (email, name, token, frontendUrl) => {
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    const html = `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 2rem; border-radius: 12px;">
        <h2 style="color: #ef4444;">Password Reset Request</h2>
        <p>Hi ${name}, we received a request to reset your OmniRent password.</p>
        <a href="${resetUrl}" style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 1rem 0;">Reset Password</a>
        <p style="color: #9ca3af; font-size: 0.8rem;">If you did not make this request, you can safely ignore this email.</p>
      </div>
    `;

    return emailService._send(email, name, 'OmniRent Password Reset', html);
  },

  /**
   * Notify Owner of a new Rental Request
   */
  sendRentalRequestAlert: async (ownerEmail, ownerName, itemName, renterName, totalPrice) => {
    const html = `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 2rem; border-radius: 12px;">
        <h2 style="color: #4b5563;">New Rental Request!</h2>
        <p>Hi ${ownerName}, someone wants to rent your <strong>${itemName}</strong>.</p>
        <p><strong>Renter:</strong> ${renterName}</p>
        <p><strong>Earnings:</strong> $${totalPrice}</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 1rem 0;">
        <p>Please log in to your dashboard to manage this handover.</p>
      </div>
    `;

    return emailService._send(ownerEmail, ownerName, `Action Required: New Rental Request for ${itemName}`, html);
  },

  /**
   * Final Receipt for both parties
   */
  sendRentalReceipt: async (userEmail, userName, role, itemName, totalPrice, rentalId) => {
    const html = `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 2rem; border-radius: 12px;">
        <h2 style="color: #059669;">Rental Completed - Receipt</h2>
        <p>Hi ${userName}, the transaction for <strong>${itemName}</strong> is now complete.</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Total Amount:</strong> $${totalPrice}</p>
        <p><strong>Rental ID:</strong> #${rentalId}</p>
        <p>Your escrow balance has been updated accordingly.</p>
      </div>
    `;

    return emailService._send(userEmail, userName, `OmniRent Receipt: ${itemName}`, html);
  },

  /**
   * Unified Send Helper via Brevo HTTP API
   */
  _send: async (toEmail, toName, subject, htmlContent) => {
    if (!process.env.BREVO_API_KEY) {
      console.log('--- EMAIL MOCK (No BREVO_API_KEY provided) ---');
      console.log(`TO: ${toName} <${toEmail}>`);
      console.log(`SUBJECT: ${subject}`);
      console.log('------------------');
      return { id: 'mock-id' };
    }

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: "OmniRent",
            // Make sure you register an active verified email with Brevo!
            email: process.env.EMAIL_USER || "admin@omnirent.org"
          },
          to: [
            {
              email: toEmail,
              name: toName || toEmail.split('@')[0]
            }
          ],
          subject: subject,
          htmlContent: htmlContent
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`Brevo API Error: ${JSON.stringify(responseData)}`);
      }

      console.log(`✅ Email sent via Brevo HTTP API to: ${toEmail} (Message ID: ${responseData.messageId})`);
      return responseData;
    } catch (error) {
      console.error('Email Dispatch Error:', error.message || error);
      throw error;
    }
  }
};

module.exports = emailService;

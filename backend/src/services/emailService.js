const nodemailer = require('nodemailer');

const transporter = process.env.EMAIL_USER && process.env.EMAIL_PASS
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
  : null;

/**
 * Core Email Service for OmniRent
 * Using Nodemailer (Fallback to Console Logging in Dev if credentials missing)
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

    return emailService._send(email, 'Verify your OmniRent Account', html);
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

    return emailService._send(email, 'OmniRent Password Reset', html);
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

    return emailService._send(ownerEmail, `Action Required: New Rental Request for ${itemName}`, html);
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

    return emailService._send(userEmail, `OmniRent Receipt: ${itemName}`, html);
  },

  /**
   * Unified Send Helper
   */
  _send: async (to, subject, html) => {
    if (!transporter) {
      console.log('--- EMAIL MOCK (No EMAIL_USER/EMAIL_PASS provided) ---');
      console.log(`TO: ${to}`);
      console.log(`SUBJECT: ${subject}`);
      console.log('------------------');
      return { id: 'mock-id' };
    }

    try {
      const info = await transporter.sendMail({
        from: `"OmniRent Support" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        html: html,
      });
      return info;
    } catch (error) {
      console.error('Email Dispatch Error:', error);
      throw error;
    }
  }
};

module.exports = emailService;

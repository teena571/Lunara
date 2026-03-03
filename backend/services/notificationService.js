/**
 * NOTIFICATION SERVICE
 * 
 * Modular notification system supporting multiple channels:
 * - Email notifications
 * - Push notifications (ready for integration)
 * - In-app notifications
 */

const nodemailer = require('nodemailer');

/**
 * Email Configuration
 * Configure your email service (Gmail, SendGrid, etc.)
 */
const createEmailTransporter = async () => {
  // If no email configured, use Ethereal (fake SMTP for testing)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || 
      process.env.EMAIL_USER === 'get_from_mailtrap_dashboard') {
    
    console.log('📧 No email configured. Using Ethereal (test account)...');
    
    // Generate test account (only for development)
    const nodemailer = require('nodemailer');
    const testAccount = await nodemailer.createTestAccount();
    
    console.log('✅ Ethereal test account created:');
    console.log('   Preview emails at: https://ethereal.email');
    console.log('   User:', testAccount.user);
    
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }

  // Use configured email service
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

/**
 * Send Email Notification
 */
const sendEmail = async (to, subject, html, text) => {
  try {
    // Skip if email not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('📧 Email not configured. Skipping email notification.');
      console.log(`Would send to: ${to}`);
      console.log(`Subject: ${subject}`);
      return { success: false, message: 'Email not configured' };
    }

    const transporter = createEmailTransporter();

    const mailOptions = {
      from: `"Lunara Wellness" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send Period Reminder Email
 */
const sendPeriodReminder = async (user, daysUntil, nextPeriodDate) => {
  const subject = `🌸 Period Reminder - ${daysUntil} days to go`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #9b87f5 0%, #ffa07a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #9b87f5; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌸 Period Reminder</h1>
        </div>
        <div class="content">
          <p>Hi ${user.name},</p>
          <p>Your period is expected in <strong>${daysUntil} days</strong> on <strong>${nextPeriodDate}</strong>.</p>
          <p>Here are some tips to prepare:</p>
          <ul>
            <li>✅ Stock up on menstrual products</li>
            <li>✅ Stay hydrated</li>
            <li>✅ Get enough rest</li>
            <li>✅ Have pain relief ready if needed</li>
          </ul>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/cycle" class="button">
            View Your Cycle
          </a>
        </div>
        <div class="footer">
          <p>You're receiving this because you have notifications enabled in Lunara.</p>
          <p>© ${new Date().getFullYear()} Lunara Wellness. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Hi ${user.name},
    
    Your period is expected in ${daysUntil} days on ${nextPeriodDate}.
    
    Tips to prepare:
    - Stock up on menstrual products
    - Stay hydrated
    - Get enough rest
    - Have pain relief ready if needed
    
    View your cycle: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/cycle
  `;

  return await sendEmail(user.email, subject, html, text);
};

/**
 * Send Ovulation Reminder Email
 */
const sendOvulationReminder = async (user, ovulationDate, fertileWindowStart, fertileWindowEnd) => {
  const subject = '🌸 Ovulation & Fertile Window Reminder';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #7dd3c0 0%, #34D399 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 15px; border-left: 4px solid #7dd3c0; margin: 15px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #7dd3c0; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌸 Ovulation Reminder</h1>
        </div>
        <div class="content">
          <p>Hi ${user.name},</p>
          <p>Your ovulation is predicted for <strong>${ovulationDate}</strong>.</p>
          
          <div class="info-box">
            <h3>🌱 Your Fertile Window</h3>
            <p><strong>Start:</strong> ${fertileWindowStart}</p>
            <p><strong>End:</strong> ${fertileWindowEnd}</p>
            <p>This is your most fertile time of the month.</p>
          </div>
          
          <p><strong>What to know:</strong></p>
          <ul>
            <li>🌟 Peak fertility is 2-3 days before ovulation</li>
            <li>💧 Stay well hydrated</li>
            <li>🥗 Eat nutritious foods</li>
            <li>😌 Manage stress levels</li>
          </ul>
          
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/cycle" class="button">
            View Your Cycle
          </a>
        </div>
        <div class="footer">
          <p>You're receiving this because you have notifications enabled in Lunara.</p>
          <p>© ${new Date().getFullYear()} Lunara Wellness. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Hi ${user.name},
    
    Your ovulation is predicted for ${ovulationDate}.
    
    Your Fertile Window:
    Start: ${fertileWindowStart}
    End: ${fertileWindowEnd}
    
    What to know:
    - Peak fertility is 2-3 days before ovulation
    - Stay well hydrated
    - Eat nutritious foods
    - Manage stress levels
    
    View your cycle: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/cycle
  `;

  return await sendEmail(user.email, subject, html, text);
};

/**
 * Send Push Notification (Ready for integration)
 * Integrate with Firebase Cloud Messaging, OneSignal, etc.
 */
const sendPushNotification = async (userId, title, body, data = {}) => {
  try {
    // TODO: Integrate with push notification service
    console.log('📱 Push notification (not configured):');
    console.log(`User: ${userId}`);
    console.log(`Title: ${title}`);
    console.log(`Body: ${body}`);
    console.log(`Data:`, data);
    
    return { success: false, message: 'Push notifications not configured' };
  } catch (error) {
    console.error('❌ Push notification error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send In-App Notification
 * Store notification in database for user to see in app
 */
const sendInAppNotification = async (userId, title, message, type = 'info') => {
  try {
    // TODO: Save to Notification model in database
    console.log('🔔 In-app notification:');
    console.log(`User: ${userId}`);
    console.log(`Title: ${title}`);
    console.log(`Message: ${message}`);
    console.log(`Type: ${type}`);
    
    return { success: true, message: 'In-app notification logged' };
  } catch (error) {
    console.error('❌ In-app notification error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send Multi-Channel Notification
 * Send notification through all enabled channels
 */
const sendMultiChannelNotification = async (user, notification) => {
  const results = {
    email: null,
    push: null,
    inApp: null
  };

  // Send email if enabled
  if (user.notificationPreferences?.email !== false) {
    if (notification.type === 'period') {
      results.email = await sendPeriodReminder(
        user,
        notification.daysUntil,
        notification.nextPeriodDate
      );
    } else if (notification.type === 'ovulation') {
      results.email = await sendOvulationReminder(
        user,
        notification.ovulationDate,
        notification.fertileWindowStart,
        notification.fertileWindowEnd
      );
    }
  }

  // Send push if enabled
  if (user.notificationPreferences?.push !== false) {
    results.push = await sendPushNotification(
      user._id,
      notification.title,
      notification.body,
      notification.data
    );
  }

  // Always send in-app notification
  results.inApp = await sendInAppNotification(
    user._id,
    notification.title,
    notification.body,
    notification.type
  );

  return results;
};

module.exports = {
  sendEmail,
  sendPeriodReminder,
  sendOvulationReminder,
  sendPushNotification,
  sendInAppNotification,
  sendMultiChannelNotification
};

const nodemailer = require('nodemailer');

const DEFAULT_SMTP = {
  host: 'smtp.gmail.com',
  port: 587,
  user: 'trekbest30@gmail.com',
  pass: 'yeim bnsl ifcg mvqs',
  from: 'TrekBest Travel & Tours <trekbest30@gmail.com>'
};

// Check if SMTP is configured
function isSmtpConfigured() {
  const pass = process.env.SMTP_PASS || DEFAULT_SMTP.pass;
  return Boolean(pass && pass !== 'your_smtp_password_or_app_password');
}

// Create Nodemailer transporter
function getTransporter() {
  if (!isSmtpConfigured()) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || DEFAULT_SMTP.host,
    port: Number(process.env.SMTP_PORT) || DEFAULT_SMTP.port,
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER || DEFAULT_SMTP.user,
      pass: process.env.SMTP_PASS || DEFAULT_SMTP.pass
    }
  });
}

// Generic mail sender with fallback
async function sendMail({ to, subject, html, text }) {
  const from = process.env.EMAIL_FROM || 'TrekBest Travel & Tours <trekbest30@gmail.com>';

  if (!isSmtpConfigured()) {
    console.log('====================================================');
    console.log(`📧 [EMAIL SIMULATION - SMTP NOT YET CONFIGURED]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('Provide SMTP_USER & SMTP_PASS in .env to send real emails.');
    console.log('====================================================');
    return { success: true, simulated: true };
  }

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: text || '',
      html
    });
    console.log(`✅ Email sent successfully to ${to}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
}

// 1. Booking Confirmation Email Template
async function sendBookingConfirmation(booking) {
  const subject = `Booking Confirmation - ${booking.packageTitle} [Ref: ${booking.id}]`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0B1310; color: #F2F7F4; border-radius: 12px; overflow: hidden; border: 1px solid #20382E;">
      <div style="background: #142B20; padding: 24px; text-align: center; border-bottom: 2px solid #F25C05;">
        <h1 style="color: #F25C05; margin: 0; font-size: 24px;">trek<span style="color: #fff;">best</span></h1>
        <p style="color: #8FA298; margin: 4px 0 0; font-size: 12px; letter-spacing: 2px;">TRAVEL & TOURS</p>
      </div>

      <div style="padding: 24px;">
        <h2 style="color: #F2F7F4; font-size: 20px; margin-top: 0;">Reservation Confirmed!</h2>
        <p style="color: #CCDCD4; font-size: 14px; line-height: 1.6;">
          Dear <strong>${booking.customerName}</strong>,<br>
          Thank you for choosing TrekBest. We have received your booking reservation.
        </p>

        <div style="background: #121F1A; border: 1px solid #20382E; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <table style="width: 100%; font-size: 13px; color: #CCDCD4;">
            <tr>
              <td style="padding: 6px 0; color: #8FA298;">Booking Reference:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #F25C05;">${booking.id}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #8FA298;">Tour Package:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #fff;">${booking.packageTitle}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #8FA298;">Travel Date:</td>
              <td style="padding: 6px 0; color: #fff;">${booking.travelDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #8FA298;">Guests:</td>
              <td style="padding: 6px 0; color: #fff;">${booking.travelers} Persons</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #8FA298;">Total Amount:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #F25C05; font-size: 16px;">₹${Number(booking.totalAmount || 0).toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </div>

        <p style="color: #CCDCD4; font-size: 13px; line-height: 1.5;">
          Our tour manager will reach out via WhatsApp/Phone at <strong>${booking.customerPhone}</strong> with detailed hotel vouchers and travel guides.
        </p>

        <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #20382E; font-size: 12px; color: #8FA298; text-align: center;">
          Need urgent assistance? Contact us at trekbest30@gmail.com or +91 98249 99054 / +91 95104 42740.
        </div>
      </div>
    </div>
  `;

  return sendMail({
    to: booking.customerEmail,
    subject,
    html
  });
}

// 2. Contact Inquiry Acknowledgment Email
async function sendContactNotification(contact) {
  const subject = `Trip Inquiry Received - TrekBest Travel Desk`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0B1310; color: #F2F7F4; border-radius: 12px; overflow: hidden; border: 1px solid #20382E; padding: 24px;">
      <h2 style="color: #F25C05; margin-top: 0;">We've Received Your Inquiry</h2>
      <p style="color: #CCDCD4; font-size: 14px; line-height: 1.6;">
        Hi <strong>${contact.name}</strong>,<br>
        Thank you for inquiring about <em>${contact.subject}</em>. Our travel designers are customizing your itinerary and will get in touch shortly.
      </p>
      <div style="background: #121F1A; border-left: 3px solid #F25C05; padding: 12px; margin: 16px 0; font-size: 13px; color: #8FA298;">
        "${contact.message}"
      </div>
      <p style="font-size: 12px; color: #8FA298;">TrekBest Travel & Tours Desk</p>
    </div>
  `;

  return sendMail({
    to: contact.email,
    subject,
    html
  });
}

// 3. Invoice & Voucher Email Template
async function sendInvoiceEmail(invoice) {
  if (!invoice || !invoice.clientEmail) {
    return { success: false, error: 'No client email provided' };
  }

  const curr = invoice.currency === 'USD' ? '$' : (invoice.currency === 'EUR' ? '€' : '₹');
  const items = Array.isArray(invoice.items) ? invoice.items : (invoice.items ? JSON.parse(invoice.items) : []);

  const itemsRows = items.map((item, idx) => `
    <tr style="border-bottom: 1px solid #1c3328;">
      <td style="padding: 10px 8px; color: #8FA298; font-size: 12px; text-align: center;">${idx + 1}</td>
      <td style="padding: 10px 8px;">
        <strong style="color: #F2F7F4; font-size: 13px;">${item.title || 'Travel Service'}</strong>
        ${item.sub ? `<div style="color: #8FA298; font-size: 11px; margin-top: 2px;">${item.sub}</div>` : ''}
      </td>
      <td style="padding: 10px 8px; text-align: center; color: #CCDCD4; font-size: 12px;">${item.qty || 1}</td>
      <td style="padding: 10px 8px; text-align: right; color: #CCDCD4; font-size: 12px;">${curr}${Number(item.rate || 0).toLocaleString('en-IN')}</td>
      <td style="padding: 10px 8px; text-align: right; color: #F2F7F4; font-weight: bold; font-size: 12px;">${curr}${Number((item.qty || 1) * (item.rate || 0)).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const statusColor = (invoice.status || '').toLowerCase() === 'paid' ? '#10B981' : '#F59E0B';

  const subject = `Your TrekBest Travel Invoice & Voucher [${invoice.invoiceNo}] - ${invoice.destination || 'Tour Package'}`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #0B1310; color: #F2F7F4; border-radius: 12px; overflow: hidden; border: 1px solid #20382E;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #142B20 0%, #0B1310 100%); padding: 24px 28px; border-bottom: 2px solid #F25C05;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: middle;">
              <h1 style="color: #F25C05; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">trek<span style="color: #fff;">best</span></h1>
              <p style="color: #8FA298; margin: 3px 0 0; font-size: 11px; letter-spacing: 2px; font-weight: 600;">TRAVEL & TOURS • OFFICIAL INVOICE</p>
            </td>
            <td style="vertical-align: middle; text-align: right;">
              <span style="display: inline-block; background: ${statusColor}22; border: 1px solid ${statusColor}; color: ${statusColor}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                ${invoice.status || 'PAID'}
              </span>
              <div style="color: #8FA298; font-size: 12px; margin-top: 6px;">Invoice: <strong style="color: #fff;">${invoice.invoiceNo}</strong></div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Main Body -->
      <div style="padding: 24px 28px;">
        <!-- Greeting -->
        <p style="color: #CCDCD4; font-size: 14px; line-height: 1.6; margin-top: 0;">
          Dear <strong>${invoice.clientName}</strong>,<br>
          Thank you for choosing TrekBest Travel & Tours. Here is your official invoice and confirmed service voucher for <strong>${invoice.destination || 'your upcoming trip'}</strong>.
        </p>

        <!-- Details Grid -->
        <table style="width: 100%; margin: 18px 0; border-collapse: collapse; background: #121F1A; border: 1px solid #20382E; border-radius: 8px;">
          <tr>
            <td style="padding: 14px 16px; vertical-align: top; width: 50%; border-right: 1px solid #20382E;">
              <div style="font-size: 11px; color: #8FA298; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin-bottom: 6px;">BILLED TO</div>
              <div style="font-size: 14px; font-weight: bold; color: #fff;">${invoice.clientName}</div>
              ${invoice.clientEmail ? `<div style="font-size: 12px; color: #CCDCD4; margin-top: 3px;">✉ ${invoice.clientEmail}</div>` : ''}
              ${invoice.clientPhone ? `<div style="font-size: 12px; color: #CCDCD4; margin-top: 2px;">📞 ${invoice.clientPhone}</div>` : ''}
              ${invoice.clientAddress ? `<div style="font-size: 11px; color: #8FA298; margin-top: 3px;">📍 ${invoice.clientAddress}</div>` : ''}
            </td>
            <td style="padding: 14px 16px; vertical-align: top; width: 50%;">
              <div style="font-size: 11px; color: #8FA298; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin-bottom: 6px;">TRIP DETAILS</div>
              <div style="font-size: 13px; color: #CCDCD4;"><strong>Destination:</strong> <span style="color: #fff;">${invoice.destination || 'Custom Tour'}</span></div>
              <div style="font-size: 13px; color: #CCDCD4; margin-top: 4px;"><strong>Travel Date:</strong> <span style="color: #fff;">${invoice.travelDate || 'Flexible'}</span></div>
              <div style="font-size: 13px; color: #CCDCD4; margin-top: 4px;"><strong>Travelers:</strong> <span style="color: #fff;">${invoice.pax || 1} Pax</span></div>
              <div style="font-size: 13px; color: #CCDCD4; margin-top: 4px;"><strong>Issue Date:</strong> <span style="color: #fff;">${invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')}</span></div>
            </td>
          </tr>
        </table>

        <!-- Line Items Table -->
        <div style="margin: 22px 0;">
          <div style="font-size: 11px; color: #8FA298; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin-bottom: 8px;">BOOKED SERVICES & INCLUSIONS</div>
          <table style="width: 100%; border-collapse: collapse; background: #0E1814; border: 1px solid #20382E; border-radius: 8px;">
            <thead>
              <tr style="background: #142B20; color: #8FA298; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; text-align: left;">
                <th style="padding: 10px 8px; width: 28px; text-align: center;">#</th>
                <th style="padding: 10px 8px;">Service Details</th>
                <th style="padding: 10px 8px; text-align: center;">Qty</th>
                <th style="padding: 10px 8px; text-align: right;">Rate</th>
                <th style="padding: 10px 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>
        </div>

        <!-- Total Calculation Summary -->
        <div style="text-align: right; margin-top: 16px;">
          <table style="width: 270px; margin-left: auto; font-size: 13px; color: #CCDCD4; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0; text-align: left; color: #8FA298;">Subtotal:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: 600; color: #fff;">${curr}${Number(invoice.subtotal || 0).toLocaleString('en-IN')}</td>
            </tr>
            ${Number(invoice.discount || 0) > 0 ? `
              <tr>
                <td style="padding: 5px 0; text-align: left; color: #10B981;">Discount:</td>
                <td style="padding: 5px 0; text-align: right; font-weight: 600; color: #10B981;">-${curr}${Number(invoice.discount).toLocaleString('en-IN')}</td>
              </tr>
            ` : ''}
            <tr>
              <td style="padding: 5px 0; text-align: left; color: #8FA298;">GST (${invoice.gstPercent || 5}%):</td>
              <td style="padding: 5px 0; text-align: right; font-weight: 600; color: #fff;">${curr}${Number(invoice.tax || 0).toLocaleString('en-IN')}</td>
            </tr>
            <tr style="border-top: 2px solid #20382E; border-bottom: 2px solid #20382E;">
              <td style="padding: 8px 0; text-align: left; font-size: 15px; font-weight: 800; color: #F25C05;">Total:</td>
              <td style="padding: 8px 0; text-align: right; font-size: 17px; font-weight: 800; color: #F25C05;">${curr}${Number(invoice.total || 0).toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </div>

        ${invoice.notes ? `
          <div style="background: #121F1A; border-left: 3px solid #F25C05; padding: 12px 14px; margin: 20px 0 16px 0; border-radius: 4px;">
            <div style="font-size: 11px; font-weight: 700; color: #8FA298; text-transform: uppercase; margin-bottom: 4px;">Notes & Inclusions:</div>
            <div style="font-size: 12px; color: #CCDCD4; line-height: 1.5;">${invoice.notes}</div>
          </div>
        ` : ''}

        <!-- Footer Notice -->
        <div style="margin-top: 26px; padding-top: 18px; border-top: 1px solid #20382E; font-size: 12px; color: #8FA298; text-align: center; line-height: 1.5;">
          Have questions or need amendments? Contact your dedicated TrekBest travel manager.<br>
          📧 <strong style="color: #fff;">trekbest30@gmail.com</strong> | 📞 <strong style="color: #fff;">+91 98249 99054 / +91 95104 42740</strong><br>
          <span style="font-size: 11px; color: #5B7569; margin-top: 6px; display: inline-block;">© ${new Date().getFullYear()} TrekBest Travel & Tours. All rights reserved.</span>
        </div>
      </div>
    </div>
  `;

  return sendMail({
    to: invoice.clientEmail,
    subject,
    html
  });
}

// 4. Test SMTP Connection
async function testSmtpConnection() {
  if (!isSmtpConfigured()) {
    return {
      connected: false,
      message: 'SMTP credentials missing in .env (SMTP_HOST, SMTP_USER, SMTP_PASS)'
    };
  }

  try {
    const transporter = getTransporter();
    await transporter.verify();
    return {
      connected: true,
      message: 'SMTP connection successfully verified!'
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message
    };
  }
}

module.exports = {
  sendMail,
  sendBookingConfirmation,
  sendContactNotification,
  sendInvoiceEmail,
  testSmtpConnection,
  isSmtpConfigured
};


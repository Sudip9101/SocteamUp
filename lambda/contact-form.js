/**
 * AWS Lambda function for handling contact form submissions
 * This function processes form data, validates input, and sends notifications
 */

const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' });

// CORS headers for frontend integration
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'https://socteamup.com',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// Input validation function
const validateInput = (data) => {
  const { name, email, subject, message } = data;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Please provide a valid email address');
  }

  if (!subject || subject.trim().length < 5) {
    errors.push('Subject must be at least 5 characters long');
  }

  if (!message || message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long');
  }

  return errors;
};

// Send email notification
const sendEmail = async (formData) => {
  const { name, email, subject, message } = formData;
  
  const emailParams = {
    Destination: {
      ToAddresses: [process.env.CONTACT_EMAIL || 'support@socteamup.com']
    },
    Message: {
      Body: {
        Html: {
          Data: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>Sent from SocTeamUp Contact Form</small></p>
          `
        },
        Text: {
          Data: `
            New Contact Form Submission
            
            Name: ${name}
            Email: ${email}
            Subject: ${subject}
            
            Message:
            ${message}
            
            ---
            Sent from SocTeamUp Contact Form
          `
        }
      },
      Subject: {
        Data: `[SocTeamUp] ${subject}`
      }
    },
    Source: process.env.FROM_EMAIL || 'noreply@socteamup.com'
  };

  return ses.sendEmail(emailParams).promise();
};

// Auto-reply to user
const sendAutoReply = async (userEmail, userName) => {
  const autoReplyParams = {
    Destination: {
      ToAddresses: [userEmail]
    },
    Message: {
      Body: {
        Html: {
          Data: `
            <h2>Thank you for contacting SocTeamUp!</h2>
            <p>Hi ${userName},</p>
            <p>We've received your message and will get back to you within 24 hours.</p>
            <p>In the meantime, feel free to explore our platform and check out our developer documentation.</p>
            <p>Best regards,<br>The SocTeamUp Team</p>
            <hr>
            <p><small>This is an automated response. Please do not reply to this email.</small></p>
          `
        },
        Text: {
          Data: `
            Thank you for contacting SocTeamUp!
            
            Hi ${userName},
            
            We've received your message and will get back to you within 24 hours.
            
            In the meantime, feel free to explore our platform and check out our developer documentation.
            
            Best regards,
            The SocTeamUp Team
            
            ---
            This is an automated response. Please do not reply to this email.
          `
        }
      },
      Subject: {
        Data: 'Thank you for contacting SocTeamUp'
      }
    },
    Source: process.env.FROM_EMAIL || 'noreply@socteamup.com'
  };

  return ses.sendEmail(autoReplyParams).promise();
};

// Main Lambda handler
exports.handler = async (event) => {
  console.log('Contact form submission received:', JSON.stringify(event, null, 2));

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const formData = JSON.parse(event.body);
    console.log('Form data:', formData);

    // Validate input
    const validationErrors = validateInput(formData);
    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Validation failed',
          details: validationErrors
        })
      };
    }

    // Send notification email to team
    await sendEmail(formData);
    console.log('Notification email sent successfully');

    // Send auto-reply to user
    await sendAutoReply(formData.email, formData.name);
    console.log('Auto-reply sent successfully');

    // Log submission for analytics (optional)
    // await logSubmission(formData);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Thank you for your message! We\'ll get back to you soon.'
      })
    };

  } catch (error) {
    console.error('Error processing contact form:', error);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Internal server error',
        message: 'Unable to process your request. Please try again later.'
      })
    };
  }
}; 
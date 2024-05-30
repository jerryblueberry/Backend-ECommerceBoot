const nodemailer = require('nodemailer');
const { signupMailTemplate } = require('../emailTemplates/signupMailTemplate');
const mjml2html = require('mjml');
const {forgotPasswordTemplate} = require('../emailTemplates/forgotPasswordTemplate');

const sendSignupMail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'jerrytechs83@gmail.com',
        pass: 'kafj iqdy dwsb tcpr',
      },
    });

    const { html } = mjml2html(signupMailTemplate(otp));

    const mailOptions = {
      from: 'Multivendor Store',
      to: email,
      subject: 'Signup Verification OTP',
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent Successfully');
  } catch (error) {
    console.log('Error Occurred while sending mail', error);
  }
};

const sendForgotPasswordMail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'jerrytechs83@gmail.com',
        pass: 'kafj iqdy dwsb tcpr',
      },
    });

    const { html } = mjml2html(forgotPasswordTemplate(otp));

    const mailOptions = {
      from: 'Multivendor Store',
      to: email,
      subject: 'Password Recovery',
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log('Password Reset OTP  email sent Successfully');
  } catch (error) {
    console.log('Error OCcurred While sending recovery otp', error);
  }
};



module.exports = { sendSignupMail, sendForgotPasswordMail };

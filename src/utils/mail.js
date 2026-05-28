import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Project Manager",
      link: "https://projectmanagerlink.com",
    },
  });

  const emailTexual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const emailTransporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  const mail = {
    from: "mail.projectmanager@example.com",
    to: options.email,
    subject: options.subject,
    text: emailTexual,
    html: emailHtml,
  };

  try {
    await emailTransporter.sendMail(mail);
  } catch (error) {
    console.error("Email service failed: ", error);
  }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcom to our App! Exited to have you",
      action: {
        instructions:
          "To verify your email address, please click on the following button",
        button: {
          color: "rgb(28, 161, 75)",
          text: "Reset Password",
          link: verificationUrl,
        },
      },
      outro: "Need help or have questions? Just reply to this email.",
    },
  };
};

const passwordResetMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to rest your password.",
      action: {
        instructions:
          "To change password, please click on the following button",
        button: {
          color: "rgb(28, 161, 75)",
          text: "Change Password",
          link: passwordResetUrl,
        },
      },
      outro: "Need help or have questions? Just reply to this email.",
    },
  };
};

export {
  emailVerificationMailgenContent,
  passwordResetMailgenContent,
  sendEmail,
};

import nodemailer from "nodemailer";

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  service?: string;
  message: string;
};

function getTransporter() {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

export async function sendContactEmail(data: ContactPayload) {
  const to = process.env.EMAIL_TO || process.env.EMAIL_USER;
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error(
      "Email is not configured. Set EMAIL_USER and EMAIL_PASSWORD in your environment."
    );
  }

  const transporter = getTransporter();
  const timestamp = new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" });

  await transporter.sendMail({
    from: `"ALDATA Website" <${process.env.EMAIL_USER}>`,
    to,
    replyTo: data.email,
    subject: "New ALDATA Website Inquiry",
    text: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Service: ${data.service || "Not specified"}`,
      `Message: ${data.message}`,
      `Date/Time: ${timestamp}`,
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #241A16; max-width: 560px;">
        <h2 style="color:#4A2F23;">New ALDATA Website Inquiry</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding:6px 0; font-weight:bold;">Name</td><td>${escapeHtml(data.name)}</td></tr>
          <tr><td style="padding:6px 0; font-weight:bold;">Email</td><td>${escapeHtml(data.email)}</td></tr>
          <tr><td style="padding:6px 0; font-weight:bold;">Phone</td><td>${escapeHtml(data.phone)}</td></tr>
          <tr><td style="padding:6px 0; font-weight:bold;">Service</td><td>${escapeHtml(data.service || "Not specified")}</td></tr>
          <tr><td style="padding:6px 0; font-weight:bold; vertical-align:top;">Message</td><td>${escapeHtml(data.message)}</td></tr>
          <tr><td style="padding:6px 0; font-weight:bold;">Date/Time</td><td>${timestamp}</td></tr>
        </table>
      </div>
    `,
  });
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

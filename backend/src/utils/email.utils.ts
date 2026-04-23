import nodemailer from "nodemailer";
import { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM, CLIENT_URL, NODE_ENV } from "../config/env.js";

function createTransporter() {
  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
}

async function sendMail(to: string, subject: string, html: string, devUrl?: string): Promise<void> {
  const transporter = createTransporter();

  if (!transporter) {
    if (NODE_ENV !== "production") {
      console.log("\n" + "─".repeat(60));
      console.log(`📧  [DEV EMAIL]  To: ${to}`);
      console.log(`    Subject: ${subject}`);
      if (devUrl) {
        console.log(`\n    👉  COPY THIS URL:\n    ${devUrl}\n`);
      }
      console.log("─".repeat(60) + "\n");
      return;
    }
    throw new Error("Email transport is not configured. Set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS.");
  }

  await transporter.sendMail({ from: EMAIL_FROM, to, subject, html });
}

export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  const link = `${CLIENT_URL}/verify-email?token=${token}`;
  await sendMail(
    to,
    "Verify your OnePlace account",
    `<p>Welcome to OnePlace! Click the link below to verify your email address.</p>
     <p><a href="${link}">${link}</a></p>
     <p>This link expires in 24 hours.</p>`,
    link,
  );
}

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
  const link = `${CLIENT_URL}/reset-password?token=${token}`;
  await sendMail(
    to,
    "Reset your OnePlace password",
    `<p>You requested a password reset. Click the link below to set a new password.</p>
     <p><a href="${link}">${link}</a></p>
     <p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>`,
    link,
  );
}

export async function sendWelcomeEmail(to: string, firstname: string): Promise<void> {
  await sendMail(
    to,
    "Welcome to OnePlace!",
    `<p>Hi ${firstname},</p>
     <p>Your email has been verified and your OnePlace account is ready.</p>
     <p>Start exploring communities or create your own. <a href="${CLIENT_URL}">Go to OnePlace</a></p>`
  );
}

export async function sendPaymentConfirmationEmail(
  to: string,
  firstname: string,
  communityName: string,
  amount: number,
  billingInterval?: string
): Promise<void> {
  const intervalText = billingInterval ? ` (${billingInterval.toLowerCase()})` : "";
  await sendMail(
    to,
    `Payment confirmed — ${communityName}`,
    `<p>Hi ${firstname},</p>
     <p>Your payment of <strong>$${amount}${intervalText}</strong> for <strong>${communityName}</strong> was successful.</p>
     <p>You now have full access to the community. <a href="${CLIENT_URL}/communities">View your communities</a></p>`
  );
}

export async function sendExpiryReminderEmail(
  to: string,
  firstname: string,
  communityName: string,
  expiryDate: Date
): Promise<void> {
  const formatted = expiryDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  await sendMail(
    to,
    `Your ${communityName} subscription expires soon`,
    `<p>Hi ${firstname},</p>
     <p>Your subscription to <strong>${communityName}</strong> expires on <strong>${formatted}</strong>.</p>
     <p>Renew now to keep your access. <a href="${CLIENT_URL}/communities">Renew subscription</a></p>`
  );
}

import nodemailer, { Transporter } from 'nodemailer';

export interface EmailResult {
  success: boolean;
  messageId?: string;
  mode: 'smtp';
  error?: string;
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    try {
      transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      return transporter;
    } catch (err) {
      console.error('[Email Service] Failed to initialize SMTP transporter:', err);
      return null;
    }
  }

  return null;
}

const FROM_ADDRESS = process.env.EMAIL_FROM || '"AYushMan OS Security" <no-reply@ayushman.dev>';

export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendVerificationEmail(
  toEmail: string,
  verificationToken: string,
  fullName: string = 'AYushMan OS User'
): Promise<EmailResult> {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const verifyUrl = `${baseUrl.replace(/\/+$/, '')}/verify-email?token=${encodeURIComponent(verificationToken)}`;

  const transport = getTransporter();

  if (!transport) {
    return {
      success: false,
      mode: 'smtp',
      error: 'Email delivery is not configured.',
    };
  }

  try {
    const info = await transport.sendMail({
      from: FROM_ADDRESS,
      to: toEmail,
      subject: 'AYushMan OS — Verify Your Email Address',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #07090e; color: #f1f5f9; padding: 40px 20px; border-radius: 12px; max-width: 560px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
          <div style="margin-bottom: 24px;">
            <span style="font-size: 20px; font-weight: bold; background: linear-gradient(135deg, #a855f7, #38bdf8); -webkit-background-clip: text; color: #a855f7;">AYushMan OS</span>
            <span style="font-size: 11px; font-family: monospace; color: #94a3b8; margin-left: 8px;">SECURITY DISPATCH</span>
          </div>
          <h2 style="font-size: 18px; color: #ffffff; margin-top: 0;">Verify Your Email Address</h2>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            Hello ${fullName},<br/><br/>
            Thank you for registering with AYushMan OS. Please verify your email address to activate your account session.
          </p>
          <div style="margin: 28px 0;">
            <a href="${verifyUrl}" style="background: linear-gradient(135deg, #7c3aed, #0284c7); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-size: 13px; font-weight: 600; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #64748b; font-size: 12px; line-height: 1.5;">
            If the button doesn't work, copy and paste this link in your browser:<br/>
            <span style="color: #38bdf8; word-break: break-all;">${verifyUrl}</span>
          </p>
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: #64748b;">
            This link expires in 24 hours. If you did not request this verification, please ignore this email.
          </div>
        </div>
      `,
    });

    return {
      success: true,
      messageId: info.messageId,
      mode: 'smtp',
    };
  } catch (err: any) {
    console.error('[Email Service] Failed to send verification email via SMTP:', err);
    return {
      success: false,
      error: err.message,
      mode: 'smtp',
    };
  }
}

export async function sendPasswordResetEmail(
  toEmail: string,
  resetToken: string,
  fullName: string = 'AYushMan OS User'
): Promise<EmailResult> {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${baseUrl.replace(/\/+$/, '')}/reset-password?token=${encodeURIComponent(resetToken)}`;

  const transport = getTransporter();

  if (!transport) {
    return {
      success: false,
      mode: 'smtp',
      error: 'Email delivery is not configured.',
    };
  }

  try {
    const info = await transport.sendMail({
      from: FROM_ADDRESS,
      to: toEmail,
      subject: 'AYushMan OS — Password Reset Request',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #07090e; color: #f1f5f9; padding: 40px 20px; border-radius: 12px; max-width: 560px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
          <div style="margin-bottom: 24px;">
            <span style="font-size: 20px; font-weight: bold; background: linear-gradient(135deg, #a855f7, #38bdf8); -webkit-background-clip: text; color: #a855f7;">AYushMan OS</span>
            <span style="font-size: 11px; font-family: monospace; color: #94a3b8; margin-left: 8px;">SECURITY DISPATCH</span>
          </div>
          <h2 style="font-size: 18px; color: #ffffff; margin-top: 0;">Reset Your Password</h2>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            Hello ${fullName},<br/><br/>
            A password reset was requested for your AYushMan OS account. Click below to establish a new password.
          </p>
          <div style="margin: 28px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #ef4444, #f59e0b); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-size: 13px; font-weight: 600; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #64748b; font-size: 12px; line-height: 1.5;">
            If the button doesn't work, copy and paste this link in your browser:<br/>
            <span style="color: #38bdf8; word-break: break-all;">${resetUrl}</span>
          </p>
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: #64748b;">
            This link expires in 1 hour. If you did not request a password reset, you can safely disregard this message.
          </div>
        </div>
      `,
    });

    return {
      success: true,
      messageId: info.messageId,
      mode: 'smtp',
    };
  } catch (err: any) {
    console.error('[Email Service] Failed to send password reset email via SMTP:', err);
    return {
      success: false,
      error: err.message,
      mode: 'smtp',
    };
  }
}

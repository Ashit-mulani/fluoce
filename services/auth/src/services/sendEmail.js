import dotenv from "dotenv";
import { Resend } from "resend";
import { apiError } from "../utils/apiError.js";

dotenv.config();

const resend = new Resend(process.env.RESEND);

dotenv.config();

export const sendOtp = async (to, userName, otp) => {
  const fromAddress = `Fluoce Cloud <no-reply@mail.cloud.fluoce.com>`;

  const subject = "Your Fluoce Cloud Verification Code";

  const body = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f7fb; padding: 40px 20px;">
    <div style="max-width: 600px; background: #ffffff; margin: auto; border-radius: 14px; padding: 32px; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);">
  
      <!-- Header / Logo -->
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="margin: 18px 0 0; color: #1a1a1a; font-size: 28px; font-weight: 700;">
          Fluoce Cloud
        </h1>
        <p style="color: #6a6a6a; font-size: 14px; margin-top: 4px;">
          Store • Share • Manage Your Images
        </p>
      </div>
  
      <!-- Greeting -->
      <p style="font-size: 16px; color: #333; line-height: 1.6;">
        Hi <strong style="color: #4a63f3;">${userName}</strong>,
      </p>
  
      <!-- Message -->
      <p style="font-size: 16px; color: #555; line-height: 1.6; margin-top: 10px;">
        Use the verification code below to securely sign in to your Fluoce Cloud account.
      </p>
  
      <!-- OTP Box -->
      <div style="
        margin: 32px 0;
        padding: 22px;
        text-align: center;
        background: linear-gradient(135deg, #e6ecff, #f2f6ff);
        border-radius: 10px;
        border: 1px solid #e0e6fa;">
        <span style="font-size: 38px; font-weight: 800; color: #3d55f7; letter-spacing: 3px;">
          ${otp}
        </span>
      </div>
  
      <!-- Note -->
      <p style="font-size: 14px; color: #666; line-height: 1.6;">
        ⚠️ This code is valid for <strong>5 minutes</strong>.  
        If you didn't request this, you can safely ignore this email.
      </p>
  
      <hr style="border: none; border-top: 1px solid #ececec; margin: 32px 0;" />
  
      <!-- Footer -->
      <p style="font-size: 13px; color: #8a8a8a; text-align: center; line-height: 1.6;">
        Thanks,<br />
        <strong style="color: #4a63f3;">The Fluoce Cloud Team</strong><br />
        <small style="color: #bdbdbd;">© 2025 Fluoce Cloud. All Rights Reserved.</small>
      </p>
  
    </div>
  </div>

`;

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [to],
      subject: subject,
      html: body,
    });
    if (!data) {
      throw new apiError(500, "Failed to send email, try later");
    }
  } catch (err) {
    throw new apiError(500, err?.message || "Failed to send email with resend");
  }
};

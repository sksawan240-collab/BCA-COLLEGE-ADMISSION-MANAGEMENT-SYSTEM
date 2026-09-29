import { Request, Response } from 'express';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { Config } from '../models/Config.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/email.js';
import crypto from 'crypto';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, mobile, password } = req.body;

    const config = await Config.findOne();
    if (config && !config.admissionOpen) {
      return res.status(403).json({ message: 'New student registrations are currently closed.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      mobile,
      passwordHash,
    });

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await OTP.create({
      email,
      purpose: 'registration',
      hashedOtp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    await sendEmail({
      to: email,
      subject: 'Email Verification OTP',
      text: `Your OTP for registration is ${otp}. It expires in 10 minutes.`,
    });

    const responsePayload: any = { message: 'Registration successful. Please check your email to verify your account.', email: newUser.email };

    res.status(201).json(responsePayload);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // To prevent user enumeration, send a generic success message
      return res.status(200).json({ message: 'If a user with that email exists, a password reset OTP has been sent.' });
    }

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await OTP.create({
      email,
      purpose: 'password-reset',
      hashedOtp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    await sendEmail({
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is ${otp}. It expires in 10 minutes.`,
    });

    res.status(200).json({ message: 'If a user with that email exists, a password reset OTP has been sent.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    const otpRecord = await OTP.findOne({ email, purpose: 'password-reset', verified: false }).sort({ createdAt: -1 });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP is invalid or has expired' });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.hashedOtp);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    otpRecord.verified = true;
    await otpRecord.save();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await User.findOneAndUpdate({ email }, { passwordHash });

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resendOtp = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    const salt = await bcrypt.genSalt(10);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otpCode, salt);

    await OTP.create({
      email,
      purpose: 'registration',
      hashedOtp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    await sendEmail({
      to: email,
      subject: 'Email Verification OTP (Resend)',
      text: `Your new OTP for registration is ${otpCode}. It expires in 10 minutes.`,
    });

    const responsePayload: any = { message: 'A new OTP has been sent to your email.' };

    res.json(responsePayload);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<any> => {
  const { email, otp } = req.body;
  try {
    const otpRecord = await OTP.findOne({ email, purpose: 'registration', verified: false }).sort({ createdAt: -1 });

    if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired OTP' });
    if (otpRecord.expiresAt < new Date()) return res.status(400).json({ message: 'OTP has expired' });

    const isMatch = await otpRecord.matchOtp(otp);
    if (!isMatch) return res.status(400).json({ message: 'Invalid OTP' });

    otpRecord.verified = true;
    await otpRecord.save();

    await User.findOneAndUpdate({ email }, { emailVerified: true });

    await sendEmail({
      to: email,
      subject: 'Welcome to Sharnbasva University',
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #2563eb;">Welcome to Sharnbasva University!</h2>
          <p>Dear Student,</p>
          <p>Your email has been successfully verified. Welcome to the BCA Co-Education Admission Portal.</p>
          <p>You can now log in to your dashboard to complete your application profile, upload documents, and submit your application for review.</p>
          <a href="${process.env.APP_URL}/login" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Login to Dashboard</a>
          <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">If you have any questions, please contact our support team.</p>
        </div>
      `,
    });

    res.json({ message: 'Email verified successfully. You can now login.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.emailVerified) {
        return res.status(401).json({ message: 'Please verify your email before logging in.' });
      }
      if (user.accountStatus !== 'active') {
        return res.status(401).json({ message: 'Your account is suspended.' });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
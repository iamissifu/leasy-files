// backend/controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const user = await User.create({ 
      username, 
      email, 
      password, 
      verificationToken 
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Account Verification',
      text: `Verify your account by clicking the link: http://localhost:3000/verify-email/${verificationToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res.status(201).json({
        success: true,
        message: 'Verification email sent',
        data: {
          userId: user._id,
        },
      });
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Email verified' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

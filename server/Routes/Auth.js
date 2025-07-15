const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const nodemailer = require('nodemailer');
const router = express.Router();
require('dotenv').config();




const otpStore = {};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  const otp = generateOTP();
  otpStore[email] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 
  };

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
console.log('✅ Email transporter is ready');

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: 'Your OTP Code',
  text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
});


    console.log(`✅ OTP sent to ${email}: ${otp}`);
    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('❌ Email error:', error.message);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore[email];

  if (!record){ return res.status(400).json(
    { message: 'OTP not requested or expired' }
  );}

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: 'OTP expired' });
  }

  if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
   // Mark Otp as verified
  verifiedOTPs.set(email, true);

  delete otpStore[email]; // remove otp
  res.status(200).json({ message: 'OTP verified successfully' });
});


// signup
const verifiedOTPs = new Map(); // email is true
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!verifiedOTPs.get(email)) {
      return res.status(401).json({ message: 'OTP not verified for this email' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ name, email, password: hashedPassword });

    verifiedOTPs.delete(email); // cleanup

    res.status(201).json({ message: 'User created', user: { name, email } });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});

 //signin
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ token, user: { name: existingUser.name, email } });
  } catch (err) {
    res.status(500).json({ message: 'Signin failed', error: err.message });
  }
});

module.exports = router;

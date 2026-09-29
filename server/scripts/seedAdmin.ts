import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to DB');

    const adminExists = await User.findOne({ email: 'admin@sharnbasva.edu.in' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);

    await User.create({
      name: 'System Admin',
      email: 'admin@sharnbasva.edu.in',
      mobile: '0000000000',
      passwordHash,
      role: 'admin',
      emailVerified: true,
      accountStatus: 'active'
    });

    console.log('Admin seeded successfully (admin@sharnbasva.edu.in / admin123)');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();

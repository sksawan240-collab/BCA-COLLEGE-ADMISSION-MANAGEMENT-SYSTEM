import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  mobile: string;
  passwordHash: string;
  role: 'student' | 'admin';
  emailVerified: boolean;
  accountStatus: 'active' | 'suspended';
  profilePicture?: string;
  address?: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: false },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  emailVerified: { type: Boolean, default: false },
  accountStatus: { type: String, enum: ['active', 'suspended'], default: 'active' },
  profilePicture: { type: String },
  address: { type: String }
}, {
  timestamps: true
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

export default mongoose.model<IUser>('User', userSchema);

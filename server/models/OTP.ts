import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IOTP extends Document {
  email: string;
  purpose: 'registration' | 'password-reset' | 'application-submission';
  hashedOtp: string;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
  matchOtp(enteredOtp: string): Promise<boolean>;
}

const otpSchema = new Schema<IOTP>({
  email: { type: String, required: true },
  purpose: { type: String, enum: ['registration', 'password-reset', 'application-submission'], required: true },
  hashedOtp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  verified: { type: Boolean, default: false }
}, {
  timestamps: true
});

otpSchema.methods.matchOtp = async function (enteredOtp: string) {
  return await bcrypt.compare(enteredOtp, this.hashedOtp);
};

export default mongoose.model<IOTP>('OTP', otpSchema);

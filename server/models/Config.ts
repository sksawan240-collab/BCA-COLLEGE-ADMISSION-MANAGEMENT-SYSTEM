import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
  academicYear: { type: String, default: '2024-2025' },
  admissionOpen: { type: Boolean, default: true },
  eligibilityCriteria: { type: String, default: 'Minimum 50% in PUC / 12th standard.' },
  importantDates: [{
    event: String,
    date: Date
  }],
  applicationFee: { type: Number, default: 500 }
}, { timestamps: true });

export const Config = mongoose.model('Config', configSchema);

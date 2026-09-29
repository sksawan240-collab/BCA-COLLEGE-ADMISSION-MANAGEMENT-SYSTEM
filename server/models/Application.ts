import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  applicationNumber: string;
  studentId: mongoose.Types.ObjectId;
  course: string;
  academicYear: string;
  personalDetails: {
    firstName: string;
    middleName?: string;
    lastName: string;
    fatherName: string;
    motherName: string;
    dateOfBirth: string;
    gender: string;
    bloodGroup?: string;
    category: string;
    nationality: string;
    aadhaarNumber?: string;
  };
  addressDetails: {
    address: string;
    villageTown: string;
    taluk: string;
    district: string;
    state: string;
    pinCode: string;
    permanentAddress: string;
  };
  academicDetails: {
    sslc: {
      board: string;
      schoolName: string;
      passingYear: string;
      registrationNumber: string;
      maxMarks: number;
      obtainedMarks: number;
      percentage: number;
    };
    puc: {
      board: string;
      collegeName: string;
      passingYear: string;
      registrationNumber: string;
      maxMarks: number;
      obtainedMarks: number;
      percentage: number;
    };
  };
  guardianDetails: {
    name: string;
    relationship: string;
    mobile: string;
    email: string;
    occupation: string;
    annualIncome: string;
  };
  status: 'Draft' | 'Email Verification Pending' | 'Documents Pending' | 'Submitted' | 'Under Review' | 'Correction Required' | 'Documents Rejected' | 'Approved' | 'Rejected';
  draft: boolean;
  submittedAt?: Date;
  paymentStatus: 'Pending' | 'Completed' | 'Failed';
  paymentId?: string;
  orderId?: string;
  admissionFeeStatus?: 'Pending' | 'Completed' | 'Failed';
  admissionFeeId?: string;
  admissionFeeOrderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>({
  applicationNumber: { type: String, unique: true, sparse: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  course: { type: String, default: 'BCA – Co-Education' },
  academicYear: { type: String, default: '2026-2027' },
  personalDetails: {
    firstName: String,
    middleName: String,
    lastName: String,
    fatherName: String,
    motherName: String,
    dateOfBirth: String,
    gender: String,
    bloodGroup: String,
    category: String,
    nationality: String,
    aadhaarNumber: String,
  },
  addressDetails: {
    address: String,
    villageTown: String,
    taluk: String,
    district: String,
    state: String,
    pinCode: String,
    permanentAddress: String,
  },
  academicDetails: {
    sslc: {
      board: String, schoolName: String, passingYear: String,
      registrationNumber: String, maxMarks: Number, obtainedMarks: Number, percentage: Number
    },
    puc: {
      board: String, collegeName: String, passingYear: String,
      registrationNumber: String, maxMarks: Number, obtainedMarks: Number, percentage: Number
    }
  },
  guardianDetails: {
    name: String, relationship: String, mobile: String,
    email: String, occupation: String, annualIncome: String
  },
  status: {
    type: String,
    enum: ['Draft', 'Email Verification Pending', 'Documents Pending', 'Submitted', 'Under Review', 'Correction Required', 'Documents Rejected', 'Approved', 'Rejected'],
    default: 'Draft'
  },
  draft: { type: Boolean, default: true },
  submittedAt: { type: Date },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  paymentId: { type: String },
  orderId: { type: String },
  admissionFeeStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  admissionFeeId: { type: String },
  admissionFeeOrderId: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<IApplication>('Application', applicationSchema);

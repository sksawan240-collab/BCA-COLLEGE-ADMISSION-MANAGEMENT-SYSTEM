import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
  studentId: mongoose.Types.ObjectId;
  applicationId: mongoose.Types.ObjectId;
  documentType: string;
  filePath: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  status: 'Pending' | 'Verified' | 'Rejected';
  adminRemark?: string;
  verifiedAt?: Date;
}

const documentSchema = new Schema<IDocument>({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
  documentType: { type: String, required: true },
  filePath: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
  adminRemark: { type: String },
  verifiedAt: { type: Date }
}, {
  timestamps: true
});

export default mongoose.model<IDocument>('Document', documentSchema);

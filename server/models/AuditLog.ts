import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  actorId: mongoose.Types.ObjectId;
  actorRole: string;
  applicationId?: mongoose.Types.ObjectId;
  action: string;
  previousStatus?: string;
  newStatus?: string;
  remark?: string;
}

const auditLogSchema = new Schema<IAuditLog>({
  actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  actorRole: { type: String, required: true },
  applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: false },
  action: { type: String, required: true },
  previousStatus: { type: String },
  newStatus: { type: String },
  remark: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<IAuditLog>('AuditLog', auditLogSchema);

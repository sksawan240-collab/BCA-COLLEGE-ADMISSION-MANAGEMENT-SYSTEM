const fs = require('fs');
let content = fs.readFileSync('server/models/Application.ts', 'utf8');

// Insert admissionFee fields
if (!content.includes('admissionFeeStatus')) {
  content = content.replace(/paymentStatus: {/, 
  "admissionFeeStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },\n  admissionFeeOrderId: { type: String },\n  admissionFeeId: { type: String },\n  paymentStatus: {");
  fs.writeFileSync('server/models/Application.ts', content);
}

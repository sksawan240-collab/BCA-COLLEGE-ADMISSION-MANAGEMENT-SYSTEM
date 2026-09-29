export interface User {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  role: 'student' | 'admin';
  token: string;
  profilePicture?: string;
  address?: string;
}

export interface ApplicationData {
  _id?: string;
  applicationNumber?: string;
  studentId?: string;
  status?: string;
  draft?: boolean;
  submittedAt?: string;
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
    bloodGroup: string;
    category: string;
    nationality: string;
    aadhaarNumber: string;
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
  paymentStatus?: 'Pending' | 'Completed' | 'Failed';
  paymentId?: string;
  orderId?: string;
  admissionFeeStatus?: 'Pending' | 'Completed' | 'Failed';
  admissionFeeId?: string;
  admissionFeeOrderId?: string;
  updatedAt?: string;
}

export interface DocumentData {
  _id: string;
  documentType: string;
  originalName: string;
  filePath: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  adminRemark?: string;
}

export interface NotificationData {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface TimelineLog {
  _id: string;
  actorRole: 'student' | 'admin';
  action: string;
  previousStatus?: string;
  newStatus?: string;
  remark?: string;
  actorId?: { name?: string; role?: string } | string;
  createdAt: string;
}

export interface MeritPosition {
  rank: number | null;
  totalApplicants: number;
  pucPercentage: number;
  isMeritListed: boolean;
  beatsPercent: number | null;
  status: string;
}

export interface ActivityLog {
  _id: string;
  actorRole: 'student' | 'admin';
  action: string;
  previousStatus?: string;
  newStatus?: string;
  remark?: string;
  actorId?: { name?: string } | string;
  applicationId?: { applicationNumber?: string } | string;
  createdAt: string;
}

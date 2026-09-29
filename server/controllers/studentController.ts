import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import Application from '../models/Application.js';
import Document from '../models/Document.js';
import OTP from '../models/OTP.js';
import AuditLog from '../models/AuditLog.js';
import Notification from '../models/Notification.js';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/email.js';
import { generateAppNumber } from '../utils/generateAppNumber.js';

export const getApplication = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const application = await Application.findOne({ studentId: req.user._id });
    res.json(application || {});
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const saveApplication = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    let application = await Application.findOne({ studentId: req.user._id });

    if (application && application.status !== 'Draft' && application.status !== 'Correction Required') {
       return res.status(400).json({ message: 'Application is locked and cannot be edited.' });
    }

    if (application) {
      application.personalDetails = req.body.personalDetails || application.personalDetails;
      application.addressDetails = req.body.addressDetails || application.addressDetails;
      application.academicDetails = req.body.academicDetails || application.academicDetails;
      application.guardianDetails = req.body.guardianDetails || application.guardianDetails;
      application.status = 'Draft';
      await application.save();
    } else {
      application = await Application.create({
        studentId: req.user._id,
        ...req.body,
        status: 'Draft',
        draft: true
      });
    }

    res.json(application);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const requestSubmissionOTP = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const application = await Application.findOne({ studentId: req.user._id });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otpCode, salt);

    await OTP.create({
      email: req.user.email,
      purpose: 'application-submission',
      hashedOtp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    await sendEmail({
      to: req.user.email,
      subject: 'Application Submission OTP',
      text: `Your OTP for final application submission is ${otpCode}. It expires in 10 minutes.`,
    });

    res.json({ message: 'OTP sent to your registered email.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verifySubmission = async (req: AuthRequest, res: Response): Promise<any> => {
  const { otp } = req.body;
  try {
    const application = await Application.findOne({ studentId: req.user._id });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const otpRecord = await OTP.findOne({ email: req.user.email, purpose: 'application-submission', verified: false }).sort({ createdAt: -1 });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const isMatch = await otpRecord.matchOtp(otp);
    if (!isMatch) return res.status(400).json({ message: 'Invalid OTP' });

    otpRecord.verified = true;
    await otpRecord.save();

    const appNumber = await generateAppNumber();
    application.applicationNumber = appNumber;
    
    const previousStatus = application.status;
    application.status = 'Submitted';
    application.draft = false;
    application.submittedAt = new Date();
    await application.save();

    await AuditLog.create({
      actorId: req.user._id,
      actorRole: 'student',
      applicationId: application._id,
      action: 'Application Submitted',
      previousStatus,
      newStatus: 'Submitted',
      remark: 'Final submission by student'
    });

    const emailHTML = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <h2 style="text-align: center; color: #4f46e5;">Admission Application Submitted</h2>
        <p>Dear ${req.user.name},</p>
        <p>Your admission application has been successfully submitted. Below is a copy of your application details:</p>
        
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 20px;">
          <h3 style="color: #3730a3; margin-top: 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">General Details</h3>
          <p style="margin: 5px 0;"><strong>Application Number:</strong> ${appNumber}</p>
          <p style="margin: 5px 0;"><strong>Course:</strong> ${application.course}</p>
          <p style="margin: 5px 0;"><strong>Academic Year:</strong> ${application.academicYear}</p>
        </div>

        <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 15px;">
          <h3 style="color: #3730a3; margin-top: 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Personal Details</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${application.personalDetails.firstName} ${application.personalDetails.middleName ? application.personalDetails.middleName + ' ' : ''}${application.personalDetails.lastName}</p>
          <p style="margin: 5px 0;"><strong>Father's Name:</strong> ${application.personalDetails.fatherName}</p>
          <p style="margin: 5px 0;"><strong>Date of Birth:</strong> ${application.personalDetails.dateOfBirth}</p>
          <p style="margin: 5px 0;"><strong>Gender:</strong> ${application.personalDetails.gender}</p>
          <p style="margin: 5px 0;"><strong>Category:</strong> ${application.personalDetails.category}</p>
        </div>

        <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 15px;">
          <h3 style="color: #3730a3; margin-top: 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Academic Details (PUC / 12th)</h3>
          <p style="margin: 5px 0;"><strong>Board:</strong> ${application.academicDetails.puc.board}</p>
          <p style="margin: 5px 0;"><strong>College Name:</strong> ${application.academicDetails.puc.collegeName}</p>
          <p style="margin: 5px 0;"><strong>Percentage:</strong> ${application.academicDetails.puc.percentage}%</p>
        </div>

        <p style="margin-top: 20px; font-size: 0.9em; color: #555;">Please keep this email for your records. You can check the status of your application by logging into your student dashboard.</p>
        <p>Best regards,<br><strong>Admissions Team</strong></p>
      </div>
    `;

    await sendEmail({
      to: req.user.email,
      subject: `Application Submitted - ${appNumber}`,
      text: `Your application (No: ${appNumber}) has been submitted successfully and is under review.`,
      html: emailHTML
    });

    res.json({ message: 'Application submitted successfully', applicationNumber: appNumber });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDocuments = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const application = await Application.findOne({ studentId: req.user._id });
    if (!application) return res.json([]);
    const docs = await Document.find({ applicationId: application._id });
    res.json(docs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Assuming multer middleware runs before this
export const uploadDocument = async (req: AuthRequest, res: Response): Promise<any> => {
    console.log('Received upload request');
    console.log('req.file:', req.file);
    console.log('req.body:', req.body);
    try {
      if (!req.file) {
        console.error('No file uploaded by multer');
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const { documentType } = req.body;
      let application = await Application.findOne({ studentId: req.user._id });
      
      if (!application) {
         console.error('Application not found for student:', req.user._id);
         return res.status(400).json({ message: 'Create draft application first' });
      }
  
      console.log('Attempting to create document in DB...');
      const doc = await Document.create({
        studentId: req.user._id,
        applicationId: application._id,
        documentType,
        filePath: req.file.path,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSize: req.file.size
      });
      console.log('Document created:', doc);
  
      // Send email notification without blocking the response
      sendEmail({
        to: req.user.email,
        subject: `Document Uploaded: ${documentType}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
            <h2 style="color: #2563eb; margin-top: 0;">Document Upload Successful</h2>
            <p>Dear Applicant,</p>
            <p>We have successfully received your <strong>${documentType}</strong> document.</p>
            <p>File Name: <strong>${req.file.originalname}</strong></p>
            <p>Our team will review the uploaded document shortly.</p>
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">Thank you,<br/>Admissions Office</p>
          </div>
        `
      }).catch(emailError => {
        // Log the email error, but don't fail the request
        console.error('Failed to send document upload confirmation email:', emailError);
      });
  
      res.status(201).json(doc);
    } catch (error: any) {
      console.error('Error in uploadDocument:', error);
      res.status(500).json({ message: error.message });
    }
};

export const deleteDocument = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, studentId: req.user._id });
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    
    await doc.deleteOne();
    res.json({ message: 'Document removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const getProfile = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const user = await req.user.toObject();
    delete user.passwordHash;
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const user = req.user;
    
    if (req.body.mobile) user.mobile = req.body.mobile;
    if (req.body.address) user.address = req.body.address;
    
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    await user.save();
    
    const updatedUser = user.toObject();
    delete updatedUser.passwordHash;
    
    res.json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ============ Advanced Features: Notifications ============

export const getNotifications = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort('-createdAt')
      .limit(30);
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationRead = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json({ message: 'Notification marked as read', notification });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const markAllNotificationsRead = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ===== Advanced Features: Application Timeline (Audit Log) =====

export const getTimeline = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const application = await Application.findOne({ studentId: req.user._id });
    if (!application) return res.json([]);

    const logs = await AuditLog.find({ applicationId: application._id })
      .populate('actorId', 'name role')
      .sort('-createdAt')
      .limit(20);

    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ===== Advanced Features: Merit Position =====

export const getMeritPosition = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const myApp = await Application.findOne({ studentId: req.user._id });
    if (!myApp) return res.json(null);

    const rankedApps = await Application.find({
      status: { $in: ['Submitted', 'Under Review', 'Approved'] },
    }).sort({ 'academicDetails.puc.percentage': -1 });

    const positionIndex = rankedApps.findIndex(
      (a) => a._id.toString() === myApp._id.toString()
    );

    const myPuc = myApp.academicDetails?.puc?.percentage || 0;
    const total = rankedApps.length;

    // Top-percentile: percentage of applicants the student ranks above.
    const beatsPercent =
      total > 1 && positionIndex >= 0
        ? Math.round(((total - positionIndex - 1) / (total - 1)) * 100)
        : positionIndex === 0
        ? 100
        : null;

    res.json({
      rank: positionIndex === -1 ? null : positionIndex + 1,
      totalApplicants: total,
      pucPercentage: myPuc,
      isMeritListed: positionIndex !== -1,
      beatsPercent,
      status: myApp.status,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
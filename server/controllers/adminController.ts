import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import Document from '../models/Document.js';
import AuditLog from '../models/AuditLog.js';
import Notification from '../models/Notification.js';
import { sendEmail } from '../utils/email.js';

import { Config } from '../models/Config.js';

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalApplications = await Application.countDocuments();
    const draft = await Application.countDocuments({ status: 'Draft' });
    const submitted = await Application.countDocuments({ status: 'Submitted' });
    const underReview = await Application.countDocuments({ status: 'Under Review' });
    const approved = await Application.countDocuments({ status: 'Approved' });
    const rejected = await Application.countDocuments({ status: 'Rejected' });
    const correctionRequired = await Application.countDocuments({ status: 'Correction Required' });
    
    // Aggregate Demographics (Category)
    const categoryAgg = await Application.aggregate([
      { $match: { "personalDetails.category": { $exists: true, $ne: "" } } },
      { $group: { _id: "$personalDetails.category", value: { $sum: 1 } } },
      { $project: { _id: 0, name: "$_id", value: 1 } }
    ]);

    // Aggregate Gender
    const genderAgg = await Application.aggregate([
      { $match: { "personalDetails.gender": { $exists: true, $ne: "" } } },
      { $group: { _id: "$personalDetails.gender", value: { $sum: 1 } } },
      { $project: { _id: 0, name: "$_id", value: 1 } }
    ]);

    // Generate weekly data for the last 5 weeks
    const weeks: any[] = [];
    const getMonday = (d: Date) => {
      const _d = new Date(d);
      const day = _d.getDay();
      const diff = _d.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(_d.setDate(diff));
    };

    for(let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i * 7);
      const mon = getMonday(d);
      mon.setHours(0, 0, 0, 0);
      weeks.push({
        weekStart: mon,
        name: mon.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        applications: 0,
        pendingVerifications: 0,
        revenue: 0
      });
    }

    const appsForWeekly = await Application.find({ 
      createdAt: { $gte: weeks[0].weekStart } 
    });

    const config = await Config.findOne();
    const fee = config?.applicationFee || 500;

    appsForWeekly.forEach(app => {
       const appDate = new Date(app.createdAt).getTime();
       for(let i = weeks.length - 1; i >= 0; i--) {
         if (appDate >= weeks[i].weekStart.getTime()) {
           weeks[i].applications += 1;
           if (['Submitted', 'Under Review', 'Documents Pending'].includes(app.status)) {
             weeks[i].pendingVerifications += 1;
           }
           if (app.paymentStatus === 'Completed') {
             weeks[i].revenue += fee;
           }
           break;
         }
       }
    });

    const weeklyData = weeks.map(w => ({
      name: w.name,
      applications: w.applications,
      pendingVerifications: w.pendingVerifications,
      revenue: w.revenue
    }));

    // Advanced analytics: document verification pipeline
    const allDocuments = await Document.find();
    const verifiedDocuments = allDocuments.filter(d => d.status === 'Verified').length;
    const pendingDocuments = allDocuments.filter(d => d.status === 'Pending').length;
    const rejectedDocuments = allDocuments.filter(d => d.status === 'Rejected').length;

    // Advanced analytics: fee collection & funnel
    const paidApps = await Application.countDocuments({ paymentStatus: 'Completed' });
    const pendingPayments = await Application.countDocuments({ paymentStatus: { $in: ['Pending', 'Failed'] } });
    const feesCollected = paidApps * (fee || 0);
    const admissionFeesCollected = await Application.countDocuments({ admissionFeeStatus: 'Completed' });

    const activePipeline = approved + underReview + submitted + correctionRequired;
    const approvalRate = totalApplications > 0 ? Math.round((approved / totalApplications) * 100) : 0;
    const conversionRate = totalApplications > 0 ? Math.round((activePipeline / totalApplications) * 100) : 0;
    const docVerificationRate = allDocuments.length > 0 ? Math.round((verifiedDocuments / allDocuments.length) * 100) : 0;
    
    res.json({ 
      totalStudents, 
      totalApplications, 
      draft, 
      submitted, 
      underReview, 
      approved,
      rejected,
      correctionRequired,
      weeklyData,
      demographics: categoryAgg,
      genderDistribution: genderAgg,
      verifiedDocuments,
      pendingDocuments,
      rejectedDocuments,
      feesCollected,
      admissionFeesCollected,
      pendingPayments,
      approvalRate,
      conversionRate,
      docVerificationRate
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentActivity = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const logs = await AuditLog.find()
      .populate('actorId', 'name')
      .populate('applicationId', 'applicationNumber')
      .sort('-createdAt')
      .limit(15);

    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplications = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const apps = await Application.find().populate('studentId', 'name email mobile');
    res.json(apps);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationById = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const app = await Application.findById(req.params.id).populate('studentId', 'name email mobile');
    if (!app) return res.status(404).json({ message: 'Application not found' });
    
    const docs = await Document.find({ applicationId: app._id });
    const logs = await AuditLog.find({ applicationId: app._id }).populate('actorId', 'name').sort('-createdAt');
    
    res.json({ app, docs, logs });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Look up a single application by its unique application number
 * (e.g. SU-BCA-2026-000001). Returns the same payload shape as
 * getApplicationById: { app, docs, logs }.
 */
export const getApplicationByNumber = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { applicationNumber } = req.params;

    if (!applicationNumber || applicationNumber.trim() === '') {
      return res.status(400).json({ message: 'Application number is required' });
    }

    const app = await Application.findOne({ applicationNumber: applicationNumber.trim() })
      .populate('studentId', 'name email mobile');

    if (!app) return res.status(404).json({ message: 'Application not found' });

    const docs = await Document.find({ applicationId: app._id });
    const logs = await AuditLog.find({ applicationId: app._id })
      .populate('actorId', 'name')
      .sort('-createdAt');

    res.json({ app, docs, logs });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMeritList = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const apps = await Application.find({ status: { $in: ['Submitted', 'Under Review', 'Approved'] } })
      .populate('studentId', 'name email mobile')
      .sort({ 'academicDetails.puc.percentage': -1 });
    
    const appIds = apps.map(app => app._id);
    const allDocs = await Document.find({ applicationId: { $in: appIds } });

    // Calculate rank and map to a cleaner format
    const meritList = apps.map((app, index) => {
      const student: any = app.studentId;

      const appDocs = allDocs.filter(doc => doc.applicationId.toString() === app._id.toString());
      const totalDocs = appDocs.length;
      const verifiedDocs = appDocs.filter(doc => doc.status === 'Verified').length;
      const rejectedDocs = appDocs.filter(doc => doc.status === 'Rejected').length;
      
      let docStatus = 'Pending';
      if (totalDocs > 0) {
        if (verifiedDocs === totalDocs) docStatus = 'All Verified';
        else if (rejectedDocs > 0) docStatus = 'Correction Required';
        else if (verifiedDocs > 0) docStatus = 'Partially Verified';
      } else {
        docStatus = 'No Docs Uploaded';
      }

      return {
        rank: index + 1,
        applicationId: app._id,
        applicationNumber: app.applicationNumber || 'N/A',
        studentName: student?.name || 'Unknown',
        email: student?.email || 'N/A',
        mobile: student?.mobile || 'N/A',
        category: app.personalDetails?.category || 'General',
        pucPercentage: app.academicDetails?.puc?.percentage || 0,
        status: app.status,
        documentStatus: docStatus
      };
    });

    res.json(meritList);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response): Promise<any> => {
  const { status, remark } = req.body;
  try {
    const app = await Application.findById(req.params.id).populate('studentId', 'name email');
    if (!app) return res.status(404).json({ message: 'Application not found' });
    
    const previousStatus = app.status;
    app.status = status;
    await app.save();
    
    await AuditLog.create({
      actorId: req.user._id,
      actorRole: 'admin',
      applicationId: app._id,
      action: `Status changed to ${status}`,
      previousStatus,
      newStatus: status,
      remark
    });

    const student: any = app.studentId;
    await Notification.create({
      userId: student._id,
      title: 'Application Status Updated',
      message: `Your application status is now: ${status}. ${remark ? 'Remark: ' + remark : ''}`,
      type: 'status_update'
    });

    const statusColors: Record<string, string> = {
      'Approved': '#16a34a',
      'Rejected': '#dc2626',
      'Correction Required': '#ea580c',
      'Under Review': '#ca8a04',
      'Submitted': '#2563eb'
    };
    const color = statusColors[status] || '#4b5563';

    await sendEmail({
      to: student.email,
      subject: `Application Status Updated: ${status}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #1f2937;">Application Status Update</h2>
          <p>Dear ${student.name},</p>
          <p>Your application (<strong>No: ${app.applicationNumber || 'Pending'}</strong>) status has been updated in the verification pipeline.</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px;">New Status: <strong style="color: ${color};">${status}</strong></p>
            ${remark ? `<p style="margin: 10px 0 0 0; color: #4b5563;"><strong>Admin Remark:</strong> ${remark}</p>` : ''}
          </div>
          <p>Please log in to your dashboard to view the full details and take any necessary actions.</p>
          <a href="${process.env.APP_URL}/login" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Go to Dashboard</a>
        </div>
      `,
    });

    res.json({ message: 'Status updated' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyDocument = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const doc = await Document.findById(req.params.id).populate('studentId', 'name email');
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    
    doc.status = 'Verified';
    doc.verifiedAt = new Date();
    await doc.save();
    
    const student: any = doc.studentId;
    await sendEmail({
      to: student.email,
      subject: `Document Verified: ${doc.documentType}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
          <h2 style="color: #16a34a; margin-top: 0;">Document Verified</h2>
          <p>Dear ${student.name},</p>
          <p>Your uploaded document <strong>${doc.documentType}</strong> has been successfully verified by our admissions team.</p>
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">Thank you,<br/>Admissions Office</p>
        </div>
      `
    });

    res.json({ message: 'Document verified', doc });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectDocument = async (req: AuthRequest, res: Response): Promise<any> => {
  const { remark } = req.body;
  try {
    const doc = await Document.findById(req.params.id).populate('studentId', 'name email');
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    
    doc.status = 'Rejected';
    doc.adminRemark = remark;
    await doc.save();

    const app = await Application.findById(doc.applicationId);
    if(app) {
      await AuditLog.create({
        actorId: req.user._id,
        actorRole: 'admin',
        applicationId: app._id,
        action: `Document ${doc.documentType} rejected`,
        remark
      });
    }
    
    const student: any = doc.studentId;
    await sendEmail({
      to: student.email,
      subject: `Document Rejected: ${doc.documentType} (Correction Required)`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
          <h2 style="color: #dc2626; margin-top: 0;">Document Correction Required</h2>
          <p>Dear ${student.name},</p>
          <p>Unfortunately, your uploaded document <strong>${doc.documentType}</strong> was rejected during verification.</p>
          <div style="background-color: #fee2e2; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <p style="margin: 0; color: #991b1b;"><strong>Reason:</strong> ${remark || 'Not provided'}</p>
          </div>
          <p>Please log in to your dashboard and re-upload the correct document as soon as possible to avoid delays in your application process.</p>
          <a href="${process.env.APP_URL || 'http://localhost:3000'}/login" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Go to Dashboard</a>
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">Thank you,<br/>Admissions Office</p>
        </div>
      `
    });

    res.json({ message: 'Document rejected', doc });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getConfig = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = await Config.create({});
    }
    res.json(config);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateConfig = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = await Config.create(req.body);
    } else {
      config = await Config.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    }
    res.json({ message: 'Configuration updated successfully', config });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * List users with optional search, role filter, and pagination.
 * Returns users without their password hashes.
 */
export const getUsers = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { search = '', role = '', page = '1', limit = '50' } = req.query;

    const query: any = {};
    if (role) query.role = role;

    if (search) {
      const regex = new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [{ name: regex }, { email: regex }, { mobile: regex }];
    }

    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.min(1000, parseInt(String(limit), 10) || 50);

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      users,
      stats: {
        totalStudents: await User.countDocuments({ role: 'student' }),
        totalAdmins: await User.countDocuments({ role: 'admin' }),
        totalSuspended: await User.countDocuments({ accountStatus: 'suspended' }),
      },
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update a user's name, role, or account status.
 */
export const updateUser = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { name, role, accountStatus } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (role !== undefined) {
      if (!['student', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      user.role = role;
    }

    if (accountStatus !== undefined) {
      if (!['active', 'suspended'].includes(accountStatus)) {
        return res.status(400).json({ message: 'Invalid account status' });
      }
      if (String(user._id) === String(req.user._id) && accountStatus === 'suspended') {
        return res.status(400).json({ message: 'You cannot suspend your own account' });
      }
      user.accountStatus = accountStatus;
    }

    if (name !== undefined && name.trim() !== '') {
      user.name = name.trim();
    }

    await user.save();

    await AuditLog.create({
      actorId: req.user._id,
      actorRole: 'admin',
      action: `Updated user ${user.email}`,
      remark: JSON.stringify({ name: user.name, role: user.role, accountStatus: user.accountStatus }),
    });

    const updated = await User.findById(id).select('-passwordHash');
    res.json({ message: 'User updated successfully', user: updated });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a user. Prevents an admin from deleting their own account.
 */
export const deleteUser = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (String(user._id) === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    await AuditLog.create({
      actorId: req.user._id,
      actorRole: 'admin',
      action: `Deleted user ${user.email} (${user.role})`,
    });

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
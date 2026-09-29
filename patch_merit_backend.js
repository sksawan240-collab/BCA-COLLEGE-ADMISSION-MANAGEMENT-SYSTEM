const fs = require('fs');
let content = fs.readFileSync('server/controllers/adminController.ts', 'utf8');

const replacement = `
export const getMeritList = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const apps = await Application.find({ status: { $in: ['Submitted', 'Under Review', 'Approved'] } })
      .populate('studentId', 'name email mobile')
      .sort({ 'academicDetails.puc.percentage': -1 });
    
    // We need to fetch documents for all these apps
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
`;

content = content.replace(/export const getMeritList = async [\s\S]*?res\.status\(500\)\.json\(\{ message: error\.message \}\);\s*\}\s*\};/, replacement.trim());
fs.writeFileSync('server/controllers/adminController.ts', content);

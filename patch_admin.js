const fs = require('fs');
const content = fs.readFileSync('server/controllers/adminController.ts', 'utf8');

const replacement = `
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
`;

const updatedContent = content.replace("const approved = await Application.countDocuments({ status: 'Approved' });", replacement);

const responsePayload = `
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
      genderDistribution: genderAgg
    });
`;

const finalContent = updatedContent.replace(/res\.json\(\{\s*totalStudents,[\s\S]*?weeklyData\s*\}\);/, responsePayload);

fs.writeFileSync('server/controllers/adminController.ts', finalContent);

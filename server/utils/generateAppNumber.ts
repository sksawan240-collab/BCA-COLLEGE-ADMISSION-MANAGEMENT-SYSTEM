import Application from '../models/Application.js';

export const generateAppNumber = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `SU-BCA-${currentYear}-`;

  const lastApp = await Application.findOne({
    applicationNumber: { $regex: `^${prefix}` }
  }).sort({ applicationNumber: -1 });

  if (!lastApp || !lastApp.applicationNumber) {
    return `${prefix}000001`;
  }

  const lastSeq = parseInt(lastApp.applicationNumber.split('-')[3], 10);
  const nextSeq = lastSeq + 1;
  return `${prefix}${nextSeq.toString().padStart(6, '0')}`;
};

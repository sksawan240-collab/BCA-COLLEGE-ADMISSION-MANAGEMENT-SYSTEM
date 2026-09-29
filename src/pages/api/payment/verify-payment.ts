import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, feeType } = req.body;

  const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
  shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = shasum.digest('hex');

  if (digest !== razorpay_signature) {
    return res.status(400).json({ message: 'Invalid signature' });
  }

  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const application = await prisma.application.findFirst({
      where: { userId },
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (feeType === 'processing') {
      await prisma.application.update({
        where: { id: application.id },
        data: {
          status: 'APPLIED',
          processingFeePaid: true,
        },
      });
    } else if (feeType === 'admission') {
      await prisma.application.update({
        where: { id: application.id },
        data: {
          status: 'ENROLLED',
          admissionFeePaid: true,
        },
      });
    }

    res.status(200).json({ message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Failed to update application status:', error);
    res.status(500).json({ message: 'Failed to update application status' });
  }
}
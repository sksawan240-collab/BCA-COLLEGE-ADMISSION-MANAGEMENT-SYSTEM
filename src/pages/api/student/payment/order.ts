import { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';
import { getAuth } from '@clerk/nextjs/server';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { feeType } = req.body;
  const amount = feeType === 'admission' ? 10000 : 500; // Example amounts

  const options = {
    amount: amount * 100, // Amount in paise
    currency: 'INR',
    receipt: `receipt_order_${new Date().getTime()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json({ order, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    res.status(500).json({ message: 'Failed to create Razorpay order' });
  }
}
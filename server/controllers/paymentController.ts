import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import Application from '../models/Application.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

export const createOrder = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { feeType = 'processing' } = req.body;
    const app = await Application.findOne({ studentId: req.user._id });
    
    if (!app) return res.status(404).json({ message: 'Application not found' });
    
    if (feeType === 'processing' && app.paymentStatus === 'Completed') return res.status(400).json({ message: 'Fee already paid' });
    if (feeType === 'admission' && app.admissionFeeStatus === 'Completed') return res.status(400).json({ message: 'Admission fee already paid' });

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: 'Razorpay keys are missing in the server environment.' });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = feeType === 'admission' ? 50000 * 100 : 500 * 100;

    const options = {
      amount,
      currency: "INR",
      receipt: "rcpt_" + app._id
    };

    const order = await instance.orders.create(options);
    
    if (feeType === 'admission') {
      app.admissionFeeOrderId = order.id;
    } else {
      app.orderId = order.id;
    }
    await app.save();

    res.json({ order, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response): Promise<any> => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, feeType = 'processing' } = req.body;

  try {
    const query = feeType === 'admission' 
      ? { studentId: req.user._id, admissionFeeOrderId: razorpay_order_id }
      : { studentId: req.user._id, orderId: razorpay_order_id };
      
    const app = await Application.findOne(query);

    if (!app) return res.status(404).json({ message: 'Application/Order not found' });

    const secret = process.env.RAZORPAY_KEY_SECRET!;

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      if (feeType === 'admission') {
        app.admissionFeeStatus = 'Completed';
        app.admissionFeeId = razorpay_payment_id;
      } else {
        app.paymentStatus = 'Completed';
        app.paymentId = razorpay_payment_id;
      }
      await app.save();
      res.json({ message: 'Payment verified successfully' });
    } else {
      if (feeType === 'admission') {
        app.admissionFeeStatus = 'Failed';
      } else {
        app.paymentStatus = 'Failed';
      }
      await app.save();
      res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

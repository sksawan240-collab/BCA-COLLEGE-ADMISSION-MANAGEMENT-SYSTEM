import React, { useState } from 'react';
import axios from 'axios';
import { CreditCard, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const generateReceiptPDF = (paymentId: string, orderId: string, amount: number, studentName: string = 'Student', studentEmail: string = 'N/A', feeDescription: string = 'BCA Admission Processing Fee') => {
  try {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text('Sharnbasva University', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55);
    doc.text('Payment Receipt - BCA Admission', 105, 30, { align: 'center' });
    
    // Line separator
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);
    
    // Details
    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99);
    doc.text(`Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, 50);
    doc.text(`Receipt No: ${paymentId}`, 20, 60);
    doc.text(`Order ID: ${orderId}`, 20, 70);
    
    doc.setTextColor(31, 41, 55);
    doc.text('Student Details', 20, 90);
    doc.setFontSize(11);
    doc.setTextColor(75, 85, 99);
    doc.text(`Name: ${studentName}`, 20, 100);
    doc.text(`Email: ${studentEmail}`, 20, 110);
    
    doc.setFontSize(12);
    doc.setTextColor(31, 41, 55);
    doc.text('Payment Details', 20, 130);
    doc.setFontSize(11);
    doc.setTextColor(75, 85, 99);
    doc.text(`Description: ${feeDescription}`, 20, 140);
    doc.text(`Amount Paid: Rs. ${amount}`, 20, 150);
    doc.text('Payment Status: SUCCESSFUL', 20, 160);
    
    // Footer line
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 180, 190, 180);
    
    doc.setFontSize(10);
    doc.text('Thank you for your payment.', 105, 190, { align: 'center' });
    doc.text('This is a computer-generated receipt and does not require a physical signature.', 105, 196, { align: 'center' });
    
    doc.save(`Fee_Receipt_${paymentId}.pdf`);
  } catch (error) {
    console.error('Failed to generate PDF receipt:', error);
  }
};

interface FeePaymentProps {
  onSuccess: () => void;
  amount?: number;
  variant?: 'card' | 'inline';
  feeType?: 'processing' | 'admission';
}

export default function FeePayment({ onSuccess, amount = 500, variant = 'card', feeType = 'processing' }: FeePaymentProps) {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { user } = useAuth();

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      return;
    }

    setPaymentLoading(true);
    try {
      const orderRes = await axios.post('/api/student/payment/order', { feeType });
      const { order, keyId } = orderRes.data;

      const feeDescription = feeType === 'admission' ? "BCA Admission Fee" : "BCA Admission Processing Fee";

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Sharnbasva University",
        description: feeDescription,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            await axios.post('/api/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              feeType
            });
            
            // Generate and download PDF receipt on success
            generateReceiptPDF(
              response.razorpay_payment_id, 
              response.razorpay_order_id, 
              order.amount / 100, 
              user?.name, 
              user?.email,
              feeDescription
            );
            
            toast.success('Payment Successful! Receipt downloaded.');
            onSuccess();
          } catch (err: any) {
            toast.error(err.response?.data?.message || 'Payment verification failed.');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#2563eb",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initiate payment.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (variant === 'inline') {
    return (
      <button 
        onClick={handlePayment} 
        disabled={paymentLoading}
        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-70"
      >
        <CreditCard className="h-4 w-4" />
        {paymentLoading ? 'Processing...' : `Pay ₹${amount}`}
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-5">
        <CreditCard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {feeType === 'admission' ? 'Admission Fee' : 'Admission Processing Fee'}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        {feeType === 'admission' 
          ? `Congratulations on your approval! Please pay your final admission fee of ` 
          : `To complete your BCA application and proceed to the verification stage, please pay the mandatory processing fee of `}
        <span className="font-semibold text-gray-900 dark:text-white">₹{amount}</span>.
      </p>
      
      <button 
        onClick={handlePayment} 
        disabled={paymentLoading}
        className="w-full sm:w-auto min-w-[240px] inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 shadow-sm"
      >
        <CreditCard className="h-5 w-5" />
        {paymentLoading ? 'Processing...' : `Pay ₹${amount} Securely`}
      </button>
      
      <div className="flex items-center gap-1.5 mt-5 text-sm text-gray-500 dark:text-gray-500">
        <ShieldCheck className="h-4 w-4" />
        <span>Secured by Razorpay</span>
      </div>
    </div>
  );
}
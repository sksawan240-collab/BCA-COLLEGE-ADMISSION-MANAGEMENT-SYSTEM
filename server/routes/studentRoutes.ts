import express from 'express';
import { getApplication, saveApplication, requestSubmissionOTP, verifySubmission, getDocuments, uploadDocument, deleteDocument, getProfile, updateProfile, getNotifications, markNotificationRead, markAllNotificationsRead, getTimeline, getMeritPosition } from '../controllers/studentController.js';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { handleChat } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/chat', handleChat);

router.get('/profile', getProfile);
router.put('/profile', upload.single('profilePicture'), updateProfile);

// Advanced features
router.get('/notifications', getNotifications);
router.put('/notifications/read-all', markAllNotificationsRead);
router.put('/notifications/:id/read', markNotificationRead);
router.get('/timeline', getTimeline);
router.get('/merit-position', getMeritPosition);

router.get('/application', getApplication);
router.post('/application', saveApplication);
router.post('/application/submit-request', requestSubmissionOTP);
router.post('/application/verify-submission', verifySubmission);

router.get('/documents', getDocuments);
router.post('/documents', upload.single('document'), uploadDocument);
router.delete('/documents/:id', deleteDocument);

router.post('/payment/order', createOrder);
router.post('/payment/verify', verifyPayment);

export default router;

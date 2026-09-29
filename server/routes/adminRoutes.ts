import express from 'express';
import { getDashboardStats, getApplications, getApplicationById, getApplicationByNumber, updateApplicationStatus, verifyDocument, rejectDocument, getMeritList, getConfig, updateConfig, getRecentActivity, getUsers, updateUser, deleteUser } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.get('/dashboard', getDashboardStats);
router.get('/activity', getRecentActivity);
router.get('/config', getConfig);
router.put('/config', updateConfig);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/applications', getApplications);
router.get('/applications/number/:applicationNumber', getApplicationByNumber);
router.get('/merit-list', getMeritList);
router.get('/applications/:id', getApplicationById);
router.put('/applications/:id/status', updateApplicationStatus);
router.put('/documents/:id/verify', verifyDocument);
router.put('/documents/:id/reject', rejectDocument);

export default router;

import { Router } from 'express';
import { 
  getDashboardStats, 
  getAllUsers, 
  toggleBlockUser, 
  deleteUser, 
  getMessages, 
  markMessageReplied,
  exportTransactionsCSV // 📁 Added our new CSV streaming exporter
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = Router();

// 🛡️ Secure all endpoints below this line to Admins only
router.use(protect);
router.use(authorize('admin'));

// Analytics & Dashboard Financial Metrics
router.get('/stats', getDashboardStats);

// Financial Ledger Data Streaming Exporter
router.get('/transactions/export', exportTransactionsCSV);

// User Management Control Room
router.get('/users', getAllUsers);
router.patch('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUser);

// Inbound Inquiry Log Hub
router.get('/messages', getMessages);
router.patch('/messages/:id/reply', markMessageReplied);

export default router;
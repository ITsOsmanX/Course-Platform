import { Router } from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { 
  getDashboardStats, 
  getAllUsers, 
  toggleBlockUser, 
  deleteUser, 
  getMessages, 
  markMessageReplied 
} from '../controllers/adminController.js';

const router = Router();

// Apply global admin guards across all endpoints in this file
router.use(protect);
router.use(authorize('admin'));

// Statistical Insights
router.get('/stats', getDashboardStats);

// User CRUD Management
router.get('/users', getAllUsers);
router.patch('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUser);

// Communications Inboxes
router.get('/messages', getMessages);
router.patch('/messages/:id/reply', markMessageReplied);

export default router;
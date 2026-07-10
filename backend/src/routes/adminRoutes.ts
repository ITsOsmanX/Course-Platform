import { Router } from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { 
  getDashboardStats, 
  getAllUsers, 
  toggleBlockUser, 
  deleteUser, 
  getMessages, 
  markMessageReplied,
  exportTransactionsCSV,
  getAllCourses,
  createCourse,
  deleteCourse,
  toggleFeaturedCourse,
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

// Transaction CSV Export
router.get('/transactions/export', exportTransactionsCSV);

// Course Management
router.get('/courses', getAllCourses);
router.post('/courses', createCourse);
router.delete('/courses/:id', deleteCourse);
router.patch('/courses/:id/featured', toggleFeaturedCourse);

export default router;
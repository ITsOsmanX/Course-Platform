import { Router } from 'express';
import { getAllCourses, getCourseById } from '../controllers/courseController.js';

const router = Router();

// Public Catalog Access
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// NOTE: /seed route removed — courses are managed via /api/admin/courses

export default router;

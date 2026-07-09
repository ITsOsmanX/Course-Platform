import { Router } from 'express';
import { getAllCourses, getCourseById } from '../controllers/courseController.js';
import { Course } from '../models/Course.js';
import mongoose from 'mongoose';

const router = Router();

// Public Catalog Access
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// ⚡ FIX: Shifted seed handler inside active tracking BEFORE default export configuration 
router.post('/seed', async (req, res) => {
  try {
    await Course.deleteMany({});
    
    await Course.create([
      {
        title: 'Full-Stack Next.js 16 Masterclass',
        description: 'Learn modern web architecture, Server Components, and optimized styling patterns.',
        category: 'development',
        price: 99,
        rating: 4.9,
        tags: ['nextjs', 'react', 'typescript'],
        instructor: new mongoose.Types.ObjectId()
      },
      {
        title: 'Advanced UI Design with Tailwind CSS v4',
        description: 'Master advanced responsive designs and fluid components with Tailwind.',
        category: 'design',
        price: 49,
        rating: 4.7,
        tags: ['tailwind', 'css', 'uidesign'],
        instructor: new mongoose.Types.ObjectId()
      }
    ]);
    res.status(201).json({ message: 'Database seeded with courses successfully!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
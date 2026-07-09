import { Request, Response } from 'express';
import { Course } from '../models/Course.js';

// @desc    Get all courses with advanced searching, sorting, and filtering
// @route   GET /api/courses
export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, tag, sort } = req.query;
    let query: any = {};
    let projection: any = {};

    // 1. Full-Text Search Engine Integration
    if (search) {
      query.$text = { $search: search as string };
      // Assign an internal weight score metric calculation map to matches
      projection.score = { $meta: 'textScore' };
    }

    // 2. Exact Category Filter
    if (category) {
      query.category = (category as string).toLowerCase();
    }

    // 3. Array Tag Filter
    if (tag) {
      query.tags = (tag as string).toLowerCase();
    }

    // Build the base query execution pattern
    let courseQuery = Course.find(query, projection).populate('instructor', 'name email');

    // 4. Advanced Structural Sorting Logic Chain
    if (sort === 'price-low') {
      courseQuery = courseQuery.sort({ price: 1 });
    } else if (sort === 'price-high') {
      courseQuery = courseQuery.sort({ price: -1 });
    } else if (sort === 'rating') {
      courseQuery = courseQuery.sort({ rating: -1 });
    } else if (search) {
      // If searching without explicit price/rating sort, prioritize text relevance ranking score
      courseQuery = courseQuery.sort({ score: { $meta: 'textScore' } });
    } else {
      courseQuery = courseQuery.sort({ createdAt: -1 }); // Default fallback: Newest deployments first
    }

    const courses = await courseQuery;
    res.status(200).json({ count: courses.length, courses });
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving courses from ledger index', error: error.message });
  }
};

// @desc    Get single course details
// @route   GET /api/courses/:id
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }
    res.status(200).json(course);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving course details profile context', error: error.message });
  }
};
import { Response } from 'express';
import { User } from '../models/User.js';
import { Course } from '../models/Course.js';
import { Contact } from '../models/Contact.js';
import { Transaction } from '../models/Transaction.js'; // Imported to power financial analytics
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

// @desc    Get complete administrative dashboard statistics & chart aggregates
// @route   GET /api/admin/stats
// @access  Private (Admin Only)
export const getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // 1. Fetch data aggregates in parallel for optimal speed
    const [
      totalUsers, 
      totalCourses, 
      totalMessages, 
      financials, 
      userGrowthChart,
      revenueChart
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Course.countDocuments({}),
      Contact.countDocuments({}),
      
      // Calculate Total Revenue and Completed Sales Volume
      Transaction.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$amount' },
            totalSales: { $sum: 1 }
          }
        }
      ]),

      // Generate User Growth Analytics (Grouped by creation month over the past year)
      User.aggregate([
        { $match: { createdAt: { $gte: oneYearAgo }, role: 'student' } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // Generate Monthly Sales and Revenue Graph over the past year
      Transaction.aggregate([
        { $match: { createdAt: { $gte: oneYearAgo }, status: 'completed' } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            revenue: { $sum: '$amount' },
            sales: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    // Format financial values with robust defaults if no records exist yet
    const totalRevenue = financials[0]?.totalRevenue || 0;
    const totalSales = financials[0]?.totalSales || 0;

    res.status(200).json({
      metrics: {
        totalUsers,
        totalCourses,
        totalMessages,
        totalRevenue, 
        totalSales    
      },
      charts: {
        userGrowth: userGrowthChart.map(item => ({ month: item._id, students: item.count })),
        monthlyRevenue: revenueChart.map(item => ({ month: item._id, revenue: item.revenue, sales: item.sales }))
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to aggregate dashboard analytics', error: error.message });
  }
};

// @desc    Get paginated, searchable user registry
// @route   GET /api/admin/users
// @access  Private (Admin Only)
export const getAllUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const search = req.query.search as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    let filter: any = { role: { $ne: 'admin' } }; // Hide main admins from standard management lines

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter).select('-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter)
    ]);

    res.status(200).json({
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving user index roster', error: error.message });
  }
};

// @desc    Toggle account access restriction (Block/Unblock)
// @route   PATCH /api/admin/users/:id/block
// @access  Private (Admin Only)
export const toggleBlockUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'Target user record not found' });
      return;
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({ 
      message: `User accounts status updated successfully to: ${user.isBlocked ? 'Blocked' : 'Active'}`,
      user: { id: user.id, isBlocked: user.isBlocked }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update user system restrictions', error: error.message });
  }
};

// @desc    Delete user account permanently
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin Only)
export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User record not found' });
      return;
    }
    res.status(200).json({ message: 'User profile purged from system archives cleanly.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to execute profile deletion sequence', error: error.message });
  }
};

// @desc    Get landing page contact submissions
// @route   GET /api/admin/messages
export const getMessages = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to scan inward messages log', error: error.message });
  }
};

// @desc    Toggle message reply status
// @route   PATCH /api/admin/messages/:id/reply
export const markMessageReplied = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }
    message.isReplied = !message.isReplied;
    await message.save();
    res.status(200).json({ message: 'Message state tracking updated', data: message });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed updating message state', error: error.message });
  }
};

// @desc    Export global transaction ledger as a raw streamable CSV file
// @route   GET /api/admin/transactions/export
// @access  Private (Admin Only)
export const exportTransactionsCSV = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Fetch and populate related context records
    const transactions = await Transaction.find()
      .populate('user', 'name email')
      .populate('course', 'title price')
      .sort({ createdAt: -1 });

    // Define structural CSV headers
    let csvContent = 'Transaction ID,User Name,User Email,Course Title,Amount,Currency,Status,Created At\n';

    // Loop through records building comma-delimited clean text rows
    for (const tx of transactions) {
      const user: any = tx.user;
      const course: any = tx.course;

      const txId = tx._id;
      const userName = user ? `"${user.name.replace(/"/g, '""')}"` : 'Unknown';
      const userEmail = user ? user.email : 'Unknown';
      const courseTitle = course ? `"${course.title.replace(/"/g, '""')}"` : 'Unknown';
      const amount = tx.amount;
      const currency = tx.currency.toUpperCase();
      const status = tx.status;
      const date = tx.createdAt ? new Date(tx.createdAt).toISOString() : '';

      csvContent += `${txId},${userName},${userEmail},${courseTitle},${amount},${currency},${status},${date}\n`;
    }

    // Set precise stream attributes instructing browser interaction behaviors
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    res.status(200).send(csvContent);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to generate transactions CSV export file', error: error.message });
  }
};

// @desc    List all courses (admin view)
// @route   GET /api/admin/courses
// @access  Private (Admin Only)
export const getAllCourses = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ count: courses.length, courses });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to retrieve courses', error: error.message });
  }
};

// @desc    Create a new course (admin sets themselves as instructor)
// @route   POST /api/admin/courses
// @access  Private (Admin Only)
export const createCourse = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, description, category, price, imageUrl, tags, videoUrl } = req.body;

    if (!title || !description || !category || price === undefined) {
      res.status(400).json({ message: 'title, description, category and price are required.' });
      return;
    }

    const course = await Course.create({
      title: title.trim(),
      description: description.trim(),
      category: category.toLowerCase().trim(),
      price: Number(price),
      imageUrl: imageUrl?.trim() || undefined,
      tags: Array.isArray(tags)
        ? tags.map((t: string) => t.toLowerCase().trim()).filter(Boolean)
        : typeof tags === 'string'
        ? tags.split(',').map((t: string) => t.toLowerCase().trim()).filter(Boolean)
        : [],
      videoUrl: videoUrl?.trim() || undefined,
      instructor: req.user?.userId,
    });

    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create course', error: error.message });
  }
};

// @desc    Delete a course permanently
// @route   DELETE /api/admin/courses/:id
// @access  Private (Admin Only)
export const deleteCourse = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete course', error: error.message });
  }
};

// @desc    Toggle course featured status
// @route   PATCH /api/admin/courses/:id/featured
// @access  Private (Admin Only)
export const toggleFeaturedCourse = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    // Check if we would exceed the 6 featured courses limit
    if (!course.isFeatured) {
      const featuredCount = await Course.countDocuments({ isFeatured: true });
      if (featuredCount >= 6) {
        res.status(400).json({ message: 'Maximum 6 featured courses allowed. Unfeature another course first.' });
        return;
      }
    }

    course.isFeatured = !course.isFeatured;
    await course.save();

    res.status(200).json({ 
      message: `Course ${course.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      course: { id: course.id, isFeatured: course.isFeatured }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update course featured status', error: error.message });
  }
};

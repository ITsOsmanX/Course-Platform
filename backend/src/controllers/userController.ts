import { Response } from 'express';
import { User } from '../models/User.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // req.user is populated by our 'protect' middleware
    const user = await User.findById(req.user?.userId)
      .select('-passwordHash') // Remove password hash from the payload for security
      .populate('purchaseHistory', 'title category price imageUrl'); // Hydrate purchased courses info

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving profile data', error: error.message });
  }
};

// @desc    Update user profile details
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Update allowable fields
    if (req.body.name) user.name = req.body.name;
    
    // If updating email, check if it's already taken by someone else
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email.toLowerCase() });
      if (emailExists) {
        res.status(400).json({ message: 'This email is already in use' });
        return;
      }
      user.email = req.body.email.toLowerCase();
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: 'Profile updated successfully!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating profile data', error: error.message });
  }
};
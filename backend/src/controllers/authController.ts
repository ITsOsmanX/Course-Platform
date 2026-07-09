import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { generateAccessToken, generateRefreshToken, sendRefreshTokenCookie } from '../utils/jwt.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Create user (password is automatically hashed via pre-save hook)
    const newUser = await User.create({
      name,
      email,
      passwordHash: password,
      role: role || 'student' // default to student unless explicitly admin/instructor setup
    });

    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// @desc    Login user & get tokens
// @route   POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Check if account is blocked by admin
    if (user.isBlocked) {
      res.status(403).json({ message: 'This account has been suspended. Please contact support.' });
      return;
    }

    // Verify Password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Generate tokens
    const payload = { userId: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token in secure cookie
    sendRefreshTokenCookie(res, refreshToken);

    // Send access token and user info to frontend
    res.status(200).json({
      message: 'Login successful',
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Refresh structural token validations
// @route   POST /api/auth/refresh
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const cookies = req.cookies;

    if (!cookies?.refreshToken) {
      res.status(401).json({ message: 'Unauthorized: Missing refresh token' });
      return;
    }

    const refreshToken = cookies.refreshToken;

    // Verify token
    jwt.verify(
      refreshToken, 
      process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret', 
      async (err: any, decoded: any) => {
        if (err) {
          res.status(403).json({ message: 'Forbidden: Invalid or expired refresh token' });
          return;
        }

        // Find user to ensure they still exist and aren't blocked
        const user = await User.findById(decoded.userId);
        if (!user || user.isBlocked) {
          res.status(403).json({ message: 'Forbidden: User is no longer accessible' });
          return;
        }

        // Issue new access token
        const accessToken = generateAccessToken({ 
          userId: user.id, 
          role: user.role 
        });

        res.status(200).json({ accessToken });
      }
    );
  } catch (error: any) {
    res.status(500).json({ message: 'Server error during token refresh', error: error.message });
  }
};

// @desc    Forgot Password - Emit recovery string token link via dynamic systems
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Email address is required.' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Prevents email enumeration harvesting by returning an ambiguous success response
      res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
      return;
    }

    // Generate unhashed random hexadecimal string
    const rawResetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token using SHA256 before committing to data layer for protection
    user.passwordResetToken = crypto.createHash('sha256').update(rawResetToken).digest('hex');
    
    // Lifespan limitation value window configuration (15 minutes)
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    // Construct web redirection client routing parameter layout link
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password/${rawResetToken}`;
    
    console.log(`[MAIL MOCK] Reset Link Sent to ${user.email}: ${resetUrl}`);
    // Optional integration step hook for production-ready mail dispatch clients:
    // await sendEmail({ to: user.email, subject: 'Password Reset Request', body: resetUrl });

    res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error during forgot password processing', error: error.message });
  }
};

// @desc    Reset Password - Verify recovery token link validity, mutate database fields
// @route   POST /api/auth/reset-password/:token
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      res.status(400).json({ message: 'New password string is required.' });
      return;
    }

    // 🛡️ Explicitly cast or enforce token as a clean string to satisfy TypeScript
    const tokenString = typeof token === 'string' ? token : String(token);

    if (!tokenString || tokenString === 'undefined') {
      res.status(400).json({ message: 'A valid token parameter is required.' });
      return;
    }

    // Compute identical SHA256 hash formatting sequence using the safe token string
    const hashedToken = crypto.createHash('sha256').update(tokenString).digest('hex');

    // Query filters matching the exact active token structure and valid expiration window thresholds
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      res.status(400).json({ message: 'Token is invalid or has expired.' });
      return;
    }

    // Assign raw text; automated pre-save infrastructure intercepts to manage encryption
    user.passwordHash = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password updated successfully. Proceed to login.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error during password resetting execution', error: error.message });
  }
};
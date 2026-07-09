import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request interface locally to accommodate user payloads
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

// 1. Core Auth Guard: Ensures user has sent a valid signed Access Token
export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from "Bearer <TOKEN>"
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'fallback_access_secret') as { userId: string; role: string };

      // Attach credentials to request context
      req.user = {
        userId: decoded.userId,
        role: decoded.role
      };

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized: Token validation failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized: No token provided' });
  }
};

// 2. Role Authorization Guard: Dynamically matches roles (e.g., 'admin', 'instructor')
export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: `Access Forbidden: Required role [${roles.join(', ')}] not matched.` });
      return;
    }
    next();
  };
};
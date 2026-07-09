import jwt from 'jsonwebtoken';
import { Response } from 'express';

interface TokenPayload {
  userId: string;
  role: string;
}

// Generate an Access Token (Valid for 15 minutes)
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload, 
    process.env.JWT_ACCESS_SECRET || 'fallback_access_secret', 
    { expiresIn: '15m' }
  );
};

// Generate a Refresh Token (Valid for 7 days)
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload, 
    process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret', 
    { expiresIn: '7d' }
  );
};

// Attach Refresh Token to HttpOnly Cookie
export const sendRefreshTokenCookie = (res: Response, token: string): void => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only HTTPS in prod
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  });
};
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './env';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET!, {
    expiresIn: '7d', // Token expires in 7 days
  });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// Decode JWT token without verification (for debugging)
export function decodeToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT decode failed:', error);
    return null;
  }
}

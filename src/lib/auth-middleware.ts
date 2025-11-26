import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

// Middleware to verify JWT token from Authorization header
export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: AuthenticatedRequest): Promise<NextResponse> => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.get('authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'ไม่พบ Token หรือ Token ไม่ถูกต้อง' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Verify token
      const decoded = verifyToken(token);

      if (!decoded) {
        return NextResponse.json(
          { error: 'Token ไม่ถูกต้องหรือหมดอายุ' },
          { status: 401 }
        );
      }

      // Attach user info to request
      req.user = decoded;

      // Call the actual handler
      return await handler(req);

    } catch (error: any) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'การยืนยันตัวตนล้มเหลว' },
        { status: 401 }
      );
    }
  };
}

// Helper function to get user from request (for use in API routes)
export function getUserFromRequest(req: Request): JWTPayload | null {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    return verifyToken(token);

  } catch (error) {
    console.error('Get user from request error:', error);
    return null;
  }
}

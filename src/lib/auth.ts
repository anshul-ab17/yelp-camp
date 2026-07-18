import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectToDatabase } from './mongodb';
import User, { IUser } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkeyforlocaldevelopmentonly';

export interface JWTPayload {
  userId: string;
  username: string;
  email: string;
}

export function signJWT(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function setJWTCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearJWTCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
}

export async function getCurrentUser(): Promise<IUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;

    const decoded = verifyJWT(token);
    if (!decoded || !decoded.userId) return null;

    await connectToDatabase();
    const user = await User.findById(decoded.userId);
    return user;
  } catch (error) {
    return null;
  }
}

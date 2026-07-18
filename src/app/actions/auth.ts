'use server';

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import db from '@/lib/db';
import { signJWT, setJWTCookie, clearJWTCookie } from '@/lib/auth';

export interface AuthResponse {
  success: boolean;
  error: string;
}

export async function registerUser(prevState: any, formData: FormData): Promise<AuthResponse> {
  try {
    const email = formData.get('email') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!email || !username || !password) {
      return { success: false, error: 'All fields are required' };
    }

    // Check if email already registered
    const existingEmail = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingEmail) {
      return { success: false, error: 'Email is already registered' };
    }

    // Check if username taken
    const existingUsername = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existingUsername) {
      return { success: false, error: 'Username is already taken' };
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user with random UUID
    const userId = crypto.randomUUID();
    db.prepare('INSERT INTO users (id, email, username, password_hash) VALUES (?, ?, ?, ?)').run(
      userId,
      email,
      username,
      passwordHash
    );

    // Sign JWT and set cookie
    const token = signJWT({
      userId,
      username,
      email,
    });
    await setJWTCookie(token);

    return { success: true, error: '' };
  } catch (error: any) {
    console.error('Registration error:', error);
    return { success: false, error: error.message || 'An error occurred during registration' };
  }
}

export async function loginUser(prevState: any, formData: FormData): Promise<AuthResponse> {
  try {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      return { success: false, error: 'Username and password are required' };
    }

    // Find user
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return { success: false, error: 'Invalid username or password' };
    }

    // Sign JWT and set cookie
    const token = signJWT({
      userId: user.id,
      username: user.username,
      email: user.email,
    });
    await setJWTCookie(token);

    return { success: true, error: '' };
  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, error: error.message || 'An error occurred during login' };
  }
}

export async function logoutUser() {
  await clearJWTCookie();
  return { success: true };
}

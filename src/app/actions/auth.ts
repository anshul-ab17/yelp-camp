'use server';

import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
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

    await connectToDatabase();

    // Check if user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return { success: false, error: 'Email is already registered' };
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return { success: false, error: 'Username is already taken' };
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      email,
      username,
      passwordHash,
    });
    await user.save();

    // Sign JWT and set cookie
    const token = signJWT({
      userId: user._id.toString() as string,
      username: user.username,
      email: user.email,
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

    await connectToDatabase();

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return { success: false, error: 'Invalid username or password' };
    }

    // Sign JWT and set cookie
    const token = signJWT({
      userId: user._id.toString() as string,
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

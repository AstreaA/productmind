import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { loginUser } from '@/lib/indexedDB';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    try {
      // Login user with IndexedDB
      const user = await loginUser(email, password);

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.NEXTAUTH_SECRET || 'your-fallback-secret',
      { expiresIn: '1d' }
    );

    // Create the response
    const response = NextResponse.json({
      message: 'Login successful',
        user,
      token
    });

    // Set the token as an HTTP-only cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return response;
      
    } catch (error) {
      if (error === 'Invalid credentials') {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }
      throw error;
    }
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error during login' },
      { status: 500 }
    );
  }
} 
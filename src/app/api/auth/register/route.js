import { NextResponse } from 'next/server';
import { registerUser } from '@/lib/indexedDB';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    try {
      // Register user in IndexedDB
      const newUser = await registerUser(name, email, password);

      return NextResponse.json({
        message: 'User registered successfully',
        user: newUser
      }, { status: 201 });
    } catch (error) {
      if (error === 'User with this email already exists') {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }
      throw error;
    }
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Error registering user' },
      { status: 500 }
    );
  }
} 
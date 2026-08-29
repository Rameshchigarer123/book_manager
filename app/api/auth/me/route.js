import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';

const SECRET_KEY = process.env.JWT_SECRET;
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    await connectDB();
    const user = await User.findById(decoded.userID).select('-password');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log('Error in /api/auth/me:', error);
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
}




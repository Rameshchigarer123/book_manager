import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Book from '@/lib/models/Book';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;
export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    await connectDB();
    const books = await Book.find({ userId: decoded.userID }).sort({ createdAt: -1 });
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    await connectDB();
    
    const { title, author, tags, status } = await request.json();
    
    if (!title || !author) {
      return NextResponse.json(
        { message: 'Title and author are required' },
        { status: 400 }
      );
    }
    
    const book = await Book.create({
      title,
      author,
      tags: tags || [],
      status: status || 'want-to-read',
      userId: decoded.userID
    });
    
    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create book' },
      { status: 500 }
    );
  }
}
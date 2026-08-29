import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Book from '@/lib/models/Book';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(request, { params }) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const decoded = jwt.verify(token, SECRET_KEY);
    await connectDB();
    const book = await Book.findOne({ 
      _id: id, 
      userId: decoded.userID 
    });
    
    if (!book) {
      return NextResponse.json(
        { message: 'Book not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch book' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const decoded = jwt.verify(token, SECRET_KEY);
    await connectDB();
    const { title, author, tags, status } = await request.json();
    const book = await Book.findOneAndUpdate(
      { _id: id, userId: decoded.userID },
      { title, author, tags, status, updatedAt: new Date() },
      { new: true }
    );
    
    if (!book) {
      return NextResponse.json(
        { message: 'Book not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update book' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const decoded = jwt.verify(token, SECRET_KEY);
    await connectDB();
    const book = await Book.findOneAndDelete({ 
      _id: id, 
      userId: decoded.userID 
    });
    
    if (!book) {
      return NextResponse.json(
        { message: 'Book not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Book deleted successfully' }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete book' },
      { status: 500 }
    );
  }
}



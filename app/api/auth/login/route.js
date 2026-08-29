import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;
export async function POST(request) {
    try{
        await connectDB();
        const userData=await request.json();
        const email=userData.email;
        const password=userData.password;

        if(!email || !password){
            return NextResponse.json(
                {message:"please provide email and password"},
                {status:400}
            )
        }
        const user=await User.findOne({email:email});
        if(!user){
            return NextResponse.json(
                {message:"Invalid email or password"},
                {status:401}
            )
        }
        const ispasswordcorrect=await user.comparePassword(password);
        if(!ispasswordcorrect){
            return NextResponse.json(
                {message:"Password is incorrrect"},
                {status:401}
            )
        }
        const token = jwt.sign(
            {
                userID: user._id,
                userEmail: user.email
            },
            SECRET_KEY,
            { expiresIn: '7d' }
        );
        const responsedata={
            message:"Login successful! Welcome back!",
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        }
        const response = NextResponse.json(responsedata, { status: 200 });
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, 
            path: '/',
        });
        return response;
    } catch (error) {
        console.log('Error in login:', error);
        return NextResponse.json(
            { message: 'Something went wrong on our side' },
            { status: 500 }
        );
    }
}



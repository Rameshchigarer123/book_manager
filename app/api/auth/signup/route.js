import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"
import User from "@/lib/models/User" 
import jwt from "jsonwebtoken"
const SECRET_KEY=process.env.JWT_SECRET 
export async function POST(request) {
    try{
        await connectDB();
        const userData=await request.json();
        const name=userData.name;
        const email=userData.email;
        const password=userData.password;

        if(!name || !email || !password){
            return NextResponse.json(
                {Message:"please fill all the fields"},
                {status:400}
            );
        }
        const userExist=await User.findOne({email:email});
        if(userExist){
            return NextResponse.json(
                {Message:"This mail is already exist"},
                {status:400}
            )
        }
        const newUser=await User.create({
            name:name,
            email:email,
            password:password
        })
        const token=jwt.sign(
            {
                userID:newUser._id,
                userEmail:newUser.email
            },
            SECRET_KEY,
            { expiresIn: '7d' }
        );
        const responsedata={
            Message:"account successfully created",
            user:{
                id:newUser._id,
                name:newUser.name,
                email: newUser.email
            }
        };
        const response = NextResponse.json(responsedata, { status: 201 });
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });
        return response;
    }
    catch (error) {
        console.log('Error in signup:', error);
        return NextResponse.json(
            { message: 'Something went wrong on our side' },
            { status: 500 }
        );
    }
}




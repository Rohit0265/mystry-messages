import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationaction";
import { success } from "zod";
import { send } from "process";

export async function POST(request:Request){
    await dbConnect()
    try {
        const {username,email,password} = await request.json()
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified:true
        })
        if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:"Username is already taken"

            },{status:400})
        }

        const existingUserVerifiedByEmail = await UserModel.findOne({
            email,
            isVerified:true
        })
        if(existingUserVerifiedByEmail){
            if(existingUserVerifiedByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User already exist with this email"
                },{status:400})
            }else{
                const hashedPasswd = await bcrypt.hash(password,10)
                existingUserVerifiedByEmail.password = hashedPasswd
                existingUserVerifiedByEmail.verifyCode=verifyCode
                existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserVerifiedByEmail.save()
            }
        }else{
            const hashedPasswd = await bcrypt.hash(password,10)
            const expiryDate = new Date() 
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPasswd,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
            })
            await newUser.save()
        }

        //send verification

        const emailResponse = await sendVerificationEmail(
            email,username,verifyCode
        )

        if (!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            },{status:500})
        }

        return Response.json({
                success:true,
                message:"User Registered Successfully. NOw Verify Your Mail"
            },{status:201})

    } catch (error) {
        console.log('Error registering error',error)
        return Response.json(
            {
                success:false,
                message:"Error registering user"
            },{
                status:500,
            }
        )
    }
}
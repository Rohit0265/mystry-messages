import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {success, z} from 'zod';
import { userNameValidation } from "@/schemas/signUpSchema";


export async function POST(request:Request) {
    await dbConnect();
    try {
        const {username,code}= await request.json()
        const decodedUsername = decodeURIComponent(username) 
        const user = await UserModel.findOne({username:decodedUsername})

        if(!user){
            return Response.json({
            success:false,
            message:"User not found",
        },{
            status:500,
        })          
        }
        const isCodeValid = user.verifyCode === code 
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
        return Response.json({
            success:true,
            message:"User now verified",
        },{
            status:201,
        })   
        }else if(!isCodeNotExpired){
        return Response.json({
            success:false,
            message:"eCode expired signup again",
        },{
            status:400,
        })   
        }else{
            return Response.json({
            success:false,
            message:"Incorrect code",
        },{
            status:300,
        })   
        }

    }
    catch(error){
        console.error("Error verifying user",error)
        return Response.json({
            success:false,
            message:"error verifying user",
        },{
            status:500,
        })   
    }
}

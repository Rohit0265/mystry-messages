import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";
import { success } from "zod";


export async function POST(request:Request){
    await dbConnect();
    const {username,content}= await request.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success:false,
                message:"user not found"
            },{status:401})
        }

        //is user accepting the mmessages

        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"user is not accepting message"
            },{status:401})
        }



        const newMessage = {content,createdAt:new Date()}
        user.messages.push(newMessage as Message)
        await user.save();

        return Response.json({
                success:true,
                message:"message sent successfully"
        },{status:201})




    } catch (error) {
        console.log("an unexpected error occured",error)
            return Response.json({
                success:false,
                message:"internal server error"
            },{status:500})
    }
}
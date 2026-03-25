import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod';
import { userNameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySChema = z.object({
    username:userNameValidation
})

export async function GET(request:Request) {
    await dbConnect();
    try {
        const {searchParams} = new URL(request.url)
        const queryParams = {
            username:searchParams.get('username')
        }
        //validate karna hai zod se

        const result = UsernameQuerySChema.safeParse(queryParams)
        console.log(result);
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message: 'Invalid query params'
            },{status:400})
        }

        const {username} = result.data
        const isExisting = await UserModel.findOne({username,isVerified:true})
        if(isExisting){
                return Response.json({
                success:false,
                message: 'Username is already taken'
            },{status:400})
        }
        return Response.json({
                success:true,
                message: 'Username is unique'
            },{status:200})
    } catch (error) {
        console.log("Error checking uername",error)
        return Response.json({
            success:false,
            message:"error checking username",
        },{
            status:500,
        })
    }
}
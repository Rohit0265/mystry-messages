import { resend } from "@/lib/resend";

import VerificationEmailTemplate from "../../emails/VerificationEmailTemplate";


import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string,
):Promise<ApiResponse>{
    try {

        await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: email,
  subject: 'Verification Code',
  react: VerificationEmailTemplate({username,otp:verifyCode})
});


       return {success:true,message:" send verification email"} 

    } catch (error) {
        console.error("error sending",error)
        return {success:false,message:"failed too send verification email"}
    }
}
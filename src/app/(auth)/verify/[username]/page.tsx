
import { signUpSchema } from '@/schemas/signUpSchema'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const VerifyAcc = () => {
    const router = useRouter()
    const params = useParams<{username:string}>()
    const form = useForm({
      resolver:zodResolver(signUpSchema),

    })

    const onSubmit = async (data:z.infer<typeof verifySchema>) =>{
        try {
            const response = await axios.post(`/api/verify-code`,{
                username:params.username,
                code:data.code
            })
            toast('Success')
            router.replace('sign-in')
        } catch (error) {
          console.error("error in signup of user",error)
          const axiosError = error as AxiosError<ApiResponse>;  
            toast('signup failed')       
        }
    }


  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadwo-md'>
            <div className='text-center'>
                
            </div>

        </div>
    </div>
  )
}

export default VerifyAcc
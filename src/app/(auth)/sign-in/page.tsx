'use client'


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"

const page = () => {
  const [username,setusername] = useState('')
  const [usernameMessage,setUsernameMessage] = useState('')
  const [isCheckingUsername,setisCheckingUername] = useState(false)
  const [isSubmitting,setIsSubmitting] = useState(false)
  const router = useRouter()



  const debounceUssername = useDebounceValue(username,300)

    //zod imp.

    const form = useForm({
      resolver:zodResolver(signUpSchema),
      defaultValues:{
        username:'',
        email:'',
        password:''
      }
    })

    useEffect(()=>{
      const checkUsername = async () =>{
        if(debounceUssername){
          setisCheckingUername(true)
          setUsernameMessage('')
            try {
              const response = await axios.get(`/api/chck-unique-un?username=${debounceUssername}`)
              setUsernameMessage(response.data.message)
            } catch (error) {
              const axiosError = error as AxiosError<ApiResponse>
              setUsernameMessage(
                axiosError.response?.data.message ?? "error checking username"
              )
            }finally{
              setisCheckingUername(false)
            }
        }
      }
    },[debounceUssername])


    const onSubmit = async (data:z.infer<typeof signUpSchema>) =>{
      setIsSubmitting(true)
      try {
        await axios.post<ApiResponse>('/api/sign-up',data)
        toast('Success')
        router.replace(`/verify/${username}`);
        setIsSubmitting(false)
      } catch (error) {
        console.error("error in signup of user",error)
        const axiosError = error as AxiosError<ApiResponse>;         
          let errorMessage = axiosError.response?.data.message
          toast('signup failed')
          setIsSubmitting(false)
      }
    }

  return (
    <div>
      
    </div>
  )
}

export default page
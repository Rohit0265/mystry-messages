'use client'


import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue,useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { BugReportForm } from "@/components/ui/form"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const page = () => {
  const [username,setusername] = useState('')
  const [usernameMessage,setUsernameMessage] = useState('')
  const [isCheckingUsername,setisCheckingUername] = useState(false)
  const [isSubmitting,setIsSubmitting] = useState(false)
  const router = useRouter()



  const debounce = useDebounceCallback(setusername,300)

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
        if(username){
          setisCheckingUername(true)
          setUsernameMessage('')
            try {
              const response = await axios.get(`/api/chck-unique-un?username=${username}`)
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
    },[username])


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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sig up to start your anonymous adventure</p>
        </div>


  <Card className="w-full sm:max-w-md">
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Username
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Username"
                    autoComplete="off"
                    onChange={(e)=>{
                      field.onChange(e)
                      debounce(e.target.value)
                    }}
                  /> {isCheckingUsername && <Loader2 className="animate-spin"/>
            }
            <p className={`text-sm ${username === "Username is unique" ? "text-green-500" :"text-red-500"}`}>
                test {usernameMessage}
            </p>




                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
  
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="email"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Password
                  </FieldLabel>
                  <Input type="password"
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="password"
                    autoComplete="off"
                    onChange={(e)=>{
                      field.onChange(e)
                      setusername(e.target.value)
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="submit" disabled={isSubmitting} form="form-rhf-demo">
            {
              isSubmitting ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                Please wait

                </>
              ):(
                'Signup'
              )
          }
          </Button>
        </Field>
      </CardFooter>
    </Card>

    <div className="text-center">
      <p >Already a member ? <Link className="text-blue-700" href="/sign-in">Sign In</Link></p>
    </div>
      </div>
      
    </div>
  )
}

export default page
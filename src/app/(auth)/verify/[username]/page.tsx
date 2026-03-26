'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const VerifyAcc = () => {
  const router = useRouter()
  const params = useParams<{ username: string }>()
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      await axios.post('/api/verify-code', {
        username: params.username,
        code: data.code,
      })
      toast('Success')
      router.replace('/sign-in')
    } catch (error) {
      console.error('error in verification of user', error)
      const axiosError = error as AxiosError<ApiResponse>
      toast(axiosError.response?.data.message || 'Verification failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Verify Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="code"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="verification-code">
                        Verification Code
                      </FieldLabel>
                      <Input
                        {...field}
                        id="verification-code"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter 6-digit code"
                        autoComplete="one-time-code"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Button type="submit">Verify</Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default VerifyAcc

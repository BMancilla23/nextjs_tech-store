'use client'

import { Input } from "@/components/ui/inputs/Input"
import { Button } from "@/components/ui/Button"
import { Heading } from "@/components/ui/Heading"
import Link from "next/link"
import { FC, useCallback, useEffect, useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { AiOutlineGoogle } from "react-icons/ai"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { SafeUser } from "@/types/safeUser.type"

interface LoginFormProps {
  currentUser: SafeUser | null
}

export const LoginForm: FC<LoginFormProps> = ({currentUser}) => {

  const [isLoading, setIsLoading] = useState(false)
  const{register, handleSubmit, formState: {errors}} = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const router = useRouter()


  useEffect(() => {
    if (currentUser) {
    
      router.push('/cart')
      router.refresh()
    }
    
  }, [])
  

  const handleSignIn = async(provider: string, data?: FieldValues) => {
   setIsLoading(true)
    try {
      /* setIsLoading(true) */
      const result = await signIn(provider, {
        ...data,
        redirect: false
      })
      /* setIsLoading(false) */
     
      if (result?.ok) {
        router.push("/cart")
        router.refresh()
        toast.success("Logged In")
      }else if(result?.error){
        toast.error(result.error || 'Login failed')
      }

    } catch (error) {
      /* setIsLoading(false) */
      toast.error('An unexpected error ocurred. Please try again.')
    }finally{
      setIsLoading(false)
    }
  }

  const onSubmit:SubmitHandler<FieldValues> = (data) => {
    handleSignIn('credentials', data);
  }

  if (currentUser) {
      return <p className="text-center">Logged in. Redirecting...</p>
  }

  return (
    <>
      <Heading title="Sign in to Tech-Store"/>
      <Button outline label="Continue with Google" icon={AiOutlineGoogle} onClick={() => handleSignIn('google')}></Button>
      <hr className="bg-slate-300 w-full h-px"/>
      <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required/>
      <Input id="password" label="Password" disabled={isLoading} register={register} errors={errors} required type="password"/>
      <Button label={isLoading ? "Loading" : 'Login'} onClick={handleSubmit(onSubmit)}/>
      <p className="text-sm">Already have an account? <Link className="underline" href='/auth/register'>Sign Up</Link></p>
    </>
  )
}
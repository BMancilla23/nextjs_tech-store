'use client'

import { Input } from "@/components/ui/inputs/Input"
import { Button } from "@/components/ui/Button"
import { Heading } from "@/components/ui/Heading"
import Link from "next/link"
import { FC, useEffect, useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { AiOutlineGoogle } from "react-icons/ai"
import axios from "axios"
import toast from "react-hot-toast"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { SafeUser } from "@/types/safeUser.type"

interface RegisterFormProps{
  currentUser: SafeUser | null
}

export const RegisterForm:FC<RegisterFormProps> = ({currentUser}) => {

  const [isLoading, setisLoading] = useState(false)
  const{register, handleSubmit, formState: {errors}} = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const router = useRouter()


  useEffect(() => {
    if (currentUser) {
      router.push("/cart")
      router.refresh()
    }
  }, [])
  

  const onSubmit:SubmitHandler<FieldValues> = async (data) => {
    setisLoading(true)
    /* console.log(data) */
    try {
      await axios.post('/api/auth/register', data)
      toast.success('Account created')

      const callback = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })

      if (callback?.ok) {
        toast.success('Logged In')
        router.push("/cart")
        router.refresh()
      }else if(callback?.error) {
        toast.error(callback?.error)
      }
    } catch (error) {
      toast.error("Something went wrong")
    }finally{
      setisLoading(false)
    }
    
  }

  if (currentUser) {
    return <p className="text-center">Logged in. Redirecting...</p>
  }

  return (
    <>
      <Heading title="Sign up for Tech-Store"/>
      <Button outline label="Continue with Google" icon={AiOutlineGoogle} onClick={() => {signIn('google')}}></Button>
      <hr className="bg-slate-300 w-full h-px"/>
      <Input id="name" label="Name" disabled={isLoading} register={register} errors={errors} required/>
      <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required/>
      <Input id="password" label="Password" disabled={isLoading} register={register} errors={errors} required type="password"/>
      <Button label={isLoading ? "Loading" : 'Sign Up'} onClick={handleSubmit(onSubmit)}/>
      <p className="text-sm">Already have an account? <Link className="underline" href='/auth/login'>Login</Link></p>
    </>
  )
}
"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginUser } from "@/lib/actions/auth.actions"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

const SignInpPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const onSubmit = async (e:React.FormEvent) => {
        e.preventDefault()
        const response  =await loginUser(email, password)
        if(response?.data){
            toast.success("Login Successful" , {
                position:"bottom-right"
            })
            console.log(response.data);
            
            localStorage.setItem("token" , response.data.token)
            localStorage.setItem("user" , JSON.stringify(response.data.user))
            // window.location.href = "/app"
        }
        else{
            toast.error("Login Failed" , {
                position:"bottom-right"
            })
        }
    }
  return (
     <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
             
                <Label htmlFor="password">Password</Label>
              
              <Input id="password" type="password" required 
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" onClick={onSubmit}>
          Login
        </Button>
        <p className="mt-2">Don't have an account? <span className="text-primary underline"><Link href={"/sign-up"}>Sign Up</Link></span></p>
      </CardFooter>
    </Card>
  )
}

export default SignInpPage
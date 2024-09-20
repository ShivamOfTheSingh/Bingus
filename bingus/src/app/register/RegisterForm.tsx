'use client'

import { Button } from  '@/components/RegisterComponents/button'
import { Input } from '@/components/RegisterComponents/input'
import { Label } from '@/components/RegisterComponents/label'
import './RegisterFormStyle.css';

export const RegisterForm = () =>
{

    const onSubmit = (e: React.FormEvent) =>{
        e.preventDefault()
        console.log('Register!!')
    }
    return (
        <form className='space-y-2'>
             
             <div className="grid w-full max-w-sm items-center gap-1">
                <Label htmlFor="firstname">First Name</Label>
                <Input type="firstname" id="firstname" placeholder="First Name" />
             </div>

             <div className="grid w-full max-w-sm items-center gap-1">
                <Label htmlFor="lastname">Last Name</Label>
                <Input type="lastname" id="lastname" placeholder="Last Name" />
             </div>

             <div className="grid w-full max-w-sm items-center gap-1">
                <Label htmlFor="Username">Username</Label>
                <Input type="Username" id="Username" placeholder="BingusFanPage224" />
             </div>


             <div className="grid w-full max-w-sm items-center gap-1">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" placeholder="Email" />
             </div>

             <div className="grid w-full max-w-sm items-center gap-1">
                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" placeholder="Password" />
             </div>

             <div className="grid w-full max-w-sm items-center gap-1">
                <Label htmlFor="passwordRepeat">Repeat Password</Label>
                <Input type="password" id="passwordRepeat" placeholder="No Typos Chingus" />
             </div>
            <div className ="w-full">
               <p>
                  Already have an account? <a style = {{color:'blue' }} href="/login">LogIn</a>
               </p>
               <Button id = { 'register' } >Sign Up</Button>  
            </div>

        </form>
    )

}
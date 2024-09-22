'use client';

import { Button } from '@/components/RegisterComponents/button'
import { Input } from '@/components/RegisterComponents/input'
import { Label } from '@/components/RegisterComponents/label'
import { InputOTPSeparator, InputOTPGroup, InputOTPSlot, InputOTP } from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Select, SelectItem, SelectContent, SelectValue, SelectTrigger, SelectGroup, SelectLabel } from '@radix-ui/react-select';
// import './RegisterFormStyle.css';
import { useState } from 'react';
import { registerUserSchema } from '@/lib/formSchemas';

// Define form schema


export default function RegisterForm() {

   // Set up states for each field
   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");
   const [username, setUsername] = useState("");
   const [email, setEmail] = useState("");
   const [birthdate, setBirthdate] = useState("");
   const [gender, setGender] = useState("");
   const [password, setPassword] = useState("");
   const [passwordRepeat, setPasswordRepeat] = useState("");

   // Pending submission state
   const [pending, setPending] = useState(false);

   async function onSubmit(formData: FormData) {
      // Validate form data
      const validateFields = registerUserSchema.safeParse({
         username: formData.get('username'),
         email: formData.get('email'),
         password: formData.get('password'),
         firstName: formData.get('firstname'),
         lastName: formData.get('lastname'),
         gender: formData.get('gender'),
         birthDate: formData.get('birthdate')
      });
      console.log("Validate fields", validateFields);
      // Make API request
   }

   return (
      <form action={onSubmit}>
         <div>
            <Label htmlFor="firstname">First Name</Label>
            <Input id="firstname" placeholder="First Name" name="firstname" value={firstName} onChange={(e) => { setFirstName(e.target.value) }} />
         </div>
         <div>
            <Label htmlFor="lastname">Last Name</Label>
            <Input id="lastname" placeholder="Last Name" name="lastname" value={lastName} onChange={(e) => { setLastName(e.target.value) }} />
         </div>
         <div>
            <Label htmlFor="Username">Username</Label>
            <Input id="Username" placeholder="Username" name="username" value={username} onChange={(e) => { setUsername(e.target.value) }} />
         </div>
         <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Email" name="email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
         </div>
         <div>
            <Label htmlFor="birthdate">Birth Date</Label>
            <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} name="birthdate" value={birthdate} onChange={(value) => setBirthdate(value)}>
               <InputOTPGroup>
                  <InputOTPSlot index={0}/>
                  <InputOTPSlot index={1}/>
               </InputOTPGroup>
               <InputOTPSeparator />
               <InputOTPGroup>
                  <InputOTPSlot index={2}/>
                  <InputOTPSlot index={3}/>
               </InputOTPGroup>
               <InputOTPSeparator />
               <InputOTPGroup>
                  <InputOTPSlot index={4}/>
                  <InputOTPSlot index={5}/>
               </InputOTPGroup>
            </InputOTP>
         </div>
         <div>
            <Select name="gender" value={gender} onValueChange={(value) => { setGender(value) }}>
               <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
               </SelectTrigger>
               <SelectContent>
                  <SelectGroup>
                     <SelectLabel>Gender</SelectLabel>
                     <SelectItem value="male">Male</SelectItem>
                     <SelectItem value="female">Female</SelectItem>
                     <SelectItem value="other">Other</SelectItem>
                     <SelectItem value="prefer_not_to_say">Prefer Not to Say</SelectItem>
                  </SelectGroup>
               </SelectContent>
            </Select>
         </div>
         <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" placeholder="Password" name="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
         </div>
         <div>
            <Label htmlFor="passwordRepeat">Repeat Password</Label>
            <Input id="passwordRepeat" placeholder="Confirm Password" name="passwordRepeat" value={passwordRepeat} onChange={(e) => { setPasswordRepeat(e.target.value) }} />
         </div>
         <div>
            <p>
               Already have an account? <a style={{ color: 'blue' }} href="/login">Sign In</a>
            </p>
            <Button id="register" type="submit">Sign Up</Button>
         </div>
      </form>
   )

}
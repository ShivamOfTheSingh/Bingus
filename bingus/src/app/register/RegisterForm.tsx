'use client';

// import './RegisterFormStyle.css';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useState } from 'react';
import { registerUserSchema } from '@/lib/formSchemas';
import { redirect } from 'next/navigation';
import { UserAuth, UserProfile } from '@/lib/models';

interface RegisterValidateErrors {
   firstName: string | null,
   lastName: string | null,
   username: string | null,
   email: string | null,
   birthdate: string | null,
   gender: string | null,
   password: string | null,
   passwordRepeat: string | null
 }

export default function RegisterForm() {

   // States for each field
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
   // User already exists state
   const [userExistsError, setUserExistsError] = useState(false);

   // Validate form errors state
   const [validateErrors, setValidateErrors] = useState<RegisterValidateErrors>({
      firstName: null,
      lastName: null,
      username: null,
      email: null,
      birthdate: null,
      gender: null,
      password: null,
      passwordRepeat: null
   });

   async function onSubmit() {
      // Set pending state
      setPending(true);

      // Validate form data
      const validateFields = registerUserSchema.safeParse({
         firstName: firstName,
         lastName: lastName,
         username: username,
         email: email,
         birthdate: new Date(birthdate),
         gender: gender,
         password: password,
         passwordRepeat: passwordRepeat
      });

      // Check validation status
      if (!validateFields.success) {
         const errors = validateFields.error.format();
         console.log("Form errors", errors);
         // Set state to display errors if present
         setValidateErrors({
            firstName: errors.firstName?._errors[0] || null,
            lastName: errors.lastName?._errors[0] || null,
            username: errors.username?._errors[0] || null,
            email: errors.email?._errors[0] || null,
            birthdate: errors.birthdate?._errors[0] || null,
            gender: errors.gender?._errors[0] || null,
            password: errors.password?._errors[0] || null,
            passwordRepeat: errors.passwordRepeat?._errors[0] || null
         });

         // Disable pending state
         setPending(false);
      }
      else {
         // If valid, make API call to register create user profile and register user
         const userProfile: UserProfile = {
            username: username,
            email: email,
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            birthDate: birthdate
         };
         const userProfileResponse = await fetch("http://localhost:3000/api/user-profile", {
            method: "POST",
            body: JSON.stringify(userProfile)
         });
         // Check if user already exists
         if (userProfileResponse.status === 409) {
            setUserExistsError(true);
            setPending(false);
         }
         else if (userProfileResponse.status === 201) {
            // Register user with password (another API call).
            const userProfileResponseBody = await userProfileResponse.json();
            const userId = userProfileResponseBody.userId;
            const today = new Date();
            const userAuth: UserAuth = {
               password: password,
               dateRegistered: today.toISOString(),
               userId: userId
            };
            const registerUserResponse = await fetch("http://localhost:3000/api/session/register", {
               method: "POST",
               body: JSON.stringify(userAuth)
            });
            if (registerUserResponse.status === 201) {
               redirect("/login");
            }
         }
      }
   }

   return (
      <Form action={onSubmit}>
         <Form.Group controlId="firstname">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" placeholder="First Name" value={firstName} onChange={(e) => { setFirstName(e.target.value) }} disabled={pending} />
            {validateErrors.firstName ? <Form.Label className="text-red-600">{validateErrors.firstName}</Form.Label> : null}
         </Form.Group>
         <Form.Group controlId="lastname">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" placeholder="Last Name" value={lastName} onChange={(e) => { setLastName(e.target.value) }} disabled={pending} />
            {validateErrors.lastName ? <Form.Label className="text-red-600">{validateErrors.lastName}</Form.Label> : null}
         </Form.Group>
         <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Username" value={username} onChange={(e) => { setUsername(e.target.value) }} disabled={pending} />
            {validateErrors.username ? <Form.Label className="text-red-600">{validateErrors.username}</Form.Label> : null}
         </Form.Group>
         <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value) }} disabled={pending} />
            {validateErrors.email ? <Form.Label className="text-red-600">{validateErrors.email}</Form.Label> : null}
         </Form.Group>      
         <Form.Group controlId="birthdate">
            <Form.Label>Birthdate</Form.Label>
            <Form.Control type="date" value={birthdate} onChange={(e) => { setBirthdate(e.target.value) }} disabled={pending} />
            {validateErrors.birthdate ? <Form.Label className="text-red-600">{validateErrors.birthdate}</Form.Label> : null}
         </Form.Group>
         <Form.Group controlId="gender">
            <Form.Label>Gender</Form.Label>
            <Form.Select value={gender} onChange={(e) => { setGender(e.target.value) }} disabled={pending}>
               <option value="">Select Gender</option>
               <option value="male">Male</option>
               <option value="female">Female</option>
               <option value="other">Other</option>
               <option value="prefer_not_to_say">Prefer Not To Say</option>
            </Form.Select>
            {validateErrors.gender ? <Form.Label className="text-red-600">{validateErrors.gender}</Form.Label> : null}       
         </Form.Group>
         <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value) }} disabled={pending} />
             {validateErrors.password ? <Form.Label className="text-red-600">{validateErrors.password}</Form.Label> : null}
         </Form.Group>
         <Form.Group controlId="passwordRepeat">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" placeholder="Confirm Password" value={passwordRepeat} onChange={(e) => { setPasswordRepeat(e.target.value) }} disabled={pending} />
            {validateErrors.passwordRepeat ? <Form.Label className="text-red-600">{validateErrors.passwordRepeat}</Form.Label> : null}
         </Form.Group>
         <Button variant="primary" type="submit" disabled={pending}>
            {pending ? <div className="flex gap-2 items-center"><Spinner size="sm" animation="border" />Submitting...</div> : "Register"}
         </Button>
         {userExistsError ? <Form.Label className="text-red-600">User already exsits.</Form.Label> : null}
      </Form>
   );
}
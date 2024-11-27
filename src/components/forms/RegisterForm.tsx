"use client";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useEffect, useState } from "react";
import registerUserSchema from "@/lib/form_schemas/registerFormSchema";
import { redirect } from "next/navigation";
import { UserAuth, UserProfile, UserSettings } from "@/lib/db/models";
import { Alert } from "react-bootstrap";
import Link from "next/link";
import ApiError from "@/lib/errors/ApiError";
import "@/public/RegisterFormStyle.css";

interface RegisterValidateErrors {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  email: string | null;
  birthdate: string | null;
  gender: string | null;
  password: string | null;
  passwordRepeat: string | null;
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
  // Success state
  const [success, setSuccess] = useState(false);
  const [redirectSeconds, setRedirectSeconds] = useState(3);
  // Validate form errors state
  const [validateErrors, setValidateErrors] = useState<RegisterValidateErrors>({
    firstName: null,
    lastName: null,
    username: null,
    email: null,
    birthdate: null,
    gender: null,
    password: null,
    passwordRepeat: null,
  });

  const [isVisible, setIsVisible] = useState(false); //for fade in
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // On success redirect after 3 seconds
  useEffect(() => {
    if (success) {
      if (redirectSeconds === 0) {
        redirect("/login");
      }

      setTimeout(() => {
        setRedirectSeconds(redirectSeconds - 1);
      }, 1000);
    }
  }, [success, redirectSeconds]);

  async function onSubmit() {
    // Set pending state
    setPending(true);
    setUserExistsError(false);
    setValidateErrors({
      firstName: null,
      lastName: null,
      username: null,
      email: null,
      birthdate: null,
      gender: null,
      password: null,
      passwordRepeat: null,
    });
    // Validate form data
    const validateFields = registerUserSchema.safeParse({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      birthdate: new Date(birthdate),
      gender: gender,
      password: password,
      passwordRepeat: passwordRepeat,
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
        passwordRepeat: errors.passwordRepeat?._errors[0] || null,
      });

      // Disable pending state
      setPending(false);
    } else {
      // If valid, make API call to register create user profile and register user
      const userProfile: UserProfile = {
        username: username,
        email: email,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        birthDate: new Date(birthdate),
        about: "",
        profilePicture: "",
      };
      const userProfileResponse = await fetch(
        "https://bingus.website//api/crud/user_profile",
        {
          method: "POST",
          body: JSON.stringify(userProfile),
        }
      );
      // Check if user already exists
      if (userProfileResponse.status === 409) {
        setUserExistsError(true);
        setPending(false);
      } else if (userProfileResponse.status === 201) {
        const userProfileResponseBody = await userProfileResponse.json();
        const userId = userProfileResponseBody.userId;

        const userSettings: UserSettings = {
          userId: userId,
          showName: false,
          profilePublic: true,
        };
        const userSettingsResponse = await fetch(
          "https://bingus.website//api/crud/user_settings",
          {
            method: "POST",
            body: JSON.stringify(userSettings),
          }
        );

        if (userSettingsResponse.status === 409) {
          setUserExistsError(true);
          setPending(false);
        } else if (userSettingsResponse.status === 201) {
          const userAuth: UserAuth = {
            password: password,
            dateRegistered: new Date(),
            userId: userId,
          };
          const registerUserResponse = await fetch(
            "https://bingus.website//api/session/register",
            {
              method: "POST",
              body: JSON.stringify(userAuth),
            }
          );
          if (registerUserResponse.status === 201) {
            // Show success message
            setSuccess(true);
          }
          // Unhandled error response from API - throw Error so page redirects to error page
          else {
            throw new ApiError("What the Bingus?", registerUserResponse.status);
          }
        }
        // Unhandled error response from API - throw Error so page redirects to error page
        else {
          throw new ApiError("What the Bingus?", userSettingsResponse.status);
        }
      }
      // Unhandled error response from API - throw Error so page redirects to error page
      else {
        throw new ApiError(
          "What the Bingus? An error occured.",
          userProfileResponse.status
        );
      }
    }
  }

  return (
    <div className={isVisible ? "fade-in" : ""}>
      <Form action={onSubmit} className="form-container">
        <h1> Sign Up for Bingus</h1>

        <Form.Group controlId="firstname">
          <Form.Label className="form-label">First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={pending}
            className="form-input"
          />
          {validateErrors.firstName && (
            <Form.Label className="text-red-600">
              {validateErrors.firstName}
            </Form.Label>
          )}
        </Form.Group>
        <Form.Group controlId="lastname">
          <Form.Label className="form-label">Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={pending}
            className="form-input"
          />
          {validateErrors.lastName && (
            <Form.Label className="text-red-600">
              {validateErrors.lastName}
            </Form.Label>
          )}
        </Form.Group>
        <Form.Group controlId="username">
          <Form.Label className="form-label">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="BingusFanPage224"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={pending}
            className="form-input"
          />
          {validateErrors.username && (
            <Form.Label className="text-red-600">
              {validateErrors.username}
            </Form.Label>
          )}
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label className="form-label">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={pending}
            className="form-input"
          />
          {validateErrors.email && (
            <Form.Label className="text-red-600">
              {validateErrors.email}
            </Form.Label>
          )}
        </Form.Group>
        <Form.Group controlId="birthdate">
          <Form.Label className="form-label">Birthdate</Form.Label>
          <Form.Control
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            disabled={pending}
            className="form-input"
          />
          {validateErrors.birthdate && (
            <Form.Label className="text-red-600">
              {validateErrors.birthdate}
            </Form.Label>
          )}
        </Form.Group>
        <Form.Group controlId="gender">
          <Form.Label className="form-label">Gender</Form.Label>
          <Form.Select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            disabled={pending}
            className="form-select"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer Not To Say</option>
          </Form.Select>
          {validateErrors.gender && (
            <Form.Label className="text-red-600">
              {validateErrors.gender}
            </Form.Label>
          )}
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label className="form-label">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={pending}
            className="form-input"
          />
          {validateErrors.password && (
            <Form.Label className="text-red-600">
              {validateErrors.password}
            </Form.Label>
          )}
        </Form.Group>
        <Form.Group controlId="passwordRepeat">
          <Form.Label className="form-label">Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
            disabled={pending}
            className="form-input"
          />
          {validateErrors.passwordRepeat && (
            <Form.Label className="text-red-600">
              {validateErrors.passwordRepeat}
            </Form.Label>
          )}
        </Form.Group>
        <Form.Group controlId="submit" className="flex justify-center flex-col">
          <Button
            variant="primary"
            type="submit"
            disabled={pending}
            style={{ marginTop: 20 }}
          >
            {pending ? (
              <div className="flex gap-2 items-center">
                <Spinner size="sm" animation="border" />
                Submitting...
              </div>
            ) : (
              "Register"
            )}
          </Button>
          {userExistsError && (
            <Form.Label className="text-red-600">
              User already exists.
            </Form.Label>
          )}
        </Form.Group>
        <div>
          Already have an account?{" "}
          <Link href="/login" className="text-[#8f6ccc]">
            Log In
          </Link>
        </div>
        {success && (
          <div
            className="position-fixed top-0 end-0 p-3"
            style={{ zIndex: 1050 }}
          >
            <Alert variant="success">
              <Alert.Heading>User registered successfully.</Alert.Heading>
              <p>Redirecting to login page...</p>
            </Alert>
          </div>
        )}
      </Form>
    </div>
  );
}

import bcrypt from "bcrypt";
import { registerUserSchema } from "./formSchemas";
import { User } from "./interfaces";

export interface FormState {
    data?: any;
    error?: Error | undefined;
    status?: number;
}

/**
 * Register a new user.
 * 
 * @param {FormState} prevState - Previous form state from form client component.
 * @param {FormData} formData - Form data submitted.
 * 
 * @returns {Promise<FormState>} - The form state object including data, error, status.
 */
export async function registerAction(prevState: FormState, formData: FormData): Promise<FormState> {

    //Validate form data
    const validateFields = registerUserSchema.safeParse({
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        gender: formData.get('gender'),
        birthDate: formData.get('birthDate')
    });

    //Validation failed
    if (!validateFields.success) {
        return {
            data: validateFields.error.format(),
            status: 400,
            error: new Error("Inappropriate input data.")
        };
    }

    //Validation succeeded
    const { password, ...userData } = validateFields.data;
    try {
        //Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create new user
        const user: User = {
            username: userData.username,
            password: hashedPassword,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            gender: userData.gender,
            birthDate: userData.birthDate,
            about: "",
            dateRegistered: Date.now().toString()
        }

        //Make API call to CREATE new user
        //await fetch(...);

        return {
            data: {
                ...user,
                password: undefined
            },
            status: 200
        };
    }
    catch (error: any) {
        return {
            error: error,
            status: 500
        };
    }
}

/**
 * Logs in an existing user.
 * 
 * @param {FormState} prevState - Previous form state from form client component.
 * @param {FormData} formData - Form data submitted.
 * 
 * @returns {Promise<FormState>} - The form state object including data, error, status.
 */
// export async function loginUserAction(prevState: FormState, formData: FormData): Promise<FormState> {

// }
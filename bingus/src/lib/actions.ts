import bcrypt from "bcrypt";

interface FormState {
    data?: any;
    error?: Error | undefined;
    status?: number;
}

/**
 * Register a new user.
 * 
 * @param prevState - Previous form state from form client component.
 * @param formData - Form data submitted.
 */
export async function registerAction(state: FormState, formData: FormData): Promise<FormState> {
    
}
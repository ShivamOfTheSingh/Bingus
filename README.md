# Bingus
Bingus LLC

# File guidelines
## 1. React Components
  ```js
  /**
  * If you have to, specify client or server component.
  * Must specify client to use hooks, must specify server to have the component be an async function.
  */
  "use client";

  /**
  * Define props interface for this component, specifying any necessary fields.
  * Use classname for components that have to be reused in different style, where you'd have a separate CSS file instead of using Tailwind CSS.
  */
  interface ButtonProps {
       text: string;
       onClick?: () => void;
       className?: string;
   }

  export default function Button({ text, onClick, className }: ButtonProps) {
        return (
          <button className={className} onClick={onClick}>{text}<button/>
        );
  }
  ```
  ## 2. API Routes
  ```js
  /**
  * Use NextRequest and NextResponse for extended funcionality.
  */
  import { NextRequest, NextResponse } from "next/server";
  import handleError from "@app/lib/errors";

  export default async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        /**
        * Return response with appropriate status and JSON format.
        */
        return NextResponse.json({ data: data }, { status: 200 });
    }
    catch (error: any) {
      /**
      * Use appropriate error handlers.
      */
      return handleError(error);
    }
  }
  ```
  ## 3. Server Actions
  ```js
  /**
  *  Use server actions when you have to use async/await from a client component.
  *  We'll have to use this a lot when submitting forms.
  *  Create an async function in a separate file and use as "action" parameter in form or button element.
  */

  /**
  * Specify use server.
  */
  "use server";

  /**
  *  We'll have this FormState interface (or something similar) that'll be returned by server actions.
  */
  interface FormState {
    data?: any;
    error?: Error | undefined;
    status?: number;
  }

  /**
  * Example server action.
  */
  export async function action(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const response = await fetch("http://localhost:3000/api/awsdata");
        const json = await response.json();
        if (json.data) {
            return {
                data: json,
                status: response.status
            }
        }
        return {
            error: json.error,
            status: response.status
        }
    }
    /**
     * Catch any errors that occured here instead of being returned from API.
     */
    catch (error: any) {
        /**
         * Use appropriate error handler.
         */
        return handleError(error);
    }
  }
  ```
  

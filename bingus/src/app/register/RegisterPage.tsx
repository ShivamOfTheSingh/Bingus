import { RegisterForm } from "./RegisterForm";
import './RegisterFormStyle.css';

export default function RegisterPage() 
{
    return (
        <>
            <div className ="container">
                <div className= "bg-slate-100">
                    <div className = "h-screen w-screen flex justify-center items-center"> 
                        <div>
                            <h1>Hello sigma</h1>
                            <img src="/logo.jpg" alt="Company Logo" />
                        </div>
                        <h1>Sign Up</h1>
                        <div className="shadow-xl p-4 bg-white rounded-xl justify-end">
                            <RegisterForm />
                        </div>
                    </div>
                </div>
            </div>
         </>
        
        
    );
}
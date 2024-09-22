import RegisterForm from "./RegisterForm";
// import './RegisterFormStyle.css';

export default function RegisterPage() 
{
    return (
        <>
            <div >
                <div >
                    <div > 
                        <div>
                            <h1>Hello sigma</h1>
                            <img src="/logo.jpg" alt="Company Logo" />
                        </div>
                        <h1>Sign Up</h1>
                        <div >
                            <RegisterForm />
                        </div>
                    </div>
                </div>
            </div>
         </>
        
        
    );
}
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
  */
  interface ButtonProps {
       text: string;
       onClick?: () => void;
       className?: string; //Use classname for components that have to be reused in different style, where you'd have a separate CSS file instead of using Tailwind    
   }

  export default function Button({ text, onClick, className }: ButtonProps) {
        return (
          <button className={className} onClick={onClick}>{text}<button/>
        );
  }
  ```
  ## 2. API Routes
  

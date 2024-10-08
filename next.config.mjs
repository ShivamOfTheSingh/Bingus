/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      NEXT_PUBLIC_DB_HOST: process.env.DB_HOST,
      NEXT_PUBLIC_DB_NAME: process.env.DB_NAME,
      NEXT_PUBLIC_DB_PASSWORD: process.env.DB_PASSWORD,
      NEXT_PUBLIC_DB_USER: process.env.DB_USER,
      NEXT_PUBLIC_SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY
    }
  };
  
  export default nextConfig;

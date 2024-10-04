/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      DB_HOST: process.env.DB_HOST,
      DB_NAME: process.env.DB_NAME,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_USER: process.env.DB_USER,
      SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY
    }
  };
  
  export default nextConfig;
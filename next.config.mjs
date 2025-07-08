/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PROD_BACKEDN: "https://resturant-mgr-backend.onrender.com",
    LOCAL_BACKEND: "http://localhost:5000",
    ENV_MODE: "development",
  },
};

export default nextConfig;

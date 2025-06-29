/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PROD_BACKEDN: "https://resturant-mgr-backend.onrender.com/api/",
    LOCAL_BACKEND: "http://localhost:5000/api/",
    ENV_MODE: "development",
  },
};

export default nextConfig;

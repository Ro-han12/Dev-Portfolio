/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode:false,
    images:{
        unoptimized:true,
        domains:['firebasestorage.googleapis.com']
    }
};

export default nextConfig;

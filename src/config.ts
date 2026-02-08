// server/src/config.ts

const hostname = window.location.hostname;
const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

// PUT YOUR RENDER BACKEND URL HERE
const PROD_BACKEND_URL = 'https://career-advisor-app-for-education.onrender.com';

export const API_BASE_URL = isLocal
    ? '' // Use Vite proxy in development
    : PROD_BACKEND_URL;

console.log('API_BASE_URL:', API_BASE_URL);

// server/src/config.ts

const hostname = window.location.hostname;
const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

// AUTOMATICALLY DETECT PRODUCTION URL
const PROD_BACKEND_URL = window.location.origin; // Since backend serves the frontend!

export const API_BASE_URL = isLocal
    ? '' // Use Vite proxy in development
    : PROD_BACKEND_URL;

console.log('API_BASE_URL:', API_BASE_URL);

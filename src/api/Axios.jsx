import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/",
    timeout: 10000,
})

api.interceptors.request.use((config) => {
    // List of public endpoints that don't require authentication
    const publicEndpoints = [
        '/api/produk',
        '/api/produk/',
        '/api/user/register',
        '/api/user/login',
        '/api/admin/login',
        '/api/admin/verify-otp',
        '/api/admin/list',  // Public endpoint to get admin list for chat
        '/auth/login-admin',
        '/auth/verifikasi-otp-admin',
        '/auth/kirim-ulang-otp-admin'
    ];
    
    // Check if current request is to a public endpoint
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
        config.url?.startsWith(endpoint) || config.url?.includes(endpoint)
    );
    
    // Check for both user and admin tokens
    let token = null;
    if (typeof window !== "undefined") {
        // Try admin token first (for admin pages)
        token = localStorage.getItem("admin_token");
        // If no admin token, try user token
        if (!token) {
            token = localStorage.getItem("user_token");
        }
    }
    
    if (token && !config.headers?.Authorization) {
        config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
        console.log(`[Axios] Request to ${config.url} with token:`, token.substring(0, 20) + '...');
    } else if (!token && !isPublicEndpoint) {
        // Only warn for non-public endpoints
        console.warn(`[Axios] No token found for request to ${config.url}`);
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const data = err?.response?.data;
        const message = data?.message || data?.error || (Array.isArray(data?.errors) ? data.errors.join(", ") : undefined);
        if (message) {
            err.message = message;
        }
        
        // Handle 401/403 errors (Unauthorized/Forbidden)
        if (err.response?.status === 401 || err.response?.status === 403) {
            // Check if it's an admin request by checking current path or token type
            const isAdminRoute = window.location.pathname.startsWith('/admin');
            
            if (isAdminRoute) {
                // For admin routes, check if admin token exists
                const adminToken = localStorage.getItem('admin_token');
                if (adminToken) {
                    console.error('Admin token expired or invalid');
                    // Don't auto-redirect here, let the component handle it
                    // This prevents redirect loops
                }
            } else {
                // For user routes
                const userToken = localStorage.getItem('user_token');
                if (userToken && !window.location.pathname.includes('/login')) {
                    console.error('User token expired or invalid');
                    // Don't auto-redirect here either
                }
            }
        }
        
        return Promise.reject(err);
    }
);

export default api;

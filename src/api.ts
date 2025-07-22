import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080',
    withCredentials: true, // nếu refresh token nằm trong httpOnly cookie
    headers: { 'Content-Type': 'application/json' },
});

// Đính kèm access token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token =
            localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Tự động refresh token khi 401
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const res = await api.get('/auth/refresh-token');
                const newAccessToken = res.data.access_token;

                if (!newAccessToken) {
                    throw new Error('No new access token received');
                }

                localStorage.setItem('access_token', newAccessToken);

                // Cập nhật token cho request gốc
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('access_token');
                sessionStorage.removeItem('access_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

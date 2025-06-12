import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = document.cookie.split('; ').find(row => row.startsWith('refresh_token='))?.split('=')[1];
            if (!refreshToken) {
                window.location.href = '/login';
                return Promise.reject(error);
            }
            try {
                const response = await api.get('/auth/refresh-token', { withCredentials: true });
                const newAccessToken = response.data.access_token;
                localStorage.setItem('access_token', newAccessToken);
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
import api from './api';
import { LoginDTO, RegisterDTO, ResLoginDTO } from './types';
import axios from "axios";

export const login = async (credentials: LoginDTO): Promise<ResLoginDTO> => {
    const response = await api.post<ResLoginDTO>('/auth/login', credentials);
    return response.data;
};

export const register = async (registerDTO: RegisterDTO): Promise<{ status: number; data?: any }> => {
    const response = await api.post('/auth/register', registerDTO);
    return { status: response.status, data: response.data };
};

export const logout = async (): Promise<void> => {
    await api.post('/auth/logout');
};

export async function refreshToken() {
    const res = await axios.post("/api/refresh", null, {
        withCredentials: true // để gửi cookie refresh_token
    });
    return res.data.access_token;
}

export interface LoginDTO {
    username: string;
    password: string;
}

export interface RegisterDTO {
    email: string;
    username: string;
    password: string;
}

export interface UserLogin {
    id: number;
    email: string;
    name: string;
}

export interface ResLoginDTO {
    access_token: string;
    userp: UserLogin;
}

export interface ApiError {
    message: string;
}
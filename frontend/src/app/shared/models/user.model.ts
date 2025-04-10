export interface User{
    username?: string;
    email: string;
    password?:  string;
    role?: string;
}


export interface Users{
    id: string;
    username: string;
    email: string;
    role: string;
}

export interface UsersResponse{
    success: boolean;
    message: string;
    users: Users[];
}
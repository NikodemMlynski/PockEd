import { createContext, useContext } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { API_URL, TOKEN_STORAGE_KEY} from "../config/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface IUser {
    id: number;
    username: string;
    email: string;
    created_at: Date;
}

interface AuthContextType {
    user: IUser | null;
    login: (token: string) => void;
    logout: () => void;
    isLoading: boolean;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {data: user, isLoading} = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const token = localStorage.getItem(TOKEN_STORAGE_KEY);
            if(!token) return null;

            const response = await fetch(`${API_URL}/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(!response.ok) throw new Error("Błąd autoryzacji");
            return response.json();
        },
        staleTime: 1000 * 60 * 5,
        retry: false
    });

    const loginMutation = useMutation({
        mutationFn: async (token: string) => {
            console.log(token);
            localStorage.setItem(TOKEN_STORAGE_KEY, token);

            const response = await fetch(`${API_URL}/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(!response.ok) throw new Error("Błąd logowania");
            return response.json();
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["user"], data);
            navigate("/");
        },
        onError: () => {
            logout();
        }
    });

    const logout = () => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        queryClient.setQueryData(["user"], null);
        navigate("/signin");
    }
    return (
        <AuthContext.Provider value={{
            user: user || null,
            login: loginMutation.mutateAsync,
            logout,
            isLoading,
            token: localStorage.getItem(TOKEN_STORAGE_KEY) || null,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("useAuth have to be used inside AuthProvider");
    }
    return context;
}
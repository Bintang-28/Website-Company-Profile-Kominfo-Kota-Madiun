"use client";

import { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            const authToken = Cookies.get('auth_token');
            setToken(authToken);

            if (authToken) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                            'Accept': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                    } else {
                        // Panggil fungsi logout tanpa menggunakan useRouter
                        await performLogout(authToken);
                    }
                } catch (error) {
                    console.error("Gagal verifikasi token:", error);
                     // Panggil fungsi logout tanpa menggunakan useRouter
                    await performLogout(authToken);
                }
            }
            setIsLoading(false);
        };

        const performLogout = async (tokenToLogout) => {
            if (tokenToLogout) {
                try {
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${tokenToLogout}` },
                    });
                } catch (error) {
                    console.error("Gagal menghubungi server untuk logout:", error);
                }
            }
            Cookies.remove('auth_token', { path: '/' });
            setUser(null);
            setToken(null);
            window.location.href = '/login';
        };

        verifyUser();
    }, []);

    const logout = async () => {
        const authToken = Cookies.get('auth_token');
        if (authToken) {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${authToken}` },
                });
            } catch (error) {
                console.error("Gagal menghubungi server untuk logout:", error);
            }
        }
        Cookies.remove('auth_token', { path: '/' });
        setUser(null);
        setToken(null);
        window.location.href = '/login';
    };

    const value = { user, token, logout, isLoading }; 

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children} 
        </AuthContext.Provider>
    );
}


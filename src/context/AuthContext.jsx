import React, { createContext, useState, useContext } from 'react';
import { addUserToTopic, removeUserFromTopic } from '../services/firebase';
import { sendLoginRequest } from '../services/data';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (email) => {
        try {
            const response = await sendLoginRequest(email);
            if (response.success) {
                const userData = response.data;
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                addUserToTopic('pilotos');
                return { success: true };
            } else {
                return { success: false, message: response.message || 'Error al iniciar sesión' };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: 'Error de conexión' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        removeUserFromTopic('pilotos');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

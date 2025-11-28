import React, { createContext, useState, useContext, useEffect } from 'react';
import { addUserToTopic, removeUserFromTopic } from '../services/firebase';
import { sendLoginRequest, sendEmailVerification } from '../services/data';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing stored user:", error);
                localStorage.removeItem('user');
            }
        }
    }, []);

    const login = async (email) => {
        try {
            const response = await sendLoginRequest(email);
            if (!response.success) {
                return { success: false, message: response.message || 'Error al iniciar sesión' };
            }

            const emailResponse = await sendEmailVerification(response.data.nombre, response.data.correo, response.data.codigo);

            if (!emailResponse.success) {
                return { success: false, message: emailResponse.message || 'Error al enviar correo de verificación' };
            }

            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            addUserToTopic('pilotos');
            return { success: true };
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

import React, { createContext, useState, useContext, useEffect } from 'react';
import { addUserToTopic, removeUserFromTopic } from '../services/firebase';
import { sendLoginRequest, sendEmailVerification } from '../services/data';
import { logEvent } from '../services/telemetry';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
    }, []);

    const login = async (email) => {
        try {
            const response = await sendLoginRequest(email);
            if (!response.success) {
                logEvent('login_failed', { email, reason: response.message || 'Driver not found' });
                return { success: false, message: response.message || 'Error al iniciar sesión' };
            }

            const emailResponse = await sendEmailVerification(response.data.nombre, response.data.correo, response.data.codigo);

            if (!emailResponse.success) {
                logEvent('login_failed', { email, reason: 'Email delivery failed' });
                return { success: false, message: emailResponse.message || 'Error al enviar correo de verificación' };
            }
            response.data.codigo = null;
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            addUserToTopic('pilotos');
            logEvent('login_success', { email: response.data.correo, name: response.data.nombre });
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            logEvent('login_failed', { email, reason: 'Network/Connection error' });
            return { success: false, message: 'Error de conexión' };
        }
    };

    const logout = () => {
        const email = user?.correo;
        setUser(null);
        localStorage.removeItem('user');
        removeUserFromTopic('pilotos');
        logEvent('logout', { email });
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

import React, {createContext, useContext, useState, useEffect} from 'react';
import {getUsernameFromToken} from '../utils/UserAPI';

interface AuthContextType
{
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    setIsAuthenticated: () =>
    {
    },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) =>
{
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() =>
    {
        const checkAuth = async () =>
        {
            const token = localStorage.getItem('token');
            if (token)
            {
                try
                {
                    const username = getUsernameFromToken();
                    setIsAuthenticated(!!username);
                } catch
                {
                    setIsAuthenticated(false);
                    localStorage.removeItem('token');
                }
            } else
            {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
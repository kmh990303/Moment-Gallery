import { createContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isLoggedIn: boolean;
    userId: string | null;
    token: string | null;
    login: (uid: string, token: string, expirationDate?: Date) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    userId: null,
    token: null,
    login: () => { },
    logout: () => { },
});

let logoutTimer: NodeJS.Timeout;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [tokenExpirationDate, setTokenExpirationDate] = useState<Date | undefined>();
    const [userId, setUserId] = useState<string | null>(null);

    const login = useCallback((uid: string, token: string, expirationDate?: Date) => {
        setToken(token);
        setUserId(uid);
        const tokenExpirationDate =
            expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem(
            'userData',
            JSON.stringify({
                userId: uid,
                token: token,
                expiration: tokenExpirationDate.toISOString()
            })
        )
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setTokenExpirationDate(undefined);
        setUserId(null);
        localStorage.removeItem('userData');
    }, []);

    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, tokenExpirationDate, logout]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (
            storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date()
        ) {
            login(storedData.userId, storedData.token, new Date(storedData.expiration));
        }
    }, [login]);

    return (
        <AuthContext.Provider value={{ isLoggedIn: !!token, token, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}


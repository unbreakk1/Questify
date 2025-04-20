import {CssVarsProvider} from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router';
import theme from './themes/theme';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import {useEffect, useState} from 'react';
import {getUsernameFromToken} from './utils/UserAPI';

function App()
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
        <CssVarsProvider defaultMode="dark" theme={theme}>
            <CssBaseline/>
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? <Navigate to="/dashboard"/> : <LandingPage/>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            isAuthenticated ? <DashboardPage/> : <Navigate to="/"/>
                        }
                    />
                </Routes>
            </Router>
        </CssVarsProvider>
    );
}

export default App;

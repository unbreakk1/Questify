import {CssVarsProvider} from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router';
import theme from './themes/theme';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import {AuthProvider, useAuth} from './contexts/AuthContext';

function AppRoutes()
{
    const {isAuthenticated} = useAuth();

    return (
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
    );
}

function App()
{
    return (
        <CssVarsProvider defaultMode="dark" theme={theme}>
            <CssBaseline/>
            <AuthProvider>
                <Router>
                    <AppRoutes/>
                </Router>
            </AuthProvider>
        </CssVarsProvider>
    );
}

export default App;
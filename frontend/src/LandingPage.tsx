import React, { useState } from 'react';
import {
    AppBar,
    Box,
    Button,
    CssBaseline,
    Toolbar,
    Typography,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import LoginDialog from './components/auth/LoginDialog';
import RegisterDialog from './components/auth/RegisterDialog';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
    },
});

const LandingPage: React.FC = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Questify
                    </Typography>
                    <Button color="inherit" onClick={() => setIsLoginOpen(true)}>
                        Login
                    </Button>
                    <Button color="inherit" onClick={() => setIsRegisterOpen(true)}>
                        Register
                    </Button>
                </Toolbar>
            </AppBar>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 'calc(100vh - 64px)',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h2">Welcome to Questify</Typography>
            </Box>

            {/* Dialogs for Login and Registration */}
            <LoginDialog open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            <RegisterDialog open={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
        </ThemeProvider>
    );
};

export default LandingPage;
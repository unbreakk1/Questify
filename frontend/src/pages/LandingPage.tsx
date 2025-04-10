import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    CssBaseline,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
    Paper,
    ThemeProvider,
    createTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import { loginUser } from '../api/Auth'; // Import loginUser from Auth
import { useNavigate } from 'react-router';
import RegisterDialog from "../components/auth/RegisterDialog.tsx"; // Import useNavigate

// Dark Theme
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#90caf9' },
        secondary: { main: '#f48fb1' },
        background: { default: '#121212', paper: '#1e1e1e' },
        text: { primary: '#fff', secondary: '#aaa' },
    },
    typography: {
        fontFamily: 'Poppins, Arial, sans-serif',
        h1: { fontWeight: 700, fontSize: '3rem' },
        h2: { fontWeight: 700, fontSize: '2.5rem' },
    },
});

// Custom Styled Paper for Hero Section
const HeroPaper = styled(Paper)(({ theme }) => ({
    background: 'url(https://cdn2.unrealengine.com/tiny-tinas-assault-on-dragon-keep-a-wonderlands-one-shot-adventure-1920x1080-48815fcbf80a.jpg) no-repeat center center',
    backgroundSize: 'cover',
    height: '70vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(4),
}));

const LandingPage: React.FC = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Form state for Login
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const navigate = useNavigate(); // Initialize the navigate function

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

    // Login form submit handler
    const handleLoginSubmit = async () => {
        if (!loginUsername || !loginPassword) {
            setLoginError('Please fill in both fields.');
            return;
        }

        setLoginError('');
        setIsLoggingIn(true); // Show loading state
        try {
            // Call the loginUser function from Auth.tsx
            const token = await loginUser(loginUsername, loginPassword);
            localStorage.setItem('token', token); // Save the token to localStorage
            console.log('Login successful! Token:', token);
            setIsLoginOpen(false);


            navigate('/dashboard');
        } catch {
            setLoginError('Invalid username or password. Please try again.');
        } finally {
            setIsLoggingIn(false); // Hide loading state
        }
    };

    const handleDialogClose = () => {
        setIsLoginOpen(false);
        setIsRegisterOpen(false);
        setLoginError('');
        setLoginUsername('');
        setLoginPassword('');
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />

            {/* AppBar (Header) */}
            <AppBar position="fixed">
                <Toolbar sx={{ width: '100%' }}>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Questify
                    </Typography>
                    <Button color="inherit" onClick={() => setIsLoginOpen(true)}>
                        Login
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => setIsRegisterOpen(true)}>
                        Join Now
                    </Button>
                </Toolbar>
            </AppBar>
            <RegisterDialog open={isRegisterOpen} onClose={handleDialogClose} />


            {/* Sidebar Drawer */}
            <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
                <Box
                    sx={{ width: 250, backgroundColor: 'background.default', height: '100%' }}
                    aria-hidden="true"
                    onClick={toggleDrawer}
                    onKeyDown={toggleDrawer}
                >
                    <Typography variant="h5" sx={{ p: 2 }}>
                        Navigation
                    </Typography>
                    <Divider />
                    <List>
                        {['Home', 'Features', 'Pricing', 'About'].map((text) => (
                            <ListItem button key={text} component="li" disablePadding>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    mt: '64px',
                    width: '100vw',
                    padding: 0,
                }}
            >
                <HeroPaper elevation={3}>
                    <Box textAlign="center">
                        <Typography variant="h1" gutterBottom>
                            Welcome to Questify
                        </Typography>
                        <Typography variant="h5" sx={{ mb: 4 }}>
                            Turn your life into an epic adventure
                        </Typography>
                        <Button variant="contained" color="primary" size="large">
                            Get Started
                        </Button>
                    </Box>
                </HeroPaper>
            </Box>

            {/* Login Dialog */}
            <Dialog open={isLoginOpen} onClose={handleDialogClose}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    {loginError && <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>}
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    {isLoggingIn ? (
                        <CircularProgress size={24} sx={{ margin: 'auto', mt: 1, mb: 1 }} />
                    ) : (
                        <>
                            <Button onClick={handleDialogClose}>Cancel</Button>
                            <Button variant="contained" onClick={handleLoginSubmit}>
                                Login
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    backgroundColor: '#222',
                    color: '#fff',
                    textAlign: 'center',
                    padding: 2,
                    marginTop: 4,
                    width: '100vw',
                    position: 'relative',
                    left: 0,
                }}
            >
                <Typography variant="body2">
                    © {new Date().getFullYear()} Questify. All Rights Reserved.
                </Typography>
            </Box>
        </ThemeProvider>
    );
};

export default LandingPage;
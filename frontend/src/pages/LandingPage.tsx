import React, {useState} from 'react';
import {
    CssBaseline,
    GlobalStyles,
    Sheet,
    IconButton,
    Typography,
    Button,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemContent,
    Divider,
    Modal,
    ModalDialog,
    ModalClose,
    Input,
    Alert,
    CircularProgress,
    Stack
} from '@mui/joy';
import MenuIcon from '@mui/icons-material/Menu';
import {loginUser} from '../api/Auth'; // Import loginUser from Auth
import {useNavigate} from 'react-router';
import RegisterDialog from "../components/auth/RegisterDialog.tsx"; // Import useNavigate

// Header Component
const Header: React.FC<{
    onLoginClick: () => void;
    onRegisterClick: () => void;
    onMenuClick: () => void;
}> = ({onLoginClick, onRegisterClick, onMenuClick}) => (
    <Sheet
        component="header"
        variant="solid"
        invertedColors
        sx={{
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 9999,
            p: 2,
            background: 'linear-gradient(45deg, var(--joy-palette-primary-900), var(--joy-palette-primary-800))',
        }}
    >
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
            }}
        >
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <IconButton
                    variant="plain"
                    color="neutral"
                    onClick={onMenuClick}
                >
                    <MenuIcon/>
                </IconButton>
                <Typography level="h4">
                    Questify
                </Typography>
            </Box>

            <Box sx={{display: 'flex', gap: 1}}>
                <Button
                    variant="plain"
                    color="neutral"
                    onClick={onLoginClick}
                >
                    Login
                </Button>
                <Button
                    variant="outlined"
                    onClick={onRegisterClick}
                >
                    Join Now
                </Button>
            </Box>
        </Box>
    </Sheet>
);

// Login Modal Component
const LoginModal: React.FC<{
    open: boolean;
    onClose: () => void;
    error: string;
    username: string;
    password: string;
    onUsernameChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
}> = ({
          open,
          onClose,
          error,
          username,
          password,
          onUsernameChange,
          onPasswordChange,
          onSubmit,
          isLoading
      }) => (
    <Modal open={open} onClose={onClose}>
        <ModalDialog
            variant="outlined"
            role="alertdialog"
            sx={{
                maxWidth: 400,
                borderRadius: 'md',
                p: 3,
                boxShadow: 'lg',
            }}
        >
            <ModalClose/>
            <Typography level="h4" mb={2}>
                Login
            </Typography>

            <Stack spacing={2}>
                {error && (
                    <Alert color="danger" variant="soft">
                        {error}
                    </Alert>
                )}

                <Input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => onUsernameChange(e.target.value)}
                />

                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                />

                <Box sx={{display: 'flex', gap: 1, justifyContent: 'flex-end'}}>
                    {isLoading ? (
                        <CircularProgress size="sm"/>
                    ) : (
                        <>
                            <Button
                                variant="plain"
                                color="neutral"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button onClick={onSubmit}>
                                Login
                            </Button>
                        </>
                    )}
                </Box>
            </Stack>
        </ModalDialog>
    </Modal>
);


const LandingPage: React.FC = () =>
{
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Form state for Login
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const navigate = useNavigate();


    const handleLoginSubmit = async () =>
    {
        if (!loginUsername || !loginPassword)
        {
            setLoginError('Please fill in both fields.');
            return;
        }

        setLoginError('');
        setIsLoggingIn(true);
        try
        {

            const token = await loginUser(loginUsername, loginPassword);
            localStorage.setItem('token', token); // Save the token to localStorage
            console.log('Login successful! Token:', token);
            setIsLoginOpen(false);


            navigate('/dashboard');
        } catch
        {
            setLoginError('Invalid username or password. Please try again.');
        } finally
        {
            setIsLoggingIn(false); // Hide loading state
        }
    };

    const handleDialogClose = () =>
    {
        setIsLoginOpen(false);
        setIsRegisterOpen(false);
        setLoginError('');
        setLoginUsername('');
        setLoginPassword('');
    };

    return (
        <Box sx={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            <CssBaseline/>
            <GlobalStyles
                styles={{
                    ':root': {
                        '--Header-height': '64px',
                    },
                }}
            />

            <Header
                onLoginClick={() => setIsLoginOpen(true)}
                onRegisterClick={() => setIsRegisterOpen(true)}
                onMenuClick={() => setIsDrawerOpen(true)}
            />

            <Drawer
                size="sm"
                variant="soft"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            >
                <Box sx={{width: 250}}>
                    <Typography level="h4" sx={{p: 2}}>
                        Navigation
                    </Typography>
                    <Divider/>
                    <List>
                        {['Home', 'Features', 'Pricing', 'About'].map((text) => (
                            <ListItem key={text}>
                                <ListItemContent>{text}</ListItemContent>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <Box
                component="main"
                sx={{
                    mt: 'var(--Header-height)',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Sheet
                    variant="solid"
                    sx={{
                        minHeight: '70vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'url(https://cdn2.unrealengine.com/tiny-tinas-assault-on-dragon-keep-a-wonderlands-one-shot-adventure-1920x1080-48815fcbf80a.jpg) no-repeat center center',
                        backgroundSize: 'cover',
                    }}
                >
                    <Box
                        sx={{
                            textAlign: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            p: 4,
                            borderRadius: 'lg',
                        }}
                    >
                        <Typography
                            level="h1"
                            sx={{
                                fontSize: '3rem',
                                fontWeight: 'lg',
                                mb: 2,
                                color: 'white'
                            }}
                        >
                            Welcome to Questify
                        </Typography>
                        <Typography
                            level="h3"
                            sx={{
                                mb: 4,
                                color: 'white'
                            }}
                        >
                            Turn your life into an epic adventure
                        </Typography>
                        <Button
                            size="lg"
                            variant="solid"
                            onClick={() => setIsRegisterOpen(true)}
                        >
                            Get Started
                        </Button>
                    </Box>
                </Sheet>
            </Box>

            <Sheet
                component="footer"
                variant="solid"
                sx={{
                    p: 2,
                    textAlign: 'center',
                    background: 'var(--joy-palette-neutral-900)',
                }}
            >
                <Typography level="body-sm" textColor="common.white">
                    © {new Date().getFullYear()} Questify. All Rights Reserved.
                </Typography>
            </Sheet>

            <LoginModal
                open={isLoginOpen}
                onClose={handleDialogClose}
                error={loginError}
                username={loginUsername}
                password={loginPassword}
                onUsernameChange={setLoginUsername}
                onPasswordChange={setLoginPassword}
                onSubmit={handleLoginSubmit}
                isLoading={isLoggingIn}
            />

            <RegisterDialog
                open={isRegisterOpen}
                onClose={handleDialogClose}
            />
        </Box>
    );
};

export default LandingPage;

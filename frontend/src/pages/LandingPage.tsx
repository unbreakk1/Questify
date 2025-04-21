import React, {useState} from 'react';
import {
    CssBaseline,
    GlobalStyles,
    Sheet,
    IconButton,
    Typography,
    Button,
    Box,
    Stack,
    Container,
    ModalDialog,
    Modal, ModalClose, Alert,
    Input,
    CircularProgress,
    Drawer,
} from '@mui/joy';
import MenuIcon from '@mui/icons-material/Menu';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DynamicBackground from '../components/design/DynamicBackground';

import {useAuth} from '../contexts/AuthContext';
import {loginUser} from '../api/Auth';
import {useNavigate} from 'react-router';
import RegisterDialog from "../components/auth/RegisterDialog.tsx";


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
    const {setIsAuthenticated} = useAuth();
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
            setIsAuthenticated(true); // Add this line to update the auth state
            setIsLoginOpen(false);
            navigate('/dashboard');
        } catch
        {
            setLoginError('Invalid username or password. Please try again.');
        } finally
        {
            setIsLoggingIn(false);
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
        <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', overflow: 'hidden'}}>
            <CssBaseline/>
            <GlobalStyles
                styles={{
                    ':root': {
                        '--Header-height': '64px',
                    },
                    'body': {
                        margin: 0,
                        padding: 0,
                    },
                }}
            />

            {/* Header */}
            <Sheet
                component="header"
                variant="solid"
                invertedColors
                sx={{
                    position: 'fixed',
                    top: 0,
                    width: '100%',
                    zIndex: 9999,
                    p: {xs: 1.5, sm: 2},
                    background: 'linear-gradient(45deg, var(--joy-palette-primary-900), var(--joy-palette-primary-800))',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                    }}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: {xs: 1, sm: 2}}}>
                            <IconButton
                                variant="plain"
                                color="neutral"
                                onClick={() => setIsDrawerOpen(true)}
                                sx={{display: {sm: 'none'}}}
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Typography level="h4">
                                Questify
                            </Typography>
                        </Box>

                        <Box sx={{
                            display: {xs: 'none', sm: 'flex'},
                            gap: 1,
                            alignItems: 'center'
                        }}>
                            <Button
                                variant="plain"
                                color="neutral"
                                onClick={() => setIsLoginOpen(true)}
                            >
                                Login
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => setIsRegisterOpen(true)}
                            >
                                Join Now
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Sheet>

            {/* Main Content with Dynamic Background */}
            <DynamicBackground>
                <Container
                    maxWidth="lg"
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        mx: 'auto',
                        px: {xs: 2, sm: 4},
                        py: {xs: 4, sm: 6, md: 8},
                        mt: 'var(--Header-height)',
                    }}
                >
                    <Stack
                        spacing={{xs: 4, md: 6}}
                        sx={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            maxWidth: '800px',
                            mx: 'auto',
                        }}
                    >
                        <Typography
                            level="h1"
                            sx={{
                                fontSize: {xs: '2rem', sm: '3rem', md: '4rem'},
                                fontWeight: 'lg',
                                color: 'common.white',
                                textShadow: '0 0 20px rgba(0,0,0,0.5)',
                            }}
                        >
                            Level Up Your Life
                        </Typography>

                        <Typography
                            level="h3"
                            sx={{
                                fontSize: {xs: '1.25rem', sm: '1.5rem', md: '2rem'},
                                color: 'rgba(255,255,255,0.8)',
                            }}
                        >
                            Transform Daily Tasks into Epic Quests
                        </Typography>

                        <Button
                            size="lg"
                            variant="solid"
                            onClick={() => setIsRegisterOpen(true)}
                            startDecorator={<SportsEsportsIcon/>}
                            sx={{
                                fontSize: {xs: '1rem', sm: '1.2rem'},
                                px: {xs: 3, sm: 4},
                                py: {xs: 1, sm: 1.5},
                                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #FF5252, #43C6B9)',
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            Start Your Journey
                        </Button>

                        {/* Feature Cards */}
                        <Stack
                            direction={{xs: 'column', md: 'row'}}
                            spacing={{xs: 2, md: 4}}
                            sx={{
                                width: '100%',
                                mt: {xs: 4, md: 8},
                                display: 'flex',
                                flexDirection: {xs: 'column', md: 'row'},
                                justifyContent: 'space-between',
                                gap: 4
                            }}
                        >
                            {[
                                {
                                    icon: <SportsEsportsIcon sx={{fontSize: {xs: 40, md: 48}}}/>,
                                    title: "Epic Boss Battles",
                                    description: "Challenge mighty bosses with each completed task",
                                    gradientColors: "linear-gradient(135deg, #FF4B4B 0%, #FF0000 60%)",
                                },
                                {
                                    icon: <CheckCircleIcon sx={{fontSize: {xs: 40, md: 48}}}/>,
                                    title: "Daily Quests",
                                    description: "Transform your habits into rewarding adventures",
                                    gradientColors: "linear-gradient(135deg, #4CAF50 0%, #45a049 60%)",
                                },
                                {
                                    icon: <EmojiEventsIcon sx={{fontSize: {xs: 40, md: 48}}}/>,
                                    title: "Level Up",
                                    description: "Gain experience and unlock new abilities",
                                    gradientColors: "linear-gradient(135deg, #FFD700 0%, #FFA500 60%)",
                                }
                            ].map((feature) => (
                                <Sheet
                                    key={feature.title}
                                    variant="outlined"
                                    sx={{
                                        flex: 1,
                                        p: {xs: 3, md: 4},
                                        borderRadius: '16px',
                                        position: 'relative',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        border: '2px solid rgba(255, 255, 255, 0.1)',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease-in-out',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'linear-gradient(45deg, transparent 48%, rgba(255, 255, 255, 0.1) 50%, transparent 52%)',
                                            zIndex: 1,
                                            pointerEvents: 'none',
                                        },
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: feature.gradientColors,
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease',
                                            zIndex: 0,
                                        },
                                        '&:hover': {
                                            transform: 'translateY(-8px) scale(1.02)',
                                            border: '2px solid rgba(255, 255, 255, 0.3)',
                                            '&::after': {
                                                opacity: 0.15,
                                            },
                                        },
                                    }}
                                >
                                    <Stack
                                        spacing={2.5}
                                        alignItems="center"
                                        textAlign="center"
                                        sx={{position: 'relative', zIndex: 2}}
                                    >
                                        <Box
                                            sx={{
                                                color: 'white',
                                                background: feature.gradientColors,
                                                borderRadius: '12px',
                                                p: 2,
                                                transform: 'rotate(-5deg)',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                                transition: 'transform 0.3s ease',
                                                '&:hover': {
                                                    transform: 'rotate(0deg) scale(1.1)',
                                                },
                                            }}
                                        >
                                            {feature.icon}
                                        </Box>
                                        <Typography
                                            level="h4"
                                            sx={{
                                                color: 'common.white',
                                                fontSize: {xs: '1.5rem', md: '1.75rem'},
                                                fontWeight: 'bold',
                                                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                                                letterSpacing: '0.5px',
                                            }}
                                        >
                                            {feature.title}
                                        </Typography>
                                        <Typography
                                            level="body-md"
                                            sx={{
                                                color: 'rgba(255,255,255,0.9)',
                                                fontSize: {xs: '1rem', md: '1.1rem'},
                                                textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            {feature.description}
                                        </Typography>
                                    </Stack>
                                </Sheet>
                            ))}
                        </Stack>
                    </Stack>
                </Container>
            </DynamicBackground>

            {/* Modals */}
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

            {/* Mobile Drawer */}
            <Drawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                anchor="left"
            >
                <Box sx={{width: 250, p: 2}}>
                    <Stack spacing={2}>
                        <Button
                            variant="plain"
                            color="neutral"
                            onClick={() =>
                            {
                                setIsLoginOpen(true);
                                setIsDrawerOpen(false);
                            }}
                        >
                            Login
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() =>
                            {
                                setIsRegisterOpen(true);
                                setIsDrawerOpen(false);
                            }}
                        >
                            Join Now
                        </Button>
                    </Stack>
                </Box>
            </Drawer>
        </Box>
    );
};


export default LandingPage;





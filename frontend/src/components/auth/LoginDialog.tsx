// LoginDialog.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Modal, Sheet, Typography, FormControl, FormLabel, Input, Button, Box } from '@mui/joy';
import { loginUser } from '../../api/Auth';
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "../../types/ErrorResponse.tsx";
import { decodeToken, isTokenExpired } from "../../utils/AuthUtils.tsx";
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';

interface LoginDialogProps {
    open: boolean;
    onClose: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const token = await loginUser(username, password);
            const decodedToken = decodeToken(token);
            if (!decodedToken) throw new Error('Failed to decode the authentication token.');
            if (isTokenExpired(token)) throw new Error('The authentication token is already expired.');

            localStorage.setItem('token', token.trim());
            localStorage.setItem('username', decodedToken.sub);
            navigate('/dashboard');
            onClose();
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<ErrorResponse>;
                setError(axiosError.response?.data?.message || 'Login failed. Please try again.');
            } else {
                setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
            }
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <Sheet
                variant="outlined"
                sx={{
                    width: 400,
                    borderRadius: 'lg',
                    p: 3,
                    boxShadow: 'lg',
                    background: 'linear-gradient(135deg, var(--joy-palette-background-level1) 0%, var(--joy-palette-background-surface) 100%)',
                    border: '3px solid',
                    borderColor: 'primary.outlinedBorder',
                    animation: 'slideIn 0.3s ease-out',
                    '@keyframes slideIn': {
                        from: { transform: 'translateY(-20px)', opacity: 0 },
                        to: { transform: 'translateY(0)', opacity: 1 },
                    },
                }}
            >
                <Box sx={{
                    textAlign: 'center',
                    mb: 3,
                    animation: 'fadeIn 0.5s ease-out',
                    '@keyframes fadeIn': {
                        from: { opacity: 0 },
                        to: { opacity: 1 },
                    },
                }}>
                    <Typography
                        level="h2"
                        sx={{
                            background: 'linear-gradient(45deg, var(--joy-palette-primary-400), var(--joy-palette-primary-600))',
                            backgroundClip: 'text',
                            color: 'transparent',
                            textShadow: '0 0 20px rgba(var(--joy-palette-primary-mainChannel) / 0.5)',
                            mb: 1,
                        }}
                    >
                        Welcome Back!
                    </Typography>
                    <Typography level="body-md" color="neutral">
                        Continue your journey in Questify
                    </Typography>
                </Box>

                {error && (
                    <Box
                        sx={{
                            p: 1.5,
                            mb: 2,
                            borderRadius: 'md',
                            background: 'rgba(var(--joy-palette-danger-mainChannel) / 0.1)',
                            border: '1px solid',
                            borderColor: 'danger.outlinedBorder',
                            animation: 'shake 0.5s ease-in-out',
                            '@keyframes shake': {
                                '0%, 100%': { transform: 'translateX(0)' },
                                '20%, 60%': { transform: 'translateX(-5px)' },
                                '40%, 80%': { transform: 'translateX(5px)' },
                            },
                        }}
                    >
                        <Typography color="danger" level="body-sm">
                            {error}
                        </Typography>
                    </Box>
                )}

                <form onSubmit={handleLogin}>
                    <FormControl sx={{ mb: 2 }}>
                        <FormLabel sx={{
                            color: 'primary.plainColor',
                            fontWeight: 'lg',
                        }}>
                            Username
                        </FormLabel>
                        <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            startDecorator={<PersonIcon />}
                            sx={{
                                '--Input-focusedThickness': '2px',
                                '&:focus-within': {
                                    boxShadow: '0 0 0 3px rgba(var(--joy-palette-primary-mainChannel) / 0.2)',
                                },
                            }}
                        />
                    </FormControl>

                    <FormControl sx={{ mb: 3 }}>
                        <FormLabel sx={{
                            color: 'primary.plainColor',
                            fontWeight: 'lg',
                        }}>
                            Password
                        </FormLabel>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            startDecorator={<LockIcon />}
                            sx={{
                                '--Input-focusedThickness': '2px',
                                '&:focus-within': {
                                    boxShadow: '0 0 0 3px rgba(var(--joy-palette-primary-mainChannel) / 0.2)',
                                },
                            }}
                        />
                    </FormControl>

                    <Button
                        type="submit"
                        fullWidth
                        sx={{
                            background: 'linear-gradient(45deg, var(--joy-palette-primary-500), var(--joy-palette-primary-600))',
                            boxShadow: 'md',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 'lg',
                            },
                        }}
                    >
                        Login
                    </Button>
                </form>
            </Sheet>
        </Modal>
    );
};

export default LoginDialog;
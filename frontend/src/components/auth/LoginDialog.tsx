import React, {useState} from 'react';
import { useNavigate } from 'react-router';
import { Modal, Sheet, Typography, FormControl, FormLabel, Input, Button } from '@mui/joy';
import {loginUser} from '../../api/Auth';
import axios, {AxiosError} from "axios";
import {ErrorResponse} from "../../types/ErrorResponse.tsx";
import {decodeToken, isTokenExpired} from "../../utils/AuthUtils.tsx";

interface LoginDialogProps
{
    open: boolean;
    onClose: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({open, onClose}) =>
{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError(''); // Clear error state
        try {
            const token = await loginUser(username, password); // Fetch JWT token from API

            // Decode the token and validate it before using
            const decodedToken = decodeToken(token);
            if (!decodedToken) throw new Error('Failed to decode the authentication token.');
            console.log('decodedToken', decodedToken);
            // Optionally, check if the token has already expired
            if (isTokenExpired(token)) throw new Error('The authentication token is already expired.');

            // If all checks pass, proceed with storing the token and redirect
            localStorage.setItem('token', token.trim());      // Save JWT in local storage
            console.log('username', decodedToken.sub);
            localStorage.setItem('username', decodedToken.sub); // Save username from token
            navigate('/dashboard');                          // Redirect to dashboard
            onClose();
        } catch (err) {
            // Handle different error types
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<ErrorResponse>;
                const errorMessage = axiosError.response?.data?.message || 'Login failed. Please try again.';
                setError(errorMessage);
            } else {
                setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
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
                    p: 3,
                    borderRadius: 'md',
                    boxShadow: 'lg',
                }}
            >
                <Typography level="h4" component="h1" sx={{ mb: 2 }}>
                    Welcome Back
                </Typography>

                {error && (
                    <Typography
                        color="danger"
                        level="body-sm"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Typography>
                )}

                <form onSubmit={handleLogin}>
                    <FormControl sx={{ mb: 2 }}>
                        <FormLabel>Username</FormLabel>
                        <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </FormControl>

                    <FormControl sx={{ mb: 2 }}>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </FormControl>

                    <Button
                        type="submit"
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        Login
                    </Button>
                </form>
            </Sheet>
        </Modal>
    );
};

export default LoginDialog;

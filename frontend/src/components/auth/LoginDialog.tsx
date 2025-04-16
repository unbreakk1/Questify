import React, {useState} from 'react';
import { useNavigate } from 'react-router';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Typography,
} from '@mui/material';
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
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Login</DialogTitle>
            <DialogContent>
                {error && <Typography color="error">{error}</Typography>}
                <TextField
                    autoFocus
                    margin="dense"
                    label="Username"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleLogin} variant="contained" color="primary">
                    Login
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LoginDialog;
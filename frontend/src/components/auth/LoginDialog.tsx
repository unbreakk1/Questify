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

    const handleLogin = async () =>
    {
        setError(''); // Clear error state
        try
        {
            const token = await loginUser(username, password); // Call loginUser from Auth.tsx
            localStorage.setItem('token', token); // Save JWT in localStorage
            navigate('/dashboard'); // Redirect to dashboard on success
            onClose();

        }
        catch (err)
        {
            // Check if the error is an AxiosError
            if (axios.isAxiosError(err))
            {
                const axiosError = err as AxiosError<ErrorResponse>;

                // Extract message from AxiosError<ErrorResponse>
                const errorMessage = axiosError.response?.data?.message || 'Login failed. Please try again.';
                setError(errorMessage); // Set the error message
            } else
            {
                // Handle non-Axios errors
                setError('An unexpected error occurred. Please try again.');
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
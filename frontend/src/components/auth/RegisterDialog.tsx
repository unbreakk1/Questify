import React, {useState} from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Typography,
} from '@mui/material';
import {registerUser} from '../../api/Auth';
import axios, {AxiosError} from "axios";
import {ErrorResponse} from "../../types/ErrorResponse.tsx";

interface RegisterDialogProps
{
    open: boolean;
    onClose: () => void;
}

const RegisterDialog: React.FC<RegisterDialogProps> = ({open, onClose}) =>
{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async () =>
    {
        setError('');
        setSuccess('');
        try
        {
            const message = await registerUser(username, password);
            setSuccess(message);
            onClose();
        }
        catch (err)
        {
            // Check if the error is an AxiosError
            if (axios.isAxiosError(err))
            {
                const axiosError = err as AxiosError<ErrorResponse>;

                // Extract message from AxiosError<ErrorResponse>
                const errorMessage = axiosError.response?.data?.message || 'Registration failed. Please try again.';
                setError(errorMessage);
            }
            else
            {
                // Handle non-Axios errors
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Register</DialogTitle>
            <DialogContent>
                {error && <Typography color="error">{error}</Typography>}
                {success && <Typography color="success.main">{success}</Typography>}
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
                <Button onClick={handleRegister} variant="contained" color="primary">
                    Register
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RegisterDialog;
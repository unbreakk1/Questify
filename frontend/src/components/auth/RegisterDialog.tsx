import React, {useState} from 'react';
import { Modal, Sheet, Typography, FormControl, FormLabel, Input, Button, Stack } from '@mui/joy';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Real-time validation errors or statuses
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateUsername = (value: string) =>
    {
        if (!value.trim()) return 'Username is required.';
        if (value.trim().length < 3) return 'Username must be at least 3 characters.';
        return ''; // No error
    };

    const validateEmail = (value: string) =>
    {
        if (!value.trim()) return 'Email is required.';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email format.';
        return ''; // No error
    };

    const validatePassword = (value: string) =>
    {
        if (!value.trim()) return 'Password is required.';
        if (value.trim().length < 6) return 'Password must be at least 6 characters.';
        return ''; // No error
    };

    const handleUsernameChange = (value: string) =>
    {
        setUsername(value);
        const error = validateUsername(value);
        if (error) {
            setUsernameError(error);
        } else {
            checkUsernameAvailability(value).then((isAvailable) => {
                setUsernameError(isAvailable ? '' : 'Username is already taken.');
            });
        }

    };

    const handleEmailChange = async (value: string) =>
    {
        setEmail(value);
        const error = validateEmail(value);
        if (error) {
            setEmailError(error);
        } else {
            const isAvailable = await checkEmailAvailability(value); // Call the backend
            setEmailError(isAvailable ? '' : 'Email is already in use.');
        }
    };

    const handlePasswordChange = (value: string) =>
    {
        setPassword(value);
        setPasswordError(validatePassword(value)); // Validate while typing
    };

    // Check duplicate username availability
    const checkUsernameAvailability = async (username: string): Promise<boolean> =>
    {
        try
        {
            const response = await axios.get(`/auth/check-username`, {params: {username}});
            return response.data; // Backend will return true or false
        }
        catch
        {
            return false; // If error, assume unavailable
        }
    };

// Check duplicate email availability
    const checkEmailAvailability = async (email: string): Promise<boolean> =>
    {
        try
        {
            const response = await axios.get(`/auth/check-email`, {params: {email}});
            return response.data; // Backend will return true or false
        }
        catch
        {
            return false; // If error, assume unavailable
        }
    };


    const handleRegister = async () =>
    {
        setError('');
        setSuccessMessage('');

        // Final validation before submission
        const usernameValidation = validateUsername(username);
        const emailValidation = validateEmail(email);
        const passwordValidation = validatePassword(password);

        if (usernameValidation || emailValidation || passwordValidation)
        {
            setUsernameError(usernameValidation);
            setEmailError(emailValidation);
            setPasswordError(passwordValidation);
            return; // Stop submission if there's any validation error
        }

        try
        {
            const message = await registerUser(username, email, password);
            setSuccessMessage(message);
            onClose();
        }
        catch (err)
        {
            if (axios.isAxiosError(err))
            {
                const axiosError = err as AxiosError<ErrorResponse>;
                const errorMessage = axiosError.response?.data?.message ?? 'Registration failed. Please try again.';
                setError(errorMessage);
            } else
            {
                setError('An unexpected error occurred.');
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
                    Create Account
                </Typography>

                {error && (
                    <Typography color="danger" level="body-sm" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                {successMessage && (
                    <Typography color="success" level="body-sm" sx={{ mb: 2 }}>
                        {successMessage}
                    </Typography>
                )}

                <form onSubmit={handleRegister}>
                    <Stack spacing={2}>
                        <FormControl error={!!usernameError}>
                            <FormLabel>Username</FormLabel>
                            <Input
                                value={username}
                                onChange={(e) => handleUsernameChange(e.target.value)}
                                required
                                endDecorator={
                                    username && (
                                        usernameError ?
                                            <CancelRoundedIcon color="error" /> :
                                            <CheckCircleRoundedIcon color="success" />
                                    )
                                }
                            />
                            {usernameError && (
                                <Typography level="body-xs" color="danger">
                                    {usernameError}
                                </Typography>
                            )}
                        </FormControl>

                        <FormControl error={!!emailError}>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => handleEmailChange(e.target.value)}
                                required
                                endDecorator={
                                    email && (
                                        emailError ?
                                            <CancelRoundedIcon color="error" /> :
                                            <CheckCircleRoundedIcon color="success" />
                                    )
                                }
                            />
                            {emailError && (
                                <Typography level="body-xs" color="danger">
                                    {emailError}
                                </Typography>
                            )}
                        </FormControl>

                        <FormControl error={!!passwordError}>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => handlePasswordChange(e.target.value)}
                                required
                                endDecorator={
                                    password && (
                                        passwordError ?
                                            <CancelRoundedIcon color="error" /> :
                                            <CheckCircleRoundedIcon color="success" />
                                    )
                                }
                            />
                            {passwordError && (
                                <Typography level="body-xs" color="danger">
                                    {passwordError}
                                </Typography>
                            )}
                        </FormControl>

                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button
                                variant="plain"
                                color="neutral"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                Register
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Sheet>
        </Modal>
    );
};

export default RegisterDialog;

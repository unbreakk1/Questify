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
import CloseIcon from '@mui/icons-material/Close'; // Red X icon for invalid fields
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Green check for valid fields
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
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Register</DialogTitle>
            <DialogContent>
                {error && <Typography color="error" sx={{mb: 2}}>{error}</Typography>}
                {successMessage && <Typography color="success" sx={{mb: 2}}>{successMessage}</Typography>}

                {/* Username Field */}
                <div style={{position: 'relative'}}>
                    <TextField
                        margin="dense"
                        label="Username"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        error={!!usernameError}
                        helperText={usernameError || ' '}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: usernameError ? 'red' : username ? 'green' : 'inherit',
                                },
                            },
                        }}
                    />
                    {username && !usernameError && (
                        <CheckCircleIcon
                            fontSize="small"
                            style={{
                                color: 'green',
                                position: 'absolute',
                                top: '50%',
                                right: '-25px',
                                transform: 'translateY(-50%)',
                            }}
                        />
                    )}
                    {usernameError && (
                        <CloseIcon
                            fontSize="small"
                            style={{
                                color: 'red',
                                position: 'absolute',
                                top: '50%',
                                right: '-25px',
                                transform: 'translateY(-50%)',
                            }}
                        />
                    )}
                </div>

                {/* Email Field */}
                <div style={{position: 'relative'}}>
                    <TextField
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        error={!!emailError}
                        helperText={emailError || ' '}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: emailError ? 'red' : email ? 'green' : 'inherit',
                                },
                            },
                        }}
                    />
                    {email && !emailError && (
                        <CheckCircleIcon
                            fontSize="small"
                            style={{
                                color: 'green',
                                position: 'absolute',
                                top: '50%',
                                right: '-25px',
                                transform: 'translateY(-50%)',
                            }}
                        />
                    )}
                    {emailError && (
                        <CloseIcon
                            fontSize="small"
                            style={{
                                color: 'red',
                                position: 'absolute',
                                top: '50%',
                                right: '-25px',
                                transform: 'translateY(-50%)',
                            }}
                        />
                    )}
                </div>

                {/* Password Field */}
                <div style={{position: 'relative'}}>
                    <TextField
                        margin="dense"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        error={!!passwordError}
                        helperText={passwordError || ' '}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: passwordError ? 'red' : password ? 'green' : 'inherit',
                                },
                            },
                        }}
                    />
                    {password && !passwordError && (
                        <CheckCircleIcon
                            fontSize="small"
                            style={{
                                color: 'green',
                                position: 'absolute',
                                top: '50%',
                                right: '-25px',
                                transform: 'translateY(-50%)',
                            }}
                        />
                    )}
                    {passwordError && (
                        <CloseIcon
                            fontSize="small"
                            style={{
                                color: 'red',
                                position: 'absolute',
                                top: '50%',
                                right: '-25px',
                                transform: 'translateY(-50%)',
                            }}
                        />
                    )}
                </div>
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
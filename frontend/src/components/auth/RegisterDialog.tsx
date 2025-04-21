import React, {useState} from 'react';
import {
    Modal,
    Sheet,
    Typography,
    FormControl,
    FormLabel,
    Input,
    Button,
    Stack,
    Box
} from '@mui/joy';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { registerUser } from '../../api/Auth';
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "../../types/ErrorResponse.tsx";


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
                        Join the Adventure
                    </Typography>
                    <Typography level="body-md" color="neutral">
                        Create your account to start your journey
                    </Typography>
                </Box>

                {(error || successMessage) && (
                    <Box
                        sx={{
                            p: 1.5,
                            mb: 2,
                            borderRadius: 'md',
                            background: error
                                ? 'rgba(var(--joy-palette-danger-mainChannel) / 0.1)'
                                : 'rgba(var(--joy-palette-success-mainChannel) / 0.1)',
                            border: '1px solid',
                            borderColor: error ? 'danger.outlinedBorder' : 'success.outlinedBorder',
                            animation: error ? 'shake 0.5s ease-in-out' : 'slideIn 0.5s ease-out',
                            '@keyframes shake': {
                                '0%, 100%': { transform: 'translateX(0)' },
                                '20%, 60%': { transform: 'translateX(-5px)' },
                                '40%, 80%': { transform: 'translateX(5px)' },
                            },
                        }}
                    >
                        <Typography
                            color={error ? "danger" : "success"}
                            level="body-sm"
                        >
                            {error || successMessage}
                        </Typography>
                    </Box>
                )}

                <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                    <Stack spacing={2}>
                        <FormControl error={!!usernameError}>
                            <FormLabel sx={{
                                color: 'primary.plainColor',
                                fontWeight: 'lg',
                            }}>
                                Username
                            </FormLabel>
                            <Input
                                value={username}
                                onChange={(e) => handleUsernameChange(e.target.value)}
                                required
                                startDecorator={<PersonIcon />}
                                endDecorator={
                                    username && (
                                        usernameError ?
                                            <CancelRoundedIcon color="error" /> :
                                            <CheckCircleRoundedIcon color="success" />
                                    )
                                }
                                sx={{
                                    '--Input-focusedThickness': '2px',
                                    '&:focus-within': {
                                        boxShadow: '0 0 0 3px rgba(var(--joy-palette-primary-mainChannel) / 0.2)',
                                    },
                                }}
                            />
                            {usernameError && (
                                <Typography
                                    level="body-xs"
                                    color="danger"
                                    sx={{
                                        mt: 0.5,
                                        animation: 'slideDown 0.2s ease-out',
                                        '@keyframes slideDown': {
                                            from: { opacity: 0, transform: 'translateY(-10px)' },
                                            to: { opacity: 1, transform: 'translateY(0)' },
                                        },
                                    }}
                                >
                                    {usernameError}
                                </Typography>
                            )}
                        </FormControl>

                        <FormControl error={!!emailError}>
                            <FormLabel sx={{
                                color: 'primary.plainColor',
                                fontWeight: 'lg',
                            }}>
                                Email
                            </FormLabel>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => handleEmailChange(e.target.value)}
                                required
                                startDecorator={<EmailIcon />}
                                endDecorator={
                                    email && (
                                        emailError ?
                                            <CancelRoundedIcon color="error" /> :
                                            <CheckCircleRoundedIcon color="success" />
                                    )
                                }
                                sx={{
                                    '--Input-focusedThickness': '2px',
                                    '&:focus-within': {
                                        boxShadow: '0 0 0 3px rgba(var(--joy-palette-primary-mainChannel) / 0.2)',
                                    },
                                }}
                            />
                            {emailError && (
                                <Typography
                                    level="body-xs"
                                    color="danger"
                                    sx={{
                                        mt: 0.5,
                                        animation: 'slideDown 0.2s ease-out',
                                    }}
                                >
                                    {emailError}
                                </Typography>
                            )}
                        </FormControl>

                        <FormControl error={!!passwordError}>
                            <FormLabel sx={{
                                color: 'primary.plainColor',
                                fontWeight: 'lg',
                            }}>
                                Password
                            </FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => handlePasswordChange(e.target.value)}
                                required
                                startDecorator={<LockIcon />}
                                endDecorator={
                                    password && (
                                        passwordError ?
                                            <CancelRoundedIcon color="error" /> :
                                            <CheckCircleRoundedIcon color="success" />
                                    )
                                }
                                sx={{
                                    '--Input-focusedThickness': '2px',
                                    '&:focus-within': {
                                        boxShadow: '0 0 0 3px rgba(var(--joy-palette-primary-mainChannel) / 0.2)',
                                    },
                                }}
                            />
                            {passwordError && (
                                <Typography
                                    level="body-xs"
                                    color="danger"
                                    sx={{
                                        mt: 0.5,
                                        animation: 'slideDown 0.2s ease-out',
                                    }}
                                >
                                    {passwordError}
                                </Typography>
                            )}
                        </FormControl>

                        <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                            sx={{ mt: 1 }}
                        >
                            <Button
                                variant="soft"
                                color="neutral"
                                onClick={onClose}
                                sx={{
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
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


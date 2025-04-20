import { extendTheme } from '@mui/joy/styles';

const theme = extendTheme({
    colorSchemes: {
        dark: {
            palette: {
                mode: 'dark',
                primary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
                background: {
                    body: '#0a0a0a',
                    surface: '#121212',
                    level1: '#1a1a1a',
                    level2: '#2c2c2c',
                    level3: '#333333',
                    tooltip: '#121212',
                },
                neutral: {
                    plainColor: '#fafafa',
                    plainHoverBg: 'rgba(255, 255, 255, 0.1)',
                    plainActiveBg: 'rgba(255, 255, 255, 0.2)',
                    plainDisabledColor: 'rgba(255, 255, 255, 0.5)',
                    outlinedBg: 'rgba(255, 255, 255, 0.05)',
                    outlinedBorder: 'rgba(255, 255, 255, 0.2)',
                    outlinedHoverBg: 'rgba(255, 255, 255, 0.1)',
                    outlinedHoverBorder: 'rgba(255, 255, 255, 0.3)',
                    outlinedActiveBg: 'rgba(255, 255, 255, 0.2)',
                },
                common: {
                    white: '#ffffff',
                    black: '#000000',
                },
                text: {
                    primary: '#fafafa',
                    secondary: '#a3a3a3',
                    tertiary: '#737373',
                },
                divider: 'rgba(255, 255, 255, 0.1)',
            }
        },
        light: {
            palette: {
                mode: 'dark', // Forces dark mode even in light scheme
                background: {
                    body: '#0a0a0a',
                    surface: '#121212',
                    level1: '#1a1a1a',
                    level2: '#2c2c2c',
                    level3: '#333333',
                    tooltip: '#121212',
                },
                text: {
                    primary: '#fafafa',
                    secondary: '#a3a3a3',
                    tertiary: '#737373',
                }
            }
        }
    },
    fontFamily: {
        body: 'Poppins, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        display: 'Poppins, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    },
    components: {
        JoyButton: {
            styleOverrides: {
                root: () => ({
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 'md',
                    },
                }),
            },
        },
        JoyCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1a1a1a',
                    borderColor: '#262626',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                    },
                },
            },
        },
    },
});

export default theme;
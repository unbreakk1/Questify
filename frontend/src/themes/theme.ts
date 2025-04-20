import {extendTheme} from '@mui/joy/styles';

const theme = extendTheme({
    colorSchemes: {
        dark: {
            palette: {
                primary: {
                    50: '#e3f2fd',
                    100: '#bbdefb',
                    200: '#90caf9',
                    300: '#64b5f6',
                    400: '#42a5f5',
                    500: '#2196f3',
                    600: '#1e88e5',
                    700: '#1976d2',
                    800: '#1565c0',
                    900: '#0d47a1',
                },
                neutral: {
                    900: '#121212',
                    800: '#1e1e1e',
                    700: '#222',
                    600: '#272727',
                    500: '#2c2c2c',
                    400: '#373737',
                    300: '#434343',
                    200: '#595959',
                    100: '#7f7f7f',
                    50: '#a6a6a6',
                },
            },
        },
        light: {
            palette: {
                primary: {
                    50: '#e3f2fd',
                    100: '#bbdefb',
                    200: '#90caf9',
                    300: '#64b5f6',
                    400: '#42a5f5',
                    500: '#2196f3',
                    600: '#1e88e5',
                    700: '#1976d2',
                    800: '#1565c0',
                    900: '#0d47a1',
                },
            },
        },
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
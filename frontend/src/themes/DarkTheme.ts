// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#9c27b0', // Epic purple accents
        },
        secondary: {
            main: '#f44336', // Fiery red
        },
        background: {
            default: '#121212', // Dark background
            paper: '#1e1e1e', // Card background
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontSize: '2.5rem', fontWeight: 700 },
        h2: { fontSize: '2rem', fontWeight: 700 },
        h3: { fontSize: '1.75rem', fontWeight: 600 },
        body1: { fontSize: '1rem' },
    },
});

export default theme;
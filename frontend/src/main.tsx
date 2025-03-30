import { ThemeProvider, CssBaseline } from '@mui/material';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import theme from './themes/DarkTheme.ts';

createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
    </ThemeProvider>
);
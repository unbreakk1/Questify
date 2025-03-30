import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    CssBaseline,
    Toolbar,
    Typography,
    LinearProgress,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { getAllBosses } from '../../api/BossesAPI';

// Define the structure of a Boss object
interface Boss {
    id: string;
    name: string;
    currentHealth: number;
    maxHealth: number;
    levelRequirement: number;
    defeated: boolean;
}

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
    },
});

const BossesPage: React.FC = () => {
    const [bosses, setBosses] = useState<Boss[]>([]);
    const [currentUser, setCurrentUser] = useState<string>(''); // Hold username
    const navigate = useNavigate();

    // Fetch the list of bosses when the component mounts
    useEffect(() => {
        const fetchBosses = async () => {
            try {
                const data = await getAllBosses();
                setBosses(Array.isArray(data) ? data : [data]); // Ensure data is an array
            } catch (error) {
                console.error('Failed to fetch bosses:', error);
            }
        };

        // Simulate fetching the current user's username
        const fetchCurrentUser = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/'); // Redirect to landing page if not logged in
            } else {
                // Assuming username is stored elsewhere or parsed from the token
                setCurrentUser('QuestHero'); // Replace with actual logic
            }
        };

        fetchBosses();
        fetchCurrentUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear JWT token
        navigate('/'); // Redirect to landing page
    };

    // Get the first active boss or fallback to null
    const activeBoss = bosses.find((boss) => !boss.defeated) || null;

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />

            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Questify - Bosses
                    </Typography>
                    <Typography variant="body1" sx={{ marginRight: 2 }}>
                        Welcome, {currentUser}
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Box
                sx={{
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 'calc(100vh - 64px)', // Adjust to include Header height
                    backgroundColor: (theme) => theme.palette.background.paper,
                }}
            >
                {activeBoss ? (
                    <Card
                        sx={{
                            width: '50%',
                            textAlign: 'center',
                            padding: 3,
                            borderRadius: 2,
                            boxShadow: 3,
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                {activeBoss.name}
                            </Typography>
                            <Typography color="text.secondary" gutterBottom>
                                Level Requirement: {activeBoss.levelRequirement}
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={(activeBoss.currentHealth / activeBoss.maxHealth) * 100}
                                sx={{ marginY: 2 }}
                            />
                            <Typography>
                                {activeBoss.currentHealth}/{activeBoss.maxHealth} HP
                            </Typography>
                            <Typography variant="body2" color={activeBoss.defeated ? 'error' : 'success.main'}>
                                {activeBoss.defeated ? 'Defeated' : 'Alive'}
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Typography variant="h6" color="text.primary">
                        No active bosses at the moment. All bosses are defeated or unavailable.
                    </Typography>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default BossesPage;
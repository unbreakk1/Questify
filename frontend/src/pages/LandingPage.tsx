import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    CssBaseline,
    Box,
    Container,
    Grid,
    Paper,
    Card,
    CardContent,
    CardActions,
    CardMedia,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import LoginDialog from '../components/auth/LoginDialog';
import RegisterDialog from '../components/auth/RegisterDialog';
 // Optionally add custom fonts

// Dark Theme
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#90caf9' },
        secondary: { main: '#f48fb1' },
        background: { default: '#121212', paper: '#1e1e1e' },
        text: { primary: '#fff', secondary: '#aaa' },
    },
    typography: {
        fontFamily: 'Poppins, Arial, sans-serif',
        h1: { fontWeight: 700, fontSize: '3rem' },
        h2: { fontWeight: 700, fontSize: '2.5rem' },
    },
});

// Custom Styled Paper for Hero Section
const HeroPaper = styled(Paper)(({ theme }) => ({
    background: 'url(https://via.placeholder.com/1920x1080) no-repeat center center',
    backgroundSize: 'cover',
    height: '70vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(4),
}));

const LandingPage: React.FC = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            {/* AppBar */}
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Questify
                    </Typography>
                    <Button color="inherit" onClick={() => setIsLoginOpen(true)}>
                        Login
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => setIsRegisterOpen(true)}>
                        Join Now
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Sidebar Drawer */}
            <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
                <Box sx={{ width: 250, backgroundColor: 'background.default', height: '100%' }}>
                    <Typography variant="h5" sx={{ p: 2 }}>
                        Navigation
                    </Typography>
                    <Divider />
                    <List>
                        {['Home', 'Features', 'Pricing', 'About'].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            {/* Hero Section */}
            <Box sx={{ mt: '64px' }}>
                <HeroPaper elevation={3}>
                    <Box textAlign="center">
                        <Typography variant="h1" gutterBottom>
                            Welcome to Questify
                        </Typography>
                        <Typography variant="h5" sx={{ mb: 4 }}>
                            Turn your life into an epic adventure
                        </Typography>
                        <Button variant="contained" color="primary" size="large">
                            Get Started
                        </Button>
                    </Box>
                </HeroPaper>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg">
                <Typography variant="h2" textAlign="center" gutterBottom>
                    Why Choose Questify?
                </Typography>
                <Grid container spacing={4}>
                    {[
                        {
                            title: 'Gamify Your Life',
                            description: 'Turn daily tasks into exciting quests.',
                            image: 'https://via.placeholder.com/300',
                        },
                        {
                            title: 'Level Up',
                            description: 'Earn rewards and level up as you complete tasks!',
                            image: 'https://via.placeholder.com/300',
                        },
                        {
                            title: 'Collaborative Adventures',
                            description: 'Join others for group challenges.',
                            image: 'https://via.placeholder.com/300',
                        },
                    ].map((feature, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card elevation={4}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={feature.image}
                                    alt={feature.title}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary">
                                        Learn More
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: 4,
                    backgroundColor: darkTheme.palette.background.paper,
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="body1" align="center">
                        Questify © {new Date().getFullYear()}
                    </Typography>
                </Container>
            </Box>

            {/* Dialogs */}
            <LoginDialog open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            <RegisterDialog open={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
        </ThemeProvider>
    );
};

export default LandingPage;
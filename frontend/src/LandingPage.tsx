import React, { useState } from "react";
import {
    AppBar,
    Box,
    Button,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Toolbar,
    Typography,
    ThemeProvider,
    createTheme,
} from "@mui/material";

// Create a dark theme
const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#90caf9",
        },
        secondary: {
            main: "#f48fb1",
        },
        background: {
            default: "#121212",
            paper: "#424242",
        },
    },
});

const LandingPage: React.FC = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    // Functions to handle dialog state
    const handleLoginOpen = () => setIsLoginOpen(true);
    const handleLoginClose = () => setIsLoginOpen(false);

    const handleRegisterOpen = () => setIsRegisterOpen(true);
    const handleRegisterClose = () => setIsRegisterOpen(false);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            {/* AppBar that spans the full width */}
            <AppBar position="static" sx={{ width: "100%" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Questify
                    </Typography>
                    <Button color="inherit" onClick={handleLoginOpen}>
                        Login
                    </Button>
                    <Button color="inherit" onClick={handleRegisterOpen}>
                        Register
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Main Content Area */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center", // Vertical centering
                    alignItems: "center", // Horizontal centering
                    width: "100vw", // Full width of the viewport
                    height: "calc(100vh - 64px)", // Full height subtracting AppBar height
                    textAlign: "center",
                }}
            >
                <Typography variant="h2" gutterBottom>
                    Welcome to Questify
                </Typography>
                <Typography variant="h5" color="text.secondary" paragraph>
                    Your go-to platform to master quests and challenges!
                </Typography>
                <Box mt={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            mx: 2,
                            padding: "1rem 3rem", // Buttons use more space to feel larger
                            fontSize: "1.2rem",
                        }}
                        onClick={handleLoginOpen}
                    >
                        Login
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{
                            mx: 2,
                            padding: "1rem 3rem",
                            fontSize: "1.2rem",
                        }}
                        onClick={handleRegisterOpen}
                    >
                        Register
                    </Button>
                </Box>
            </Box>

            {/* Login Dialog */}
            <Dialog open={isLoginOpen} onClose={handleLoginClose}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        margin="dense"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLoginClose} color="secondary">
                        Cancel
                    </Button>
                    <Button color="primary">Login</Button>
                </DialogActions>
            </Dialog>

            {/* Register Dialog */}
            <Dialog open={isRegisterOpen} onClose={handleRegisterClose}>
                <DialogTitle>Register</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Full Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        margin="dense"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        margin="dense"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRegisterClose} color="secondary">
                        Cancel
                    </Button>
                    <Button color="primary">Register</Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
};

export default LandingPage;
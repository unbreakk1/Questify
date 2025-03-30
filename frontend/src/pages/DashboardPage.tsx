import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Button,
    AppBar,
    Toolbar,
    Checkbox,
    FormControlLabel,
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    Slide,
    Grow,
} from '@mui/material';
import { getAllTasks, createTask } from '../api/TasksAPI';
import { getAllBosses } from '../api/BossesAPI';
import { useNavigate } from 'react-router';
import axios from 'axios';

// Task interface
interface Task {
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
}

// Boss interface
interface Boss {
    id: string;
    name: string;
    currentHealth: number;
    maxHealth: number;
    defeated: boolean;
}

const DashboardPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]); // Task list
    const [currentBoss, setCurrentBoss] = useState<Boss | null>(null); // Active boss
    const [animationsLoaded, setAnimationsLoaded] = useState<boolean>(false); // Animation loaded state
    const [username] = useState<string>('Hero'); // Default username
    const [openDialog, setOpenDialog] = useState(false); // Dialog state
    const [newTask, setNewTask] = useState({ title: '', dueDate: '' }); // New task data
    const [completedTask, setCompletedTask] = useState<string | null>(null); // Task being animated
    const navigate = useNavigate();

    // Fetch tasks and boss data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const tasksData = await getAllTasks();
                setTasks(tasksData);

                const bossesData = await getAllBosses();
                const activeBoss = bossesData.find((boss) => !boss.defeated);
                setCurrentBoss(activeBoss || null);
            } catch (error) {
                console.error('Error fetching data:', error);
            }

            setAnimationsLoaded(true); // Enable animations on load
        };

        fetchData();
    }, []);

    // Function to handle adding a new task
    const handleAddTask = async () => {
        try {
            const addedTask = await createTask(newTask); // Add new task via API
            setTasks([...tasks, addedTask]); // Update task list locally
            setOpenDialog(false); // Close dialog
            setNewTask({ title: '', dueDate: '' }); // Reset input
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    // Function to handle task completion and animation
    const handleTaskCompletion = async (taskId: string, completed: boolean) => {
        try {
            console.log(`Completing task: ${taskId}, completed: ${completed}`);

            // Update task as completed in the backend
            await axios.put(
                `http://localhost:8080/api/tasks/${taskId}/complete`,
                { completed },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );

            // Handle task animation and removal
            if (completed) {
                setCompletedTask(taskId); // Trigger animation
                setTimeout(() => {
                    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId)); // Remove task
                    setCompletedTask(null); // Reset animation state
                }, 500); // Match animation duration
            }

            // Trigger boss health update
            if (completed && currentBoss) {
                const damageResponse = await axios.put(
                    `http://localhost:8080/api/boss/attack`,
                    { damage: 10 }, // Arbitrary damage value
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    }
                );

                // Update boss state
                setCurrentBoss((boss) =>
                    boss
                        ? {
                            ...boss,
                            currentHealth: damageResponse.data.currentHealth,
                            defeated: damageResponse.data.defeated,
                        }
                        : null
                );
            }
        } catch (error) {
            console.error('Error while completing task or damaging boss:', error);
        }
    };

    // Handle user logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    // Main render
    return (
        <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
            {/* AppBar */}
            <Grow in={animationsLoaded}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Questify
                        </Typography>
                        <Typography variant="body1" sx={{ marginRight: 2 }}>
                            Welcome, {username}
                        </Typography>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>
            </Grow>

            {/* Dashboard Title */}
            <Grow in={animationsLoaded}>
                <Box sx={{ py: 2, textAlign: 'center' }}>
                    <Typography variant="h3" color="primary">
                        Your Epic Quests
                    </Typography>
                </Box>
            </Grow>

            {/* Main Content */}
            <Grid container spacing={3} sx={{ padding: 2, flexGrow: 1 }}>
                {/* Tasks Section */}
                <Grid xs={12} md={6}>
                    <Slide in={animationsLoaded} direction="left">
                        <Card>
                            <CardContent>
                                <Typography variant="h4">Tasks</Typography>
                                {tasks.map((task) => (
                                    <Slide
                                        key={task.id}
                                        direction="left"
                                        in={!(completedTask === task.id)} // Animate out if task is being removed
                                        timeout={{ enter: 300, exit: 500 }}
                                        unmountOnExit
                                    >
                                        <Box display="flex" alignItems="center" my={2}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={task.completed}
                                                        onChange={(e) =>
                                                            handleTaskCompletion(task.id, e.target.checked)
                                                        }
                                                        color="primary"
                                                    />
                                                }
                                                label={task.title}
                                            />
                                        </Box>
                                    </Slide>
                                ))}
                                <Button
                                    variant="contained"
                                    onClick={() => setOpenDialog(true)}
                                    sx={{ marginTop: 2 }}
                                >
                                    Add Task
                                </Button>
                            </CardContent>
                        </Card>
                    </Slide>
                </Grid>

                {/* Boss Section */}
                <Grid xs={12} md={6}>
                    <Slide in={animationsLoaded} direction="right">
                        <Card>
                            <CardContent>
                                <Typography variant="h4">Active Boss</Typography>
                                {currentBoss ? (
                                    <Box>
                                        <Typography variant="h5">{currentBoss.name}</Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(currentBoss.currentHealth / currentBoss.maxHealth) * 100}
                                            sx={{ marginY: 2 }}
                                        />
                                        <Typography>
                                            HP: {currentBoss.currentHealth}/{currentBoss.maxHealth}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Typography>No active boss.</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Slide>
                </Grid>
            </Grid>

            {/* Add Task Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Task Title"
                        fullWidth
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Due Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddTask} variant="contained">
                        Add Task
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DashboardPage;
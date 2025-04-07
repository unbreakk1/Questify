import React, {useState, useEffect} from 'react';
import
{
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
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    Slide,
    Grow,
    Fab,
} from '@mui/material';
import {getAllTasks, createTask, deleteTask} from '../api/TasksAPI';
import {getAllBosses} from '../api/BossesAPI';
import {useNavigate} from 'react-router';
import axios from 'axios';
import {completeHabit, createHabit, deleteHabit, getAllHabits, Habit, resetHabit} from "../api/HabitsAPI.tsx";
import HabitCard from "../components/habits/HabitCard.tsx";
import AddIcon from '@mui/icons-material/Add';
import DeleteButton from '@mui/icons-material/Delete';
// Task interface
interface Task
{
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
    recentlyCompleted?: boolean; // Used to trigger animation
}

// Boss interface
interface Boss
{
    id: string;
    name: string;
    currentHealth: number;
    maxHealth: number;
    defeated: boolean;
}

const DashboardPage: React.FC = () =>
{
    const [tasks, setTasks] = useState<Task[]>([]); // Task list
    const [currentBoss, setCurrentBoss] = useState<Boss | null>(null); // Active boss
    const [animationsLoaded, setAnimationsLoaded] = useState<boolean>(false); // Animation loaded state
    const [username] = useState<string>('Hero'); // Default username
    const [openHabitDialog, setOpenHabitDialog] = useState(false); // For habit dialog
    const [openTaskDialog, setOpenTaskDialog] = useState(false);   // For task dialog
    const [newTask, setNewTask] = useState({title: '', dueDate: ''}); // New task data
    const [habits, setHabits] = useState<Habit[]>([]); // Habit list
    const [newHabit, setNewHabit] = useState({title: '', frequency: '', difficulty: ''});
    const navigate = useNavigate();
    const DAMAGE_PER_COMPLETION = 10;

    // Fetch tasks and boss data
    useEffect(() =>
    {
        const fetchData = async () =>
        {
            try
            {
                const tasksData = await getAllTasks();
                setTasks(tasksData);

                // Fetch habits
                const habitsData = await getAllHabits();
                console.log('Fetched Habits:', habitsData);

                setHabits(habitsData);

                // Fetch boss data
                const bossesData = await getAllBosses();
                const activeBoss = bossesData.find((boss) => !boss.defeated);
                setCurrentBoss(activeBoss || null);
            } catch (error)
            {
                console.error('Error fetching data:', error);
            }

            setAnimationsLoaded(true); // Enable animations on load
        };

        // Call the initial fetch
        fetchData();

        // Call resetTasks to reset any completed tasks on load
        resetTasks();

        // Set up a daily reset interval
        const resetInterval = setInterval(() =>
        {
            resetTasks();
        }, 86400000); // Every 24 hours

        // Cleanup interval on component unmount
        return () => clearInterval(resetInterval);
    }, []);


    // Function to handle adding a new task
    const resetTasks = () =>
    {
        const today = new Date().toISOString().split('T')[0];
        setTasks((prevTasks) =>
            prevTasks.map((task) => ({
                ...task,
                completed: task.completed && task.dueDate === today ? false : task.completed,
            }))
        );
    };

    const handleAddTask = async () =>
    {
        try
        {
            const addedTask = await createTask(newTask); // Add new task via API
            setTasks([...tasks, addedTask]); // Update task list locally
            setOpenTaskDialog(false); // Close dialog
            setNewTask({title: '', dueDate: ''}); // Reset input
        } catch (error)
        {
            console.error('Error creating task:', error);
        }
    };

    // Function to handle task completion and animation
    const handleTaskCompletion = async (taskId: string, completed: boolean) =>
    {
        try
        {
            console.log(`Completing task: ${taskId}, completed: ${completed}`);

            // Update task as completed in the backend
            await axios.put(
                `http://localhost:8080/api/tasks/${taskId}/complete`,
                {completed},
                {
                    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
                }
            );

            if (completed)
            {
                dealDamageToBoss();

                // Trigger animation by marking the task as recently completed
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.id === taskId ? {...task, recentlyCompleted: true} : task
                    )
                );

                // Wait for animation to finish, then mark the task as completed
                setTimeout(() =>
                {
                    setTasks((prevTasks) =>
                        prevTasks.map((task) =>
                            task.id === taskId
                                ? {...task, completed: true, recentlyCompleted: false}
                                : task
                        )
                    );
                }, 500); // Match the animation duration
            } else
            {
                // Unmark the task if it's undone
                setTasks((prevTasks) =>
                    prevTasks.map((task) => (task.id === taskId ? {...task, completed: false} : task))
                );
            }
        } catch (error)
        {
            console.error(`Failed to complete task with ID ${taskId}:`, error);
        }
    };


    const handleCompleteHabit = async (habitId: string) =>
    {
        try
        {
            const updatedHabit = await completeHabit(habitId); // API call to complete habit
            console.log("Updated Habit:", updatedHabit); // Log response from API

            // Update local state
            setHabits((prevHabits) =>
                prevHabits.map((habit) =>
                    habit.id === habitId ? updatedHabit : habit // Update only the completed habit
                )
            );
            dealDamageToBoss();

        } catch (error)
        {
            console.error("Error completing habit:", error);
        }
    };

    const dealDamageToBoss = () => {
        if (!currentBoss) {
            console.warn('No current boss to deal damage to!');
            return;
        }

        const updatedHealth = currentBoss.currentHealth - DAMAGE_PER_COMPLETION;

        if (updatedHealth <= 0) {
            // Mark the boss as defeated
            setCurrentBoss({ ...currentBoss, currentHealth: 0, defeated: true });
            console.log(`Boss ${currentBoss.name} has been defeated!`);
        } else {
            // Update boss health
            setCurrentBoss({ ...currentBoss, currentHealth: updatedHealth });
        }
    };



    const handleResetHabit = async (habitId: string) =>
    {
        try
        {
            await resetHabit(habitId); // Call the API to reset the habit

            // Refresh the habits list to reflect the reset state
            const updatedHabits = await getAllHabits();
            setHabits(updatedHabits);
        } catch (error)
        {
            console.error(`Failed to reset habit with ID ${habitId}:`, error);
        }
    };

    const handleAddHabit = async () =>
    {
        try
        {
            // Call createHabit API to add the new habit
            const addedHabit = await createHabit(newHabit);

            // Update the habits list with the newly created habit
            setHabits([...habits, addedHabit]);

            // Reset input fields
            setNewHabit({title: '', frequency: '', difficulty: ''});
        } catch (error)
        {
            console.error('Failed to create a new habit:', error);
        }
    };

    const handleDeleteHabit = async (habitId: string) =>
    {
        try
        {
            // Call deleteHabit API to delete the habit from the backend
            await deleteHabit(habitId);

            // Update the state to remove the deleted habit
            setHabits(habits.filter(habit => habit.id !== habitId));
        } catch (error)
        {
            console.error(`Failed to delete habit with ID ${habitId}:`, error);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            // Call the deleteTask API function
            await deleteTask(taskId);
            // Remove the task from the state
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        } catch (error) {
            console.error(`Failed to delete task with ID ${taskId}:`, error);
        }
    };



    // Handle user logout
    const handleLogout = () =>
    {
        localStorage.removeItem('token');
        navigate('/');
    };

    // Main render
    return (
        <Box sx={{height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column'}}>
            {/* AppBar */}
            <Grow in={animationsLoaded}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" sx={{flexGrow: 1}}>
                            Questify
                        </Typography>
                        <Typography variant="body1" sx={{marginRight: 2}}>
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
                <Box sx={{py: 2, textAlign: 'center'}}>
                    <Typography variant="h3" color="primary">
                        HELP I'VE FALLEN AND I CAN'T GET UP!
                    </Typography>
                </Box>
            </Grow>

            {/* Main Content */}
            <Grid container spacing={3} sx={{padding: 2, flexGrow: 1}}>
                {/* Tasks Section */}
                <Box display="flex" flexDirection="row" gap={2} position="relative" justifyContent="space-between">
                    {/* Tasks Section */}
                    <Box flex={1} display="flex" flexDirection="column" gap={2}>
                        <Typography variant="h5">Tasks</Typography>
                        {tasks.map((task) => (
                            <Grow
                                in={!task.recentlyCompleted}
                                timeout={500}
                                mountOnEnter
                                unmountOnExit
                                key={task.id}
                            >
                                <Card
                                    style={{
                                        opacity: task.completed ? 0.5 : 1,
                                        transition: 'transform 0.5s ease',
                                    }}
                                >
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            style={{
                                                textDecoration: task.completed ? 'line-through' : 'none',
                                            }}
                                        >
                                            {task.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Due Date: {task.dueDate}
                                        </Typography>
                                        <Checkbox
                                            checked={task.completed}
                                            onChange={() => handleTaskCompletion(task.id, !task.completed)}
                                            disabled={task.completed}
                                        />
                                        <Typography variant="body2">
                                            {task.completed ? 'Completed' : 'Pending'}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            style={{ marginTop: '10px' }}
                                            onClick={() => handleDeleteTask(task.id)}
                                            startIcon={<DeleteButton />}
                                        >
                                        </Button>

                                    </CardContent>

                                </Card>
                            </Grow>
                        ))}
                    </Box>
                    {/* Floating Action Button */}
                    <Fab
                        color="primary"
                        aria-label="add"
                        onClick={() => setOpenTaskDialog(true)} // Opens Create Task Dialog
                        style={{
                            position: 'absolute',
                            bottom: '16px',
                            right: '111px',
                            zIndex: 1000,
                        }}
                    >
                        <AddIcon />
                    </Fab>


                    {/* Habits Section */}

                    <div>
                        <Typography variant="h6">Habits</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setOpenHabitDialog(true)} // Opens Create Habit Dialog
                            style={{ marginBottom: '16px' }}
                        >
                            Create Habit
                        </Button>
                        {habits.map(habit => (
                            <HabitCard
                                key={habit.id}
                                habit={habit}
                                onComplete={(habitId) => handleCompleteHabit(habitId)}
                                onReset={() => handleResetHabit(habit.id)}
                                onDelete={() => handleDeleteHabit(habit.id)} // Pass the delete handler
                            />
                        ))}
                    </div>
                </Box>
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
                                            sx={{marginY: 2}}
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
            {/* Create Habit Dialog */}
            <Dialog open={openHabitDialog} onClose={() => setOpenHabitDialog(false)}>
                <DialogContent>
                    <TextField
                        label="Habit Title"
                        fullWidth
                        value={newHabit.title}
                        onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                    />
                    <TextField
                        label="Frequency"
                        fullWidth
                        value={newHabit.frequency}
                        onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
                    />
                    <TextField
                        label="Difficulty"
                        fullWidth
                        value={newHabit.difficulty}
                        onChange={(e) => setNewHabit({ ...newHabit, difficulty: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleAddHabit} // Calls Create Habit logic
                        variant="contained"
                        color="primary"
                    >
                        Add Habit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Task Dialog */}
            <Dialog open={openTaskDialog} onClose={() => setOpenTaskDialog(false)}>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Task Title"
                        fullWidth
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        label="Due Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{shrink: true}}
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenTaskDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddTask} variant="contained">
                        Add Task
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DashboardPage;
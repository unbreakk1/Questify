import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Modal,
    Fab,
    AppBar,
    Toolbar,
    Button, CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";


import { getUsernameFromToken, getUserInfo } from "../utils/UserAPI.tsx";
import UserDetailsModal from "../components/users/UserDetailsModal.tsx";
import HabitForm from "../components/habits/HabitForm";
import TaskForm from "../components/tasks/TaskForm";
import TaskCard from "../components/tasks/TaskCard";
import HabitCard from "../components/habits/HabitCard";
import { getAllTasks, completeTask, deleteTask, Task } from "../api/TasksAPI";
import { getAllHabits, completeHabit, deleteHabit, Habit } from "../api/HabitsAPI";

const DashboardPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [openModal, setOpenModal] = useState<"task" | "habit" | null>(null);
    const [userStats, setUserStats] = useState<{ username: string; gold: number; level: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [openUserModal, setOpenUserModal] = useState(false);



    useEffect(() => {
        const fetchData = async () => {
            const tasksData = await getAllTasks();
            const habitsData = await getAllHabits();
            setTasks(tasksData);
            setHabits(habitsData);

            const username = getUsernameFromToken();
            if (!username) {
                console.error("Username not found in token.");
                return;
            }

            try {
                const userInfo = await getUserInfo(username);
                setUserStats({
                    username: userInfo.username,
                    gold: userInfo.gold,
                    level: userInfo.level,
                });
            } catch (error) {
                console.error("Failed to fetch user stats:", error);
            } finally {
                setLoading(false); // Ensure loading state is turned off
            }
        };

        fetchData();
    }, []);


    const handleCompleteTask = async (taskId: string) => {
        await completeTask(taskId);
        const updatedTasks = await getAllTasks();
        setTasks(updatedTasks);
    };

    const handleDeleteTask = async (taskId: string) => {
        await deleteTask(taskId);
        setTasks(tasks.filter((task) => task.id !== taskId));
    };

    const handleCompleteHabit = async (habitId: string) => {
        await completeHabit(habitId);
        const updatedHabits = await getAllHabits();
        setHabits(updatedHabits);
    };

    const handleDeleteHabit = async (habitId: string) => {
        await deleteHabit(habitId);
        setHabits(habits.filter((habit) => habit.id !== habitId));
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <>
            {/* AppBar */}
            <AppBar position="fixed" sx={{ backgroundColor: "#1e1e1e" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, pl: 2 }}>
                        Questify Dashboard
                    </Typography>
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : userStats ? (
                        <Box display="flex" alignItems="center">
                            <Typography
                                variant="body1"
                                sx={{
                                    mr: 2,
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                }}
                                onClick={() => setOpenUserModal(true)} // Open modal on username click
                            >
                                Welcome, {userStats.username}
                            </Typography>
                            <Typography variant="body2" sx={{ mx: 2 }}>
                                Gold: {userStats.gold}
                            </Typography>
                            <Typography variant="body2">Level: {userStats.level}</Typography>
                        </Box>
                    ) : (
                        <Typography variant="body2" color="error">
                            Failed to load user stats
                        </Typography>
                    )}
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>


            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    pt: 10, // Push content below AppBar
                    width: "100vw", // Occupy the entire screen width
                    minHeight: "100vh", // Make the content fill the entire vertical space if needed
                    display: "flex", // Flex to align tasks and habits
                    justifyContent: "space-between", // Spread tasks and habits evenly
                    alignItems: "flex-start", // Align at the top near AppBar
                    px: 4, // Add padding to the left and right edges
                    boxSizing: "border-box", // Ensure padding is considered within the layout
                }}
            >
                {/* Tasks Section */}
                <Box
                    sx={{
                        flex: 1, // Evenly share horizontal space
                        padding: 2,
                        backgroundColor: "#f4f4f4", // Light gray background
                        borderRadius: 2,
                        marginRight: "16px", // Add horizontal gap between tasks and habits
                    }}
                >
                    {/* Tasks Header */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 2,
                        }}
                    >
                        <Typography variant="h5">Tasks</Typography>
                        <Fab
                            size="small"
                            color="primary"
                            aria-label="add-task"
                            onClick={() => setOpenModal("task")}
                        >
                            <AddIcon />
                        </Fab>
                    </Box>

                    {/* Task Cards */}
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            {...task}
                            onComplete={handleCompleteTask}
                            onDelete={handleDeleteTask}
                        />
                    ))}
                </Box>

                {/* Habits Section */}
                <Box
                    sx={{
                        flex: 1, // Evenly share horizontal space
                        padding: 2,
                        backgroundColor: "#f4f4f4", // Light gray background
                        borderRadius: 2,
                        marginLeft: "16px", // Add the gap
                    }}
                >
                    {/* Habits Header */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 2,
                        }}
                    >
                        <Typography variant="h5">Habits</Typography>
                        <Fab
                            size="small"
                            color="secondary"
                            aria-label="add-habit"
                            onClick={() => setOpenModal("habit")}
                        >
                            <AddIcon />
                        </Fab>
                    </Box>

                    {/* Habit Cards */}
                    {habits.map((habit) => (
                        <HabitCard
                            key={habit.id}
                            habit={habit}
                            onComplete={handleCompleteHabit}
                            onDelete={handleDeleteHabit}
                            onReset={async (habitId) => {
                                await completeHabit(habitId);
                                const updatedHabits = await getAllHabits();
                                setHabits(updatedHabits);
                            }}
                        />
                    ))}
                </Box>
            </Box>

            <UserDetailsModal
                open={openUserModal} // Use the state for modal visibility
                onClose={() => setOpenUserModal(false)} // Properly toggle modal off
                username={userStats?.username} // Pass the username prop here
            />


            {/* Modal for Adding */}
            <Modal
                open={Boolean(openModal)}
                onClose={() => setOpenModal(null)}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        boxShadow: 24,
                        padding: 4,
                        borderRadius: 2,
                        minWidth: "300px",
                    }}
                >
                    {openModal === "task" ? (
                        <TaskForm
                            onTaskCreated={async () => {
                                const updatedTasks = await getAllTasks();
                                setTasks(updatedTasks);
                                setOpenModal(null);
                            }}
                        />
                    ) : (
                        <HabitForm
                            onHabitCreated={async () => {
                                const updatedHabits = await getAllHabits();
                                setHabits(updatedHabits);
                                setOpenModal(null);
                            }}
                        />
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default DashboardPage;
// DashboardPage.tsx
import React, {useState, useEffect} from 'react';
import {Grid, Box, Typography, Card, CardContent, Button, LinearProgress} from '@mui/material';

import TaskCard from '../components/tasks/TaskCard';
import HabitCard from '../components/habits/HabitCard';
import UserInfoCard from '../components/users/UserInfoCard';
import {getAllTasks, completeTask, deleteTask, Task} from '../api/TasksAPI';
import {getAllHabits, completeHabit, deleteHabit, Habit} from '../api/HabitsAPI';
import {getBossSelection, attackBoss, Boss} from '../api/BossesAPI';


interface User
{
    username: string;
    xp: number;
    gold: number;
    level: number;
}

const DashboardPage: React.FC = () =>
{
    const [tasks, setTasks] = useState<Task[]>([]);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [currentBoss, setCurrentBoss] = useState<Boss | null>(null);
    const [user, setUser] = useState<User>({
        username: 'Hero',
        xp: 1200,
        gold: 200,
        level: 5,
    });

    useEffect(() =>
    {
        const fetchData = async () =>
        {
            const tasksData = await getAllTasks();
            const habitsData = await getAllHabits();
            const bossSelection = await getBossSelection();

            // Find an active boss (one that isn't defeated)
            const activeBoss = bossSelection.find((boss) => !boss.defeated);
            setTasks(tasksData);
            setHabits(habitsData);
            setCurrentBoss(activeBoss || null);
        };

        fetchData();
    }, []);

    const handleCompleteTask = async (taskId: string) =>
    {
        await completeTask(taskId);
        const updatedTasks = await getAllTasks();
        setTasks(updatedTasks);

        // Attack the boss when completing tasks
        if (currentBoss)
        {
            await handleAttackBoss(10); // Example damage value
        }
    };

    const handleDeleteTask = async (taskId: string) =>
    {
        await deleteTask(taskId);
        setTasks(tasks.filter((task) => task.id !== taskId));
    };

    const handleCompleteHabit = async (habitId: string) =>
    {
        await completeHabit(habitId);
        const updatedHabits = await getAllHabits();
        setHabits(updatedHabits);

        // Attack the boss when completing habits
        if (currentBoss)
        {
            await handleAttackBoss(5); // Example lower damage value
        }
    };

    const handleDeleteHabit = async (habitId: string) =>
    {
        await deleteHabit(habitId);
        setHabits(habits.filter((habit) => habit.id !== habitId));
    };

    const handleAttackBoss = async (damage: number) =>
    {
        if (!currentBoss) return;

        const updatedBoss = await attackBoss(damage); // API call with damage dealt
        setCurrentBoss(updatedBoss.boss); // Update the boss's health
    };

    return (
        <Box padding={2}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <UserInfoCard user={user} onUserUpdate={setUser}/>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h5">Tasks</Typography>
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            {...task}
                            onComplete={handleCompleteTask}
                            onDelete={handleDeleteTask}
                        />
                    ))}
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h5">Habits</Typography>
                    {habits.map((habit) => (
                        <HabitCard
                            key={habit.id}
                            habit={habit}
                            onComplete={handleCompleteHabit}
                            onDelete={handleDeleteHabit}
                            onReset={() => console.log(`Habit ${habit.id} reset`)}
                        />
                    ))}
                </Grid>

                {/* Boss Section */}
                {currentBoss && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5">{currentBoss.name}</Typography>
                                <Typography>
                                    Health: {currentBoss.currentHealth}/{currentBoss.maxHealth}
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={(currentBoss.currentHealth / currentBoss.maxHealth) * 100}
                                    sx={{marginY: 2}}
                                />
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleAttackBoss(20)} // Manual attack option
                                    disabled={currentBoss.currentHealth <= 0}
                                >
                                    Attack Boss
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default DashboardPage;
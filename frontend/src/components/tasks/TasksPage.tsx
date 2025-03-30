import React, {useState, useEffect} from 'react';
import {getAllTasks} from '../../api/TasksAPI';
import {Box, Button, Typography, Grid, GridProps} from '@mui/material';
import TaskCard from './TaskCard';

// Define the structure of a Task object
interface Task
{
    id: string;
    title: string;
    description: string;
    dueDate: string;
    completed: boolean;
}

const TasksPage: React.FC = () =>
{
    const [tasks, setTasks] = useState<Task[]>([]); // Explicitly typed state

    useEffect(() =>
    {
        const fetchTasks = async () =>
        {
            try
            {
                const data = await getAllTasks();
                setTasks(data); // TypeScript infers `data` matches Task[]
            } catch (error)
            {
                console.error('Failed to fetch tasks:', error);
            }
        };
        fetchTasks();
    }, []);

    return (
        <Box sx={{padding: '16px'}}>
            <Typography variant="h4" gutterBottom>
                Your Tasks
            </Typography>

            <Grid container spacing={2}>
                {tasks.map((task: Task) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={task.id}
                        component="div" // Explicitly set the component prop
                        {...({} as GridProps)} // Ensure TypeScript resolves the `item` prop
                    >
                        <TaskCard task={task}/>
                    </Grid>
                ))}
            </Grid>

            <Button
                variant="contained"
                color="primary"
                sx={{mt: 2}}
                onClick={() =>
                {
                    // Logic to open "Add Task" dialog (placeholder)
                }}
            >
                Add New Task
            </Button>
        </Box>
    );
};

export default TasksPage;
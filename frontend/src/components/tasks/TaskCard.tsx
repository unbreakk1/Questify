import React from 'react';
import { Card, CardContent, Typography, Checkbox } from '@mui/material';

interface Task
{
    title: string;
    dueDate: string; // Adjust type if necessary (e.g., Date)
    completed: boolean;
}

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography color="text.secondary">Due: {task.dueDate}</Typography>
                <Checkbox checked={task.completed} />
                <Typography>{task.completed ? 'Completed' : 'Pending'}</Typography>
            </CardContent>
        </Card>
    );
};

export default TaskCard;
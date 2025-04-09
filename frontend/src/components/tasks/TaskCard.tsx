// TaskCard.tsx
import React from 'react';
import {Card, CardContent, Typography, Button, Box} from '@mui/material';

interface Task
{
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
    onComplete: (taskId: string) => void;
    onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<Task> = ({id, title, dueDate, completed, onComplete, onDelete}) =>
{
    return (
        <Card>
            <CardContent>
                <Box display="flex" flexDirection="column" gap={2}>
                    <Typography variant="h6">{title}</Typography>
                    <Typography color="text.secondary">Due: {dueDate}</Typography>
                    <Box display="flex" justifyContent="space-between">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => onComplete(id)}
                            disabled={completed}
                        >
                            {completed ? 'Completed' : 'Complete'}
                        </Button>
                        <Button variant="contained" color="error" onClick={() => onDelete(id)}>
                            Delete
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default TaskCard;
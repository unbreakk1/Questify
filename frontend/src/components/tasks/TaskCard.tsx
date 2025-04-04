import React from 'react';
import {Card, CardContent, Typography, Button} from '@mui/material';

interface Task
{
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
}

interface TaskCardProps
{
    task: Task;
    onComplete: () => void;
    onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({task, onComplete , onDelete}) =>
{
    return (
        <Card>
            <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography color="text.secondary">Due: {task.dueDate}</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onComplete}
                    disabled={task.completed} // Disable button for completed tasks
                >
                    {task.completed ? 'Completed' : 'Complete'}
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={onDelete} // Pass onDelete as a prop and handle it
                >
                    Delete
                </Button>
            </CardContent>
        </Card>
    );
};

export default TaskCard;


import React from 'react';
import {Card, CardContent, Typography, Button, Box} from '@mui/material';



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

const TaskCard: React.FC<TaskCardProps> = ({task, onComplete}) =>
{
    return (
        <Card>
            <CardContent>
                <Box display="flex" flexDirection="column" gap={2}>
                    <Typography variant="h6">{task.title}</Typography>
                    <Typography color="text.secondary">Due: {task.dueDate}</Typography>
                    <Box display="flex" justifyContent="space-between">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onComplete}
                            disabled={task.completed}
                        >
                            {task.completed ? 'Completed' : 'Complete'}
                        </Button>
                        <Button variant="contained" color="secondary">Test Button</Button>

                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default TaskCard;


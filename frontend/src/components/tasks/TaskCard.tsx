import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/joy";

interface Task {
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
    onComplete: (taskId: string) => void;
    onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<Task> = ({ id, title, dueDate, completed, onComplete, onDelete }) => {
    return (
        <Card
            variant="outlined"
            sx={{
                mb: 1,
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                bgcolor: completed ? 'background.level2' : 'background.surface',
                opacity: completed ? 0.8 : 1,
            }}
        >
            <CardContent
                sx={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Box>
                    <Typography level="title-md">{title}</Typography>
                    <Typography level="body-sm" color="neutral">
                        Due: {dueDate}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Button
                        size="sm"
                        color="primary"
                        variant="soft"
                        onClick={() => onComplete(id)}
                        disabled={completed}
                    >
                        {completed ? "Completed" : "Complete"}
                    </Button>
                    <Button
                        size="sm"
                        color="danger"
                        variant="soft"
                        onClick={() => onDelete(id)}
                    >
                        Delete
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default TaskCard;

import React from "react";
import {Typography, Box, IconButton} from "@mui/joy";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

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
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                background: 'linear-gradient(135deg, rgba(124, 77, 255, 0.12) 0%, rgba(124, 77, 255, 0.05) 100%)',
                borderRadius: 'lg',
                padding: '12px 20px',
                border: '2px solid',
                borderColor: completed ? 'success.outlinedBorder' : 'rgba(124, 77, 255, 0.5)',
                boxShadow: `0 0 10px rgba(124, 77, 255, 0.3)`,
                transition: 'all 0.2s ease-in-out',
                transform: completed ? 'scale(0.98)' : 'scale(1)',
                opacity: completed ? 0.8 : 1,
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                    transform: completed ? 'scale(0.98)' : 'scale(1.02)',
                    boxShadow: `0 0 15px rgba(124, 77, 255, 0.4)`,
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, transparent 0%, rgba(124, 77, 255, 0.1) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.2s ease-in-out',
                    pointerEvents: 'none',
                }
            }}
        >
            <Box sx={{ flex: 1 }}>
                <Typography
                    level="title-md"
                    sx={{
                        textDecoration: completed ? 'line-through' : 'none',
                        color: completed ? 'neutral.500' : 'text.primary',
                        textShadow: `0 0 5px rgba(124, 77, 255, 0.3)`,
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    level="body-sm"
                    sx={{
                        color: completed ? 'neutral.500' : 'primary.500',
                        fontWeight: 'bold',
                        mt: 0.5,
                    }}
                >
                    Due: {dueDate}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                    size="sm"
                    color={completed ? "success" : "primary"}
                    variant={completed ? "soft" : "solid"}
                    onClick={() => onComplete(id)}
                    disabled={completed}
                    sx={{
                        transform: 'translateZ(0)',
                        '&:hover': {
                            transform: completed ? 'none' : 'translateY(-2px)',
                        }
                    }}
                >
                    <CheckCircleRoundedIcon/>
                </IconButton>
                <IconButton
                    size="sm"
                    color="danger"
                    variant="soft"
                    onClick={() => onDelete(id)}
                    sx={{
                        transform: 'translateZ(0)',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                        }
                    }}
                >
                    <DeleteRoundedIcon/>
                </IconButton>
            </Box>
        </Box>
    );
};

export default TaskCard;
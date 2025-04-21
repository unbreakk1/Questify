import React from "react";
import {Typography, Box, IconButton} from "@mui/joy";
import {Habit} from "../../api/HabitsAPI";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

interface HabitCardProps
{
    habit: Habit;
    onComplete: (habitId: string) => void;
    onDelete: (habitId: string) => void;
    onReset: (habitId: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({habit, onComplete, onDelete}) =>
{
    const {title, streak = 0, lastCompletedDate} = habit;
    const today = new Date().toISOString().split("T")[0];
    const isCompletedToday = lastCompletedDate === today;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.12) 0%, rgba(255, 152, 0, 0.05) 100%)',
                borderRadius: 'lg',
                padding: '12px 20px',
                border: '2px solid',
                borderColor: isCompletedToday ? 'success.outlinedBorder' : 'rgba(255, 152, 0, 0.5)',
                boxShadow: `0 0 10px rgba(255, 152, 0, 0.3)`,
                transition: 'all 0.2s ease-in-out',
                transform: isCompletedToday ? 'scale(0.98)' : 'scale(1)',
                opacity: isCompletedToday ? 0.8 : 1,
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                    transform: isCompletedToday ? 'scale(0.98)' : 'scale(1.02)',
                    boxShadow: `0 0 15px rgba(255, 152, 0, 0.4)`,
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, transparent 0%, rgba(255, 152, 0, 0.1) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.2s ease-in-out',
                    pointerEvents: 'none',
                }
            }}
        >
            <Box sx={{flex: 1}}>
                <Typography
                    level="title-md"
                    sx={{
                        color: isCompletedToday ? 'neutral.500' : 'text.primary',
                        textShadow: `0 0 5px rgba(255, 152, 0, 0.3)`,
                    }}
                >
                    {title}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: streak > 0 ? 'warning.500' : 'neutral.500',
                        mt: 0.5,
                    }}
                >
                    <LocalFireDepartmentIcon
                        sx={{
                            fontSize: 'sm',
                            animation: streak > 0 ? 'flame 1s ease infinite alternate' : 'none',
                            '@keyframes flame': {
                                '0%': {transform: 'scale(1)'},
                                '100%': {transform: 'scale(1.2)'},
                            },
                        }}
                    />
                    <Typography level="body-sm" fontWeight="bold">
                        {streak} day streak
                    </Typography>
                </Box>
            </Box>

            <Box sx={{display: 'flex', gap: 1}}>
                <IconButton
                    size="sm"
                    color={isCompletedToday ? "success" : "primary"}
                    variant={isCompletedToday ? "soft" : "solid"}
                    onClick={() => onComplete(habit.id)}
                    disabled={isCompletedToday}
                    sx={{
                        transform: 'translateZ(0)',
                        '&:hover': {
                            transform: isCompletedToday ? 'none' : 'translateY(-2px)',
                        }
                    }}
                >
                    <CheckCircleRoundedIcon/>
                </IconButton>
                <IconButton
                    size="sm"
                    color="danger"
                    variant="soft"
                    onClick={() => onDelete(habit.id)}
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

export default HabitCard;
import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { Habit } from '../../api/HabitsAPI';

interface HabitCardProps {
    habit: Habit;
    onComplete: (habitId: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onComplete }) => {
    const {
        title,
        frequency = 'DAILY',
        difficulty = 'EASY',
        streak = 0,
        progress = [],
    } = habit;

    // Check if the habit was completed today
    const isCompletedToday = progress.some(
        (p) => p.date === new Date().toISOString().split('T')[0] && p.completed
    );

    return (
        <Card sx={{ margin: '16px', width: '100%' }}>
            <CardContent>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body2">Frequency: {frequency}</Typography>
                <Typography variant="body2">Difficulty: {difficulty}</Typography>
                <Typography variant="body2">Streak: {streak}</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onComplete(habit.id)}
                    disabled={isCompletedToday}
                >
                    {isCompletedToday ? 'Completed Today' : 'Complete'}
                </Button>
            </CardContent>
        </Card>
    );
};

export default HabitCard;
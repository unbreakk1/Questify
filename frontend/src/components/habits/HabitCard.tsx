import { Button, Card, CardContent, Typography, Checkbox } from '@mui/material';
import {Habit} from "../../api/HabitsAPI.tsx";

interface HabitCardProps {
    habit: Habit;
    onComplete: (habitId: string) => void;
    onReset: (habitId: string) => void; // Add reset handler
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onComplete, onReset }) => {
    const {
        title,
        frequency,
        difficulty,
        streak = 0,
        lastCompletedDate,
    } = habit;

    const today = new Date().toISOString().split('T')[0];
    const isCompletedToday = lastCompletedDate === today;

    return (
        <Card sx={{ margin: '8px 0', padding: '16px', width: '100%' }}>
            <CardContent>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body2">Frequency: {frequency}</Typography>
                <Typography variant="body2">Difficulty: {difficulty}</Typography>
                <Typography variant="body2">Streak: {streak} days</Typography>
                <Checkbox
                    checked={isCompletedToday}
                    onChange={() => onComplete(habit.id)} // Mark as complete
                    disabled={isCompletedToday}         // Disable if already completed
                    inputProps={{ 'aria-label': `Mark ${title} as complete` }}
                />
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => onReset(habit.id)}  // Reset completion
                    sx={{ marginLeft: '8px' }}
                >
                    Reset
                </Button>
            </CardContent>
        </Card>
    );
};

export default HabitCard;
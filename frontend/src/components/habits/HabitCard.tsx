import {Card, CardContent, Typography, Checkbox, Box} from '@mui/material';
import {Habit} from "../../api/HabitsAPI.tsx";

interface HabitCardProps
{
    habit: Habit;
    onComplete: (habitId: string) => void;
    onReset: (habitId: string) => void; // Add reset handler
}

const HabitCard: React.FC<HabitCardProps> = ({habit, onComplete}) =>
{
    const
        {
            title,
            frequency,
            difficulty,
            streak = 0,
            lastCompletedDate,
        } = habit;

    const today = new Date().toISOString().split('T')[0];
    const isCompletedToday = lastCompletedDate === today;

    return (
        <Card
            sx={{
                margin: '8px 0',
                padding: '16px',
                width: '100%',
                opacity: isCompletedToday ? 0.6 : 1, // Make completed cards less opaque
                pointerEvents: isCompletedToday ? 'none' : 'auto', // Disable interaction for completed habits
            }}
        >
        <CardContent>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body2">Frequency: {frequency}</Typography>
                <Typography variant="body2">Difficulty: {difficulty}</Typography>
                <Typography variant="body2">Streak: {streak} days</Typography>
                <Box display="flex" alignItems="center">
                    <Checkbox
                        checked={isCompletedToday} // Checkbox stays checked if completed
                        onChange={() => onComplete(habit.id)}
                        disabled={isCompletedToday} // Disable if it's completed
                    />
                    {isCompletedToday && (
                        <Typography variant="body2" color="textSecondary">
                            Completed today!
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};


export default HabitCard;
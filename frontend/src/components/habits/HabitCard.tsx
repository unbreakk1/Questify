import { Card, CardContent, Typography, Checkbox, Box, Button, CardActions } from "@mui/joy";
import { Habit } from "../../api/HabitsAPI.tsx";

interface HabitCardProps {
    habit: Habit;
    onComplete: (habitId: string) => void;
    onDelete: (habitId: string) => void;
    onReset: (habitId: string) => void; // Add reset handler
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onComplete, onDelete }) => {
    const { title, streak = 0, lastCompletedDate } = habit;

    const today = new Date().toISOString().split("T")[0];
    const isCompletedToday = lastCompletedDate === today;

    return (
        <Card
            variant="outlined"
            sx={{
                mb: 1,
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                bgcolor: isCompletedToday ? 'background.level2' : 'background.surface',
                opacity: isCompletedToday ? 0.8 : 1,
            }}
        >
            <CardContent sx={{
                display: 'flex',
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
            }}>
                <Box>
                    <Typography level="title-md">{title}</Typography>
                    <Typography level="body-sm">
                        Streak: {streak} days
                    </Typography>
                </Box>

                <CardActions sx={{ gap: 1 }}>
                    <Checkbox
                        checked={isCompletedToday}
                        onChange={() => onComplete(habit.id)}
                        disabled={isCompletedToday}
                    />
                    <Button
                        onClick={() => onDelete(habit.id)}
                        color="danger"
                        variant="soft"
                        size="sm"
                    >
                        Delete
                    </Button>
                </CardActions>
            </CardContent>
        </Card>
    );
};

export default HabitCard;

import { Card, CardContent, Typography, Checkbox, Box, Button } from "@mui/material";
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
            sx={{
                margin: "8px 0", // Space between habit cards
                padding: "12px", // Adjust padding for a thinner layout
                width: "100%", // Stretch the card to full container width
                height: "64px", // Limit the height to make it thinner
                display: "flex", // Flex layout to align content on a single row
                alignItems: "center", // Center contents vertically
                justifyContent: "space-between", // Space out contents horizontally
                backgroundColor: isCompletedToday ? "#f5f5f5" : "darkgray", // Subtle effect for completed cards
                opacity: isCompletedToday ? 0.8 : 1, // Slightly lower opacity for completed cards
            }}
        >
            <CardContent
                sx={{
                    padding: "0 16px", // Adjusted padding for content
                    display: "flex",
                    flex: 1,
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                {/* Left Content */}
                <Box>
                    <Typography variant="h6">{title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Streak: {streak} days
                    </Typography>
                </Box>

                {/* Right Content */}
                <Box display="flex" alignItems="center" gap={2}>
                    <Checkbox
                        checked={isCompletedToday} // Checkbox stays checked when completed
                        onChange={() => onComplete(habit.id)}
                        disabled={isCompletedToday} // Disable if already completed
                    />
                    <Button
                        onClick={() => onDelete(habit.id)} // Hook up the delete handler
                        color="error"
                        variant="outlined"
                        size="small"
                    >
                        Delete
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default HabitCard;
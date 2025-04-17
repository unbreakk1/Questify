import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

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
            sx={{
                margin: "8px 0", // Space between task cards
                padding: "12px", // Adjust padding for a thinner layout
                width: "100%", // Stretch the card to full container width
                height: "64px", // Make the card thinner
                display: "flex", // Flex layout to align content on a single row
                alignItems: "center", // Center contents vertically
                justifyContent: "space-between", // Space out contents horizontally
                backgroundColor: completed ? "darkgrey" : "darkgray", // Subtle effect for completed tasks
                opacity: completed ? 0.8 : 1, // Slightly lower opacity for completed tasks
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
                        Due: {dueDate}
                    </Typography>
                </Box>

                {/* Right Content */}
                <Box display="flex" alignItems="center" gap={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onComplete(id)}
                        disabled={completed} // Disable if already completed
                    >
                        {completed ? "Completed" : "Complete"}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
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
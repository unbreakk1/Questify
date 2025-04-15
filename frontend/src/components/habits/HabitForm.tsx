import React, { useState } from 'react';
import { TextField, Button, MenuItem } from '@mui/material';
import { createHabit } from '../../api/HabitsAPI';

interface HabitFormProps {
    onHabitCreated: () => void; // Callback to refresh habits after creation
}

const HabitForm: React.FC<HabitFormProps> = ({ onHabitCreated }) => {
    const [title, setTitle] = useState('');
    const [frequency, setFrequency] = useState('DAILY'); // Default value
    const [difficulty, setDifficulty] = useState('EASY'); // Default value

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title) {
            alert('Please enter a habit title!');
            return;
        }

        try {
            await createHabit({ title, frequency, difficulty }); // Call the API to create the habit
            onHabitCreated(); // Trigger refresh of habits
            // Reset form fields
            setTitle('');
            setFrequency('DAILY');
            setDifficulty('EASY');
        } catch (error) {
            console.error('Error creating habit:', error); // Log any errors
            alert('Failed to create habit. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                fullWidth
                label="Habit Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                margin="normal"
                required
            />
            <TextField
                select
                label="Frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                fullWidth
                margin="normal"
            >
                <MenuItem value="DAILY">Daily</MenuItem>
                <MenuItem value="WEEKLY">Weekly</MenuItem>
                {/* Add other frequency options if needed */}
            </TextField>
            <TextField
                select
                label="Difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                fullWidth
                margin="normal"
            >
                <MenuItem value="EASY">Easy</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HARD">Hard</MenuItem>
                {/* Add other difficulty options if needed */}
            </TextField>
            <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: '16px' }}
            >
                Create Habit
            </Button>
        </form>
    );
};

export default HabitForm;
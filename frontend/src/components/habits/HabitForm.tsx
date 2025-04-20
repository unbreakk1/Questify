import React, { useState } from 'react';
import { Input, Button, FormControl, FormLabel, Select, Option } from '@mui/joy';
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
            <FormControl sx={{ mb: 2 }}>
                <FormLabel>Habit Title</FormLabel>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </FormControl>

            <FormControl sx={{ mb: 2 }}>
                <FormLabel>Frequency</FormLabel>
                <Select
                    value={frequency}
                    onChange={(_, newValue) => setFrequency(newValue || 'DAILY')}
                >
                    <Option value="DAILY">Daily</Option>
                    <Option value="WEEKLY">Weekly</Option>
                </Select>
            </FormControl>

            <FormControl sx={{ mb: 2 }}>
                <FormLabel>Difficulty</FormLabel>
                <Select
                    value={difficulty}
                    onChange={(_, newValue) => setDifficulty(newValue || 'EASY')}
                >
                    <Option value="EASY">Easy</Option>
                    <Option value="MEDIUM">Medium</Option>
                    <Option value="HARD">Hard</Option>
                </Select>
            </FormControl>

            <Button
                type="submit"
                variant="solid"
                color="primary"
                sx={{ mt: 1 }}
                fullWidth
            >
                Create Habit
            </Button>
        </form>
    );
};

export default HabitForm;

import { useState } from 'react';
import { Input, Button, FormControl, FormLabel } from '@mui/joy';
import { createTask } from '../../api/TasksAPI';

const TaskForm: React.FC<{ onTaskCreated: () => void }> = ({ onTaskCreated }) => {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !dueDate) return;

        await createTask({ title, dueDate }); // Create task on backend
        onTaskCreated(); // Trigger parent to fetch new tasks
        setTitle(''); // Reset form
        setDueDate('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormControl sx={{ mb: 2 }}>
                <FormLabel>Task Title</FormLabel>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </FormControl>

            <FormControl sx={{ mb: 2 }}>
                <FormLabel>Due Date</FormLabel>
                <Input
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    type="date"
                    slotProps={{
                        input: {
                            min: new Date().toISOString().split('T')[0],
                        },
                    }}
                    required
                />
            </FormControl>

            <Button
                type="submit"
                variant="solid"
                color="primary"
                sx={{ mt: 1 }}
                fullWidth
            >
                Create Task
            </Button>
        </form>
    );
};

export default TaskForm;


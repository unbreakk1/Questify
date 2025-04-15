import { useState } from 'react';
import { TextField, Button } from '@mui/material';
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
            <TextField
                label="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
            />
            <TextField
                label="Due Date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                fullWidth
                type="date"
                InputLabelProps={{ shrink: true }}
            />
            <Button
                type="submit"
                variant="outlined"
                color="primary"
                style={{ marginTop: '8px' }}
            >
                Create Task
            </Button>
        </form>
    );
};

export default TaskForm;

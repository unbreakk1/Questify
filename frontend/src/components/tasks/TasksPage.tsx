import React, {useState, useEffect} from 'react';
import {getAllTasks, completeTask, Task} from '../../api/TasksAPI'; // Import completeTask API function
import TaskCard from './TaskCard';

const TasksPage: React.FC = () =>
{
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() =>
    {
        const fetchTasks = async () =>
        {
            try
            {
                const data = await getAllTasks();
                setTasks(data);
            } catch (error)
            {
                console.error('Failed to fetch tasks:', error);
            }
        };
        fetchTasks();
    }, []);

    const handleCompleteTask = async (taskId: string) =>
    {
        try
        {
            // Call the `completeTask` API to mark the task as complete
            await completeTask(taskId);

            // Refresh the task list to reflect the updated status
            const updatedTasks = await getAllTasks();
            setTasks(updatedTasks);
        } catch (error)
        {
            console.error(`Failed to complete task with ID ${taskId}:`, error);
        }
    };


    return (
        <div>
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={() => handleCompleteTask(task.id)} // Pass task ID to the function
                />
            ))}
        </div>
    );
};

export default TasksPage;


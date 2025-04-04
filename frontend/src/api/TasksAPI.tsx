import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/tasks';
const token = localStorage.getItem('token'); // Retrieve JWT for auth

export interface Task
{
    id: string;
    title: string;
    dueDate: string; // YYYY-MM-DD
    completed: boolean;
    lastCompletedDate?: string; // Tracks when the task was last completed
    recentlyCompleted?: boolean; // Used to trigger animation

}

export const getAllTasks = async () =>
{
    const response = await axios.get(`${BASE_URL}`, {
        headers: {Authorization: `Bearer ${token}`},
    });
    return response.data;
};

export const createTask = async (task: { title: string; dueDate: string }) =>
{
    const response = await axios.post(`${BASE_URL}`, task, {
        headers: {Authorization: `Bearer ${token}`},
    });
    return response.data;
};

// Add `completeTask` function and export it
export const completeTask = async (taskId: string) =>
{
    const response = await axios.put(
        `${BASE_URL}/${taskId}/complete`,
        {}, // No request body needed
        {
            headers: {Authorization: `Bearer ${token}`},
        }
    );
    return response.data; // Return updated task object
};

export const deleteTask = async (taskId: string) =>
{
    await axios.delete(`${BASE_URL}/${taskId}`, {
        headers: {Authorization: `Bearer ${token}`},
    });
};



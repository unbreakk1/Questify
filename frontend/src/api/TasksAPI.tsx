import apiClient from './ApiClient'; // Import centralized Axios client

export interface Task
{
    id: string;
    title: string;
    dueDate: string; // Format: YYYY-MM-DD
    completed: boolean;
    lastCompletedDate?: string; // Tracks when the task was last completed
    recentlyCompleted?: boolean; // Used to trigger animation
}

const BASE_URL = '/api/tasks'; // Relative URL for task APIs

// Fetch all tasks
export const getAllTasks = async (): Promise<Task[]> =>
{
    const response = await apiClient.get(BASE_URL);
    return response.data;
};

// Create a new task
export const createTask = async (task: { title: string; dueDate: string }): Promise<Task> =>
{
    const response = await apiClient.post(BASE_URL, task);
    return response.data;
};

// Mark a task as completed
export const completeTask = async (taskId: string): Promise<Task> =>
{
    const response = await apiClient.put(`${BASE_URL}/${taskId}/complete`);
    return response.data;
};

// Delete a task
export const deleteTask = async (taskId: string): Promise<void> =>
{
    await apiClient.delete(`${BASE_URL}/${taskId}`);
};
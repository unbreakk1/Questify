import apiClient from './ApiClient'; // Centralized Axios client

export interface Habit
{
    id: string;
    title: string;
    frequency: string;
    difficulty: string;
    streak: number;
    completed: boolean;
    lastCompletedDate?: string;
}

const BASE_URL = '/api/habits'; // Relative URL for habit APIs

// Fetch all habits
export const getAllHabits = async (): Promise<Habit[]> =>
{
    const response = await apiClient.get(BASE_URL);
    return response.data;
};

// Mark a habit as completed
export const completeHabit = async (habitId: string): Promise<Habit> =>
{
    const response = await apiClient.put(`${BASE_URL}/${habitId}/complete`);
    return response.data;
};

// Reset a habit
export const resetHabit = async (habitId: string): Promise<Habit> =>
{
    const response = await apiClient.put(`${BASE_URL}/${habitId}/reset`);
    return response.data;
};

// Create a new habit
export const createHabit = async (habit: { title: string; frequency: string; difficulty: string }): Promise<Habit> =>
{
    const response = await apiClient.post(BASE_URL, habit);
    return response.data;
};

// Delete a habit
export const deleteHabit = async (habitId: string): Promise<void> =>
{
    await apiClient.delete(`${BASE_URL}/${habitId}`);
};
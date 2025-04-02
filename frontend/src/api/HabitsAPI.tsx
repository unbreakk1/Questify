import axios from 'axios';

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

const BASE_URL = 'http://localhost:8080/api/habits';
const token = localStorage.getItem('token');

export const getAllHabits = async (): Promise<Habit[]> =>
{
    const response = await axios.get(`${BASE_URL}`, {
        headers: {Authorization: `Bearer ${token}`},
    });
    return response.data;
};

export const completeHabit = async (habitId: string): Promise<Habit> =>
{
    try
    {
        const response = await axios.put(
            `${BASE_URL}/${habitId}/complete`,
            {},
            {headers: {Authorization: `Bearer ${token}`}}
        );
        return response.data;
    } catch (error)
    {
        console.error("Failed to complete habit:", error);
        throw error;
    }
};

export const resetHabit = async (habitId: string): Promise<Habit> =>
{
    try
    {
        const response = await axios.put(
            `${BASE_URL}/${habitId}/reset`,
            {}, // Empty body
            {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
            }
        );
        return response.data;
    } catch (error)
    {
        console.error(`Failed to reset habit with ID ${habitId}:`, error);
        throw error;
    }
};

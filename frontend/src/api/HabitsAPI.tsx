import axios from 'axios';

export interface Habit
{
    id: string;
    title: string;
    frequency: string; // DAILY, WEEKLY, etc.
    difficulty: string; // EASY, MEDIUM, HARD
    streak: number; // Current streak count
    progress:
    {
        date: string;
        completed: boolean;
    }[]; // Array of progress objects (date and completion state)
}


const BASE_URL = 'http://localhost:8080/api/habits';
const token = localStorage.getItem('token'); // Retrieve JWT for auth

export const getAllHabits = async (): Promise<Habit[]> => {
    const response = await axios.get(`${BASE_URL}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    // Ensure fields like `progress`, `frequency`, and `difficulty` have defaults
    return response.data.map((habit: Habit) => ({
        ...habit,
        frequency: habit.frequency || 'DAILY',
        difficulty: habit.difficulty || 'EASY',
        progress: habit.progress || [],
    }));
};


export const completeHabit = async (habitId: string): Promise<Habit> =>
{
    const response = await axios.put(`${BASE_URL}/${habitId}/complete`, {}, {
        headers: {Authorization: `Bearer ${token}`},
    });
    return response.data;
};
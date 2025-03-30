import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/boss';
const token = localStorage.getItem('token'); // Retrieve JWT for auth

export const getAllBosses = async () =>
{
    const response = await axios.get(`${BASE_URL}`, {
        headers: {Authorization: `Bearer ${token}`},
    });

    if (Array.isArray(response.data))
    {
        return response.data; // Return if it’s already an array
    }
    else
    {
        console.warn('Bosses API returned a single object. Wrapping it in an array.');
        return [response.data]; // Wrap single object in an array if necessary
    }
};


export const createBoss = async (boss: { name: string; maxHealth: number; levelRequirement: number }) =>
{
    const response = await axios.post(`${BASE_URL}/create`, boss, {
        headers: {Authorization: `Bearer ${token}`},
    });
    return response.data;
};
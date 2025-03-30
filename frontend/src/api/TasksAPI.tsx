import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/tasks';
const token = localStorage.getItem('token'); // Retrieve JWT for auth

export const getAllTasks = async () => {
    const response = await axios.get(`${BASE_URL}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const createTask = async (task: { title: string; dueDate: string }) => {
    const response = await axios.post(`${BASE_URL}`, task, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import LandingPage from './pages/LandingPage';
//import LoginDialog from './components/auth/LoginDialog';
//import RegisterDialog from './components/auth/RegisterDialog';
import TasksPage from './components/tasks/TasksPage'; // New tasks page
import BossesPage from './components/bosses/BossesPage'; // New bosses page
import DashboardPage from './pages/DashboardPage'; // New dashboard page

const App: React.FC = () =>
{
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/tasks" element={<TasksPage />} />
            </Routes>
        </Router>
    );
};

export default App;
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { useAuth } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';

import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <Routes>
            {/* Public routes */}
            <Route
                path="/"
                element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />}
            />

            <Route
                path="/login"
                element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
            />

            <Route
                path="/register"
                element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
            />

            <Route
                path="/forgot-password"
                element={<ForgotPasswordPage />}
            />

            {/* Protected routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/projects"
                element={
                    <ProtectedRoute>
                        <ProjectsPage />
                    </ProtectedRoute>
                }
            />

            {/* Unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
};

export default App;
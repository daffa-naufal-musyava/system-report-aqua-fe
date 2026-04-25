import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import LineDetail from '../pages/LineDetail';
import ScreenDelivery from '../pages/ScreenDelivery';
import ShiftSummary from '../pages/ShiftSummary';
import MachineDetail from '../pages/MachineDetail';
import MachineDetail1 from '../pages/MachineDetail1';
import Home from '../pages/Home';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    if (loading) return <div className="h-screen bg-[#0a0f1c] flex items-center justify-center text-white">Loading...</div>;
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoute = () => {
    const { user, loading } = useAuth();
    if (loading) return null;
    return !user ? <Outlet /> : <Navigate to="/" replace />;

};

export const router = createBrowserRouter([
    {
        element: <PublicRoute />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/login', element: <Login /> },
            { path: '/screen-delivery/:machineId', element: <ScreenDelivery /> },
            { path: '*', element: <Home /> },
        ]
    },
    {
        element: <ProtectedRoute />,
        children: [
            { path: '/dashboard', element: <Dashboard /> },
            { path: '/line/:lineId', element: <LineDetail /> },
            { path: '/shift-summary/:machineId', element: <ShiftSummary /> },
            { path: '/line-detail', element: <MachineDetail1 /> },
            { path: '/machine-detail/:machineId', element: <MachineDetail /> },
        ]
    },
]);
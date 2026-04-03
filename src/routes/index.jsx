import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import LineDetail from '../pages/LineDetail';
import ScreenDelivery from '../pages/ScreenDelivery';
import ShiftSummary from '../pages/ShiftSummary';
import MachineDetail from '../pages/MachineDetail';
import MachineDetail1 from '../pages/MachineDetail1';

const isAuthenticated = () => {
    return !!localStorage.getItem('isLoggedIn');
};


const ProtectedRoute = () => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/dashboard',
                element: <Dashboard />,
            },
            { 
                path: '/line/:lineId', 
                element: <LineDetail /> 
            },
            {
                path: '/screen-delivery/:machineId',
                element: <ScreenDelivery />,
            },
            {
                path: '/shift-summary/:machineId',
                element: <ShiftSummary />,
            },
            {
                path: '/line-detail',
                element: <MachineDetail1 />,
            },
            {
                path: '/machine-detail/:machineId',
                element: <MachineDetail />,
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
    },
]);
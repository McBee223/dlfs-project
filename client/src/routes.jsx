import { createBrowserRouter } from 'react-router-dom';
import LogIn from './pages/auth/LogIn'
import LogInPage from './pages/auth/LogInPage';

import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

import Dashboard from './pages/user/Dashboard';
import Items from './pages/user/Items';
import Profile from './pages/user/Profile';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminItemsManagement from './pages/admin/AdminItemsManagement';
import AdminProfile from './pages/admin/AdminProfile';

import NotFoundPage from './pages/NotFoundPage';

export const router = createBrowserRouter([
    { path: "/", element: <LogIn /> },
    { path: "/signin", element: <LogInPage /> },

    {
        path: "/user",
        element: <UserLayout />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: "dashboard", element: <Dashboard /> },
            { path: "items", element: <Items /> },
            { path: "profile", element: <Profile /> },
        ],
    },

    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            { index: true, element: <AdminDashboard /> },
            { path: "dashboard", element: <AdminDashboard /> },
            { path: "items_management", element: <AdminItemsManagement /> },
            { path: "items_management/lost", element: <AdminItemsManagement /> },
            { path: "items_management/claims", element: <AdminItemsManagement /> },
            { path: "items_management/approved", element: <AdminItemsManagement /> },
            { path: "items_management/rejected", element: <AdminItemsManagement /> },
            { path: "items_management/returned", element: <AdminItemsManagement /> },
            { path: "items_management/trash", element: <AdminItemsManagement /> },
            { path: "profile", element: <AdminProfile /> },
        ],
    },

    { path: "*", element: <NotFoundPage /> },
]);




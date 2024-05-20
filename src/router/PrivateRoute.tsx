import { Navigate, Outlet } from 'react-router-dom';


export const PrivateRoute = () => {
    if (sessionStorage.getItem("access_token")) {
        return <Outlet />
    } else {
        return <Navigate to="/login" replace />
    }
};
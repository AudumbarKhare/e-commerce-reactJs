import React from 'react';
import Layouts from '../_components/Layout';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const userDetails = localStorage.getItem("userDetails");
    return userDetails ? (
        <Layouts>
            <Outlet />
        </Layouts>
    ):(
        <Navigate to="/auth/login" />
    )
}

export default PrivateRoute;

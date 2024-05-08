import React from "react";
import { jwtDecode } from "jwt-decode";
import { Navigate, useParams } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const params = useParams();
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/" replace />;
    }
    const decodedToken = jwtDecode(token);
    const user = token ? decodedToken : null;

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (user.name !== params.name || user.roomId !== params.roomId) {
        localStorage.removeItem("token");
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '../auth/SessionProvider';
import { hasValidSession } from '../auth/session';

// Guards routes that need a login. Checks the stored session at render time (token present,
// JWT not expired, not idle for 15 minutes), so a direct visit after logout or after an idle
// period always goes back through /login.
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useSession();
    const location = useLocation();

    if (!isAuthenticated || !hasValidSession()) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;

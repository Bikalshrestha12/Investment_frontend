import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user || !allowedRoles.includes(user.role)) {

        return <Navigate to="/login" replace />;
    }


    return children;
};

export default ProtectedRoute;
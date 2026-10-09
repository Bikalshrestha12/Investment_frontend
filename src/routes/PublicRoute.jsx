import { Navigate } from 'react-router-dom';
import { useSession } from '../auth/SessionProvider';
import { hasValidSession } from '../auth/session';

// Keeps signed-in users away from /login. An idle or expired stored session does not count.
const PublicRoute = ({ children }) => {
    const { isAuthenticated, user } = useSession();

    if (isAuthenticated && hasValidSession()) {
        return <Navigate to={user?.role === 'admin' ? '/dashboard' : '/'} replace />;
    }

    return children;
};

export default PublicRoute;

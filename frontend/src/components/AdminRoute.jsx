import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
    const { admin } = useSelector((state) => state.auth);

    return admin ? <Outlet /> : <Navigate to='/admin' />;
};

export default AdminRoute;

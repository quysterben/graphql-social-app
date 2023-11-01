/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';

const AdminRouter = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user.role == 1 ? children : <Navigate to="/" />;
};

export default AdminRouter;

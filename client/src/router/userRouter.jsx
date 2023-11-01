/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';

const UserRouter = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user.role == 2 ? children : <Navigate to="/admin" />;
};

export default UserRouter;

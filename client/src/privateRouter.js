/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';

const PrivateRouter = ({ children }) => {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/signin" />;
};

export default PrivateRouter;

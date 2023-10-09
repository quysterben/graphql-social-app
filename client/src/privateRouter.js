/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';

const PrivateRouter = ({ children }) => {
  const loggedIn = localStorage.getItem('loggedIn');
  return loggedIn ? children : <Navigate to="/signin" />;
};

export default PrivateRouter;

import Proptypes from 'prop-types';

import { Navigate } from 'react-router-dom';

const UserRouter = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user.role == 'user' ? children : <Navigate to="/admin" />;
};

UserRouter.propTypes = {
  children: Proptypes.node
};

export default UserRouter;

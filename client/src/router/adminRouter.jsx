import Proptypes from 'prop-types';

import { Navigate } from 'react-router-dom';

const AdminRouter = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user.role == 'admin' ? children : <Navigate to="/" />;
};

AdminRouter.propTypes = {
  children: Proptypes.node
};

export default AdminRouter;

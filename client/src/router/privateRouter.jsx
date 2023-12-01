import Proptypes from 'prop-types';

import { Navigate } from 'react-router-dom';

const PrivateRouter = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? children : <Navigate to="/signin" />;
};

PrivateRouter.propTypes = {
  children: Proptypes.node
};

export default PrivateRouter;

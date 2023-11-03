import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PrivateRouter from './router/privateRouter';
import AdminRouter from './router/adminRouter';
import UserRouter from './router/userRouter';

import Signin from './pages/Signin';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import PostPage from './pages/Post';
import Search from './pages/Search';
import UserManagement from './pages/Admin/UserManagement';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/"
            element={
              <PrivateRouter>
                <UserRouter>
                  <Home />
                </UserRouter>
              </PrivateRouter>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <PrivateRouter>
                <UserRouter>
                  <Profile />
                </UserRouter>
              </PrivateRouter>
            }
          />

          <Route
            path="/post/:id"
            element={
              <PrivateRouter>
                <UserRouter>
                  <PostPage />
                </UserRouter>
              </PrivateRouter>
            }
          />
          <Route
            path="/search"
            element={
              <PrivateRouter>
                <UserRouter>
                  <Search />
                </UserRouter>
              </PrivateRouter>
            }
          />

          <Route
            path="/admin"
            element={
              <PrivateRouter>
                <AdminRouter>
                  <UserManagement />
                </AdminRouter>
              </PrivateRouter>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

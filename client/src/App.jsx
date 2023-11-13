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

import PostManagement from './pages/Admin/PostManagement';
import UserReportManagement from './pages/Admin/UserReportManagement';
import PostReportManagement from './pages/Admin/PostReportManagement';
import CommentReportManagement from './pages/Admin/CommentReportManagement';
import Messenger from './pages/Messenger';

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
            path="/messenger/:id"
            element={
              <PrivateRouter>
                <UserRouter>
                  <Messenger />
                </UserRouter>
              </PrivateRouter>
            }
          />
          <Route
            path="/messenger"
            element={
              <PrivateRouter>
                <UserRouter>
                  <Messenger />
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
          <Route
            path="/admin/post-management"
            element={
              <PrivateRouter>
                <AdminRouter>
                  <PostManagement />
                </AdminRouter>
              </PrivateRouter>
            }
          />
          <Route
            path="/admin/user-report-management"
            element={
              <PrivateRouter>
                <AdminRouter>
                  <UserReportManagement />
                </AdminRouter>
              </PrivateRouter>
            }
          />
          <Route
            path="/admin/post-report-management"
            element={
              <PrivateRouter>
                <AdminRouter>
                  <PostReportManagement />
                </AdminRouter>
              </PrivateRouter>
            }
          />
          <Route
            path="/admin/comment-report-management"
            element={
              <PrivateRouter>
                <AdminRouter>
                  <CommentReportManagement />
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

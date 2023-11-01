import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PrivateRouter from './privateRouter';

import Signin from './pages/Signin';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import PostPage from './pages/Post';
import Search from './pages/Search';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <PrivateRouter>
                <Home />
              </PrivateRouter>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <PrivateRouter>
                <Profile />
              </PrivateRouter>
            }
          />

          <Route
            path="/post/:id"
            element={
              <PrivateRouter>
                <PostPage />
              </PrivateRouter>
            }
          />
          <Route
            path="/search"
            element={
              <PrivateRouter>
                <Search />
              </PrivateRouter>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

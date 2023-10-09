import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PrivateRouter from './privateRouter';

import Signin from './pages/Signin';
import Home from './pages/Home';
import Signup from './pages/Signup';

function App() {
  return (
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;

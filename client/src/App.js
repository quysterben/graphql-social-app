import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PrivateRouter from './privateRouter';

import Signin from './pages/Signin';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<Signin />} />
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

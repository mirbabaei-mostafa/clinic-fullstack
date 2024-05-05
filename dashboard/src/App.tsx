import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login';

function App() {
  return (
    <div className="components">
      <BrowserRouter>
        <Routes>
          <Route element={<Login />} path="/" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

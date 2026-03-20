import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CameraUpload from './pages/CameraUpload';
import ScanHistory from './pages/ScanHistory';
import Login from './pages/Login';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/camera" element={<CameraUpload />} />
          <Route path="/history" element={<ScanHistory />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

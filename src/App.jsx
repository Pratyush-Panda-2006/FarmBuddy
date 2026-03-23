import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './utils/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import CameraUpload from './pages/CameraUpload';
import ScanHistory from './pages/ScanHistory';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Weather from './pages/Weather';
import ChatAssistant from './pages/ChatAssistant';
import FarmMap from './pages/FarmMap';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/camera" element={<CameraUpload />} />
            <Route path="/history" element={<ScanHistory />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/chat" element={<ChatAssistant />} />
            <Route path="/map" element={<FarmMap />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

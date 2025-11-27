import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Races from './pages/Races';
import Inscripcion from './pages/Inscripcion';
import RaceDetail from './pages/RaceDetail';
import AssistanceConfirmation from './pages/AssistanceConfirmation';
import Sorteo from './pages/Sorteo';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Navbar />
        <div className="app-content" style={{}}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/races" element={<Races />} />
            <Route path="/race-detail" element={<RaceDetail />} />
            <Route path="/inscripcion" element={<Inscripcion />} />
            <Route path="/assistance-confirmation" element={<AssistanceConfirmation />} />
            <Route path="/sorteo" element={<Sorteo />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;

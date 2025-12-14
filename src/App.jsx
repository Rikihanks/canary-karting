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
import Teams from './pages/Teams';
import TeamProfile from './pages/TeamProfile';
import FeatureDisabled from './pages/FeatureDisabled';
import { ConfigProvider } from './context/ConfigContext';
import FeatureGuard from './components/FeatureGuard';
import AdminDashboard from './pages/AdminDashboard';
import AdminGuard from './components/AdminGuard';

function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <HashRouter>
          <Navbar />
          <div className="app-content" style={{}}>
            <Routes>
              <Route path="/" element={
                <FeatureGuard feature="inscripcion">
                  <Inscripcion />
                </FeatureGuard>
              } />

              <Route path="/teams" element={
                <FeatureGuard feature="teams">
                  <Teams />
                </FeatureGuard>
              } />

              <Route path="/team-profile" element={
                <FeatureGuard feature="teams">
                  <TeamProfile />
                </FeatureGuard>
              } />
              <Route path="/profile" element={<Profile />} />

              <Route path="/races" element={
                <FeatureGuard feature="races">
                  <Races />
                </FeatureGuard>
              } />

              <Route path="/race-detail" element={
                <FeatureGuard feature="races">
                  <RaceDetail />
                </FeatureGuard>
              } />

              <Route path="/inscripcion" element={
                <FeatureGuard feature="inscripcion">
                  <Inscripcion />
                </FeatureGuard>
              } />

              <Route path="/assistance-confirmation" element={<AssistanceConfirmation />} />

              <Route path="/sorteo" element={
                <FeatureGuard feature="sorteo">
                  <Sorteo />
                </FeatureGuard>
              } />

              <Route path="/login" element={
                <FeatureGuard feature="login">
                  <Login />
                </FeatureGuard>
              } />

              <Route path="/admin" element={
                <AdminGuard>
                  <AdminDashboard />
                </AdminGuard>
              } />

              <Route path="/disabled" element={<FeatureDisabled />} />

            </Routes>
          </div>
        </HashRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;

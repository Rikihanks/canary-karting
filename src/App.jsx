import React, { useState } from 'react';
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
import Inscripcion_Academia from './pages/Inscripcion_Academia';
import FeatureDisabled from './pages/FeatureDisabled';
import { ConfigProvider } from './context/ConfigContext';
import FeatureGuard from './components/FeatureGuard';
import AdminDashboard from './pages/AdminDashboard';
import AdminGuard from './components/AdminGuard';
import MessageBanner from './components/MessageBanner';
import VoteDriver from './pages/VoteDriver';
import TeamDraw from './pages/TeamDraw';
import TeamDrawInput from './pages/TeamDrawInput';
import { onMessage } from 'firebase/messaging';
import { messaging } from './services/firebase';
import PWAInstallModal from './components/PWAInstallModal';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

function App() {
  React.useEffect(() => {
    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Mensaje en primer plano recibido:', payload);

        // Mostrar notificación del navegador en primer plano
        if (Notification.permission === 'granted') {
          new Notification(payload.notification?.title || 'Canary Karting', {
            body: payload.notification?.body || 'Nuevo mensaje',
            icon: '/icons/512.png'
          });
        }
      });
      return () => unsubscribe();
    }
  }, []);

  return (
    <ConfigProvider>
      <AuthProvider>
        <HashRouter>
          <ScrollToTop />
          <header className="app-header">
            <Navbar />
            <MessageBanner />
          </header>
          <PWAInstallModal />
          <div className="app-main-wrapper">
            <div className="app-content">
              <Routes>
                <Route path="/clasificacion" element={<Home />} />
                <Route path="/" element={
                  <FeatureGuard feature="inscripcion">
                    <Inscripcion_Academia />
                  </FeatureGuard>
                } />
                <Route path="/inscripcion" element={
                  <FeatureGuard feature="inscripcion">
                    {/*<Inscripcion />*/}
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

                <Route path="/assistance-confirmation" element={<AssistanceConfirmation />} />

                <Route path="/sorteo" element={
                  <FeatureGuard feature="sorteo">
                    <Sorteo />
                  </FeatureGuard>
                } />

                <Route path="/sorteo-equipo" element={
                  <FeatureGuard feature="sorteo">
                    <TeamDraw />
                  </FeatureGuard>
                } />

                <Route path="/team-draw-input" element={
                  <FeatureGuard feature="sorteo">
                    <TeamDrawInput />
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

                <Route path="/votar" element={<VoteDriver />} />

                <Route path="/disabled" element={<FeatureDisabled />} />

              </Routes>
            </div>
          </div>
        </HashRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;

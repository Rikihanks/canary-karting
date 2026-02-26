import React, { useState, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import { ConfigProvider } from './context/ConfigContext';
import FeatureGuard from './components/FeatureGuard';
import AdminGuard from './components/AdminGuard';
import MessageBanner from './components/MessageBanner';
import MaintenanceGuard from './components/MaintenanceGuard';
import { onMessage } from 'firebase/messaging';
import { messaging } from './services/firebase';
import PWAInstallModal from './components/PWAInstallModal';
import ScrollToTop from './components/ScrollToTop';
import TelemetryTracker from './components/TelemetryTracker';
import { usePWAInstallStatus } from './hooks/usePWAInstallStatus';
import SwipeNavigation from './components/SwipeNavigation';
import './App.css';

// Lazy loading pages
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const Races = lazy(() => import('./pages/Races'));
const Inscripcion = lazy(() => import('./pages/Inscripcion'));
const RaceDetail = lazy(() => import('./pages/RaceDetail'));
const AssistanceConfirmation = lazy(() => import('./pages/AssistanceConfirmation'));
const Sorteo = lazy(() => import('./pages/Sorteo'));
const Login = lazy(() => import('./pages/Login'));
const Teams = lazy(() => import('./pages/Teams'));
const TeamProfile = lazy(() => import('./pages/TeamProfile'));
const Inscripcion_Academia = lazy(() => import('./pages/Inscripcion_Academia'));
const FeatureDisabled = lazy(() => import('./pages/FeatureDisabled'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminResults = lazy(() => import('./pages/AdminResults'));
const AdminResultsV3 = lazy(() => import('./pages/AdminResultsV3'));
const AdminDatabaseV3 = lazy(() => import('./pages/AdminDatabaseV3'));
const AdminEntityManagerV3 = lazy(() => import('./pages/AdminEntityManagerV3'));
const VoteDriver = lazy(() => import('./pages/VoteDriver'));
const TeamDraw = lazy(() => import('./pages/TeamDraw'));
const InstallApp = lazy(() => import('./pages/InstallApp'));
const TeamDrawInput = lazy(() => import('./pages/TeamDrawInput'));
const Settings = lazy(() => import('./pages/Settings'));
const News = lazy(() => import('./pages/News'));

const RootRoute = () => {
  const isInstalled = usePWAInstallStatus();

  if (!isInstalled) {
    return <InstallApp />;
  }

  return (
    <FeatureGuard feature="inscripcion">
      <Home />
    </FeatureGuard>
  );
};

const LoadingFallback = () => (
  <div className="container" style={{ textAlign: 'center', color: '#94a3b8', paddingTop: '50px' }}>
    <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2em' }}></i>
  </div>
);

function App() {
  React.useEffect(() => {
    localStorage.removeItem('ck_reveals');
    localStorage.removeItem('dotd_results_cache');
    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Mensaje en primer plano recibido:', payload);

        // Mostrar notificación del navegador en primer plano
        const isAppDisabled = localStorage.getItem('app_notifications_disabled') === 'true';
        if (Notification.permission === 'granted' && !isAppDisabled) {
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
        <MaintenanceGuard>
          <HashRouter>
            <SwipeNavigation />
            <TelemetryTracker />
            <ScrollToTop />
            <header className="app-header">
              <Navbar />
              <MessageBanner />
            </header>
            <PWAInstallModal />
            <div className="app-main-wrapper">
              <div className="app-content">
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/clasificacion" element={<Home />} />
                    <Route path="/" element={<RootRoute />} />
                    <Route path="/inscripcion-academia" element={
                      <FeatureGuard feature="inscripcion-academia">
                        <Inscripcion_Academia />
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
                      <AdminGuard>
                        <Sorteo />
                      </AdminGuard>
                    } />

                    <Route path="/sorteo-equipo" element={
                      <AdminGuard>
                        <TeamDraw />
                      </AdminGuard>
                    } />

                    <Route path="/team-draw-input" element={
                      <AdminGuard>
                        <TeamDrawInput />
                      </AdminGuard>
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

                    <Route path="/admin-results" element={
                      <AdminGuard>
                        <AdminResults />
                      </AdminGuard>
                    } />

                    <Route path="/admin-results-v3" element={
                      <AdminGuard>
                        <AdminResultsV3 />
                      </AdminGuard>
                    } />

                    <Route path="/admin-db" element={
                      <AdminGuard>
                        <AdminDatabaseV3 />
                      </AdminGuard>
                    } />

                    <Route path="/admin-entities" element={
                      <AdminGuard>
                        <AdminEntityManagerV3 />
                      </AdminGuard>
                    } />

                    <Route path="/votar" element={<VoteDriver />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/configuracion" element={<Settings />} />

                    <Route path="/disabled" element={<FeatureDisabled />} />
                    <Route path="/install" element={<InstallApp />} />

                  </Routes>
                </Suspense>
              </div>
            </div>
          </HashRouter>
        </MaintenanceGuard>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;

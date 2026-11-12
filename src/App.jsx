import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import PublicLayout from './layouts/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/public/Home.jsx';
import About from './pages/public/About.jsx';
import How from './pages/public/How.jsx';
import Departments from './pages/public/Departments.jsx';
import Contact from './pages/public/Contact.jsx';
import FAQ from './pages/public/FAQ.jsx';
import AuthPage from './pages/auth/AuthPage.jsx';
import Track from './pages/public/Track.jsx';
import Submitted from './pages/citizen/Submitted.jsx';
import Submit from './pages/citizen/Submit.jsx';
import Citizen from './pages/citizen/Citizen.jsx';
import Detail from './pages/shared/Detail.jsx';
import Cmo from './pages/cmo/Cmo.jsx';
import Officer from './pages/officer/Officer.jsx';

export default function App() {
  const initialize = useAuthStore((s) => s.initialize);
  useEffect(() => {
    initialize();
  }, [initialize]);
  return (
    <PublicLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<How />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage register />} />
        <Route path="/track" element={<Track />} />
        <Route path="/submitted" element={<Submitted />} />
        <Route
          path="/submit"
          element={
            <ProtectedRoute roles={['citizen']}>
              <Submit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen"
          element={
            <ProtectedRoute roles={['citizen']}>
              <Citizen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cmo"
          element={
            <ProtectedRoute roles={['cmo']}>
              <Cmo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer"
          element={
            <ProtectedRoute roles={['officer']}>
              <Officer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grievances/:id"
          element={
            <ProtectedRoute roles={['citizen', 'cmo', 'officer']}>
              <Detail />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </PublicLayout>
  );
}

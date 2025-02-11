import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Events from './pages/events/Events';
import CreateEvent from './pages/events/CreateEvent';
import Announcements from './pages/announcements/Announcements';
import EventRegistrations from './pages/registrations/EventRegistrations';
import ProtectedRoute from './components/ProtectedRoute';
import EditEvent from './pages/events/EditEvent';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster/>
        <Routes>
          <Route path="/auth" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/events" element={<Events />} />
            <Route path="/admin/events/create" element={<CreateEvent />} />
            <Route path='/admin/events/:eventId/edit' element={<EditEvent />} />
            <Route path="/admin/announcements" element={<Announcements />} />
            <Route path="/admin/events/:eventId/registrations" element={<EventRegistrations />} />
            {/* <Route path="/admin/registrations" element={<Registrations />} /> */}
          </Route>

          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
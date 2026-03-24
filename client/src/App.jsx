
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ClientDashboard from './pages/client/ClientDashboard';
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import MyTrainings from './pages/client/MyTrainings';
import Nutrition from './pages/client/Nutrition';
import Progress from './pages/client/Progress';
import FindTrainer from './pages/client/FindTrainer';
import TrainerProfile from './pages/client/TrainerProfile';
import ManageTrainings from './pages/trainer/ManageTrainings';
import MyClients from './pages/trainer/MyClients';
import CreateTraining from './pages/trainer/CreateTraining';
import Library from './pages/shared/Library';
import Chat from './pages/shared/Chat';
import Profile from './pages/shared/Profile';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/client/dashboard" element={
            <PrivateRoute allowedRoles={['client']}><ClientDashboard /></PrivateRoute>
          } />
          <Route path="/client/trainings" element={
            <PrivateRoute allowedRoles={['client']}><MyTrainings /></PrivateRoute>
          } />
          <Route path="/client/nutrition" element={
            <PrivateRoute allowedRoles={['client']}><Nutrition /></PrivateRoute>
          } />
          <Route path="/client/progress" element={
            <PrivateRoute allowedRoles={['client']}><Progress /></PrivateRoute>
          } />
          <Route path="/client/find-trainer" element={
            <PrivateRoute allowedRoles={['client']}><FindTrainer /></PrivateRoute>
          } />
          <Route path="/client/trainer/:id" element={
            <PrivateRoute allowedRoles={['client']}><TrainerProfile /></PrivateRoute>
          } />
          
          <Route path="/trainer/dashboard" element={
            <PrivateRoute allowedRoles={['trainer']}><TrainerDashboard /></PrivateRoute>
          } />
          <Route path="/trainer/trainings" element={
            <PrivateRoute allowedRoles={['trainer']}><ManageTrainings /></PrivateRoute>
          } />
          <Route path="/trainer/clients" element={
            <PrivateRoute allowedRoles={['trainer']}><MyClients /></PrivateRoute>
          } />
          <Route path="/trainer/create" element={
            <PrivateRoute allowedRoles={['trainer']}><CreateTraining /></PrivateRoute>
          } />
          <Route path="/trainer/edit/:id" element={
            <PrivateRoute allowedRoles={['trainer']}><CreateTraining /></PrivateRoute>
          } />
          
          <Route path="/library" element={
            <PrivateRoute><Library /></PrivateRoute>
          } />
          <Route path="/chat" element={
            <PrivateRoute><Chat /></PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute><Profile /></PrivateRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

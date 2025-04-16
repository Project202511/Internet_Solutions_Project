import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskDetails from './pages/TaskDetails';
import GroupDetails from './pages/GroupDetails';
import Header from './components/layout/Header';
import ProtectedRoute from './components/auth/ProtetctedRoute';
/// App is the function that will help us to route on different pages 
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
              // this is the route to dashboard
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
              //this is the route to our tasks with the specfic task id
                path="/tasks/:id" 
                element={
                  <ProtectedRoute>
                    <TaskDetails />
                  </ProtectedRoute>
                } 
              />

              <Route
              // this is the route to a group with the specfic group id
                path="/groups/:id" 
                element={
                  <ProtectedRoute>
                    <GroupDetails />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
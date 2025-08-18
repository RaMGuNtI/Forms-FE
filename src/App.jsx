import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateForm from './pages/CreateForm';
import FillForm from './pages/FillForm';
import Responses from './pages/Responses';
import { getToken } from './services/auth';

const PrivateRoute = ({ children }) => {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreateForm />
            </PrivateRoute>
          }
        />
        <Route path="/fillforms/:formId/fill" element={<FillForm />} />
        <Route
          path="/responses/:formId"
          element={
            <PrivateRoute>
              <Responses />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

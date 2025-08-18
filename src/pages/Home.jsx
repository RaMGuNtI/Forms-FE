import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { getToken } from '../services/auth';
import { Navigate } from 'react-router-dom';
export default function Home() {
  const token = getToken();
  if (token != undefined) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome — Forms App</h1>
      <p className="home-subtitle">Create and share forms quickly.</p>
      <div className="home-buttons">
        <Link to="/register" className="btn btn-primary">
          Register
        </Link>
        <Link to="/login" className="btn btn-outline">
          Login
        </Link>
      </div>
    </div>
  );
}

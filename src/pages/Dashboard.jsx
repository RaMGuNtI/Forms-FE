import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { clearToken } from '../services/auth';
import './Dashboard.css';

export default function Dashboard() {
  const [forms, setForms] = useState([]);
  const [message, setMessage] = useState('');

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => {
      setMessage('');
    }, 2000);
  };
  const nav = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const { data } = await api.get('/api/forms/my');
      setForms(data);
    } catch (err) {
      alert('Failed to load forms', err);
    }
  };

  const logout = () => {
    clearToken();
    nav('/login');
  };

  const deleteForm = async (formId) => {
    if (!window.confirm('Are you sure you want to delete this form?')) return;

    try {
      await api.delete(`/api/forms/${formId}`);
      alert('Form deleted ✅');
      setForms(forms.filter((f) => f.formId !== formId)); 
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const copy = (formId) => {
    navigator.clipboard.writeText(`https://forms-fe-pi.vercel.app/fillforms/${formId}/fill`).then(() => {});
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h2>📋 My Forms</h2>
        <div className="action-buttons">
          <Link to="/create" className="btn btn-primary">
            ➕ Create Form
          </Link>
          <button onClick={logout} className="btn btn-danger">
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Form List */}
      <div className="form-grid">
        {forms.length === 0 && (
          <p className="empty-message">
            No forms yet. Click "Create Form" to start one! 🚀
          </p>
        )}

        {forms.map((f,idx) => (
          <div key={f._id} className="form-card">
            <div className="form-info">
              <h3>{f.title}</h3>
              <p>ID: {f.formId}</p>
            </div>
            <div className="form-actions">
              <a
                href={`/fillforms/${f.formId}/fill`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-success btn-sm"
                data-testid={'open-'+idx}
              >
                Open
              </a>
              <Link
                to={`/responses/${f.formId}`}
                className="btn btn-info btn-sm"
                data-testid={'responses-'+idx}
              >
                Responses
              </Link>
            </div>
            <button onClick={() => deleteForm(f._id)}>Delete Form</button>
            <button
              onClick={() => {
                copy(f.formId);
                showMessage('URL copied to ClipBoard');
              }}
              className=""
                data-testid={'copy-'+idx}
            >
              Copy Form URL
            </button>
          </div>
        ))}
      </div>
      {message && <div className="toast">{message}</div>}
    </div>
  );
}

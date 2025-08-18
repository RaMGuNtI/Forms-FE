import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import './Responses.css';

export default function Responses() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const { data } = await api.get(`/api/responses/${formId}`);
      setForm(data.form);
      setResponses(data.responses);
    } catch (err) {
      alert('Failed to load responses', err);
    }
  };

  return (
    <div className="responses-container">
      {form && (
        <h2 className="responses-title">Responses for "{form.title}"</h2>
      )}
      {responses.length === 0 && <p>No responses yet.</p>}

      <div className="responses-list">
        {responses.map((r) => (
          <div key={r._id} className="response-card">
            <div className="response-date">
              📅 {new Date(r.submittedAt).toLocaleString()}
            </div>
            <div className="response-answers">
              {r.answers.map((a, idx) => (
                <div key={idx} className="response-item">
                  <strong>{form.questions[idx]?.label || 'Unknown'}:</strong>{' '}
                  {a.answer}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

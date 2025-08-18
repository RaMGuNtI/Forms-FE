import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './FillForm.css';

export default function FillForm() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const nav = useNavigate();

  useEffect(() => {
    fetchForm();
  }, []);

  const fetchForm = async () => {
    try {
      const { data } = await api.get(`/api/fills/${formId}`);
      setForm(data);
    } catch (err) {
      alert('Form not found');
      nav('/');
    }
  };

  const handleChange = (questionId, value, type) => {
    setAnswers((prev) => {
      if (type === 'checkbox') {
        const current = prev[questionId] || [];
        if (current.includes(value)) {
          return { ...prev, [questionId]: current.filter((v) => v !== value) };
        }
        return { ...prev, [questionId]: [...current, value] };
      }
      return { ...prev, [questionId]: value };
    });
  };

  const submit = async () => {
    try {
      const payload = {
        answers: Object.entries(answers).map(([k, v]) => ({
          questionId: k,
          answer: v,
        })),
      };
      await api.post(`/api/fills/${formId}`, payload);
      alert('✅ Submitted. Thank you!');
      nav('/');
    } catch (err) {
      alert('❌ Failed to submit');
    }
  };

  if (!form) return <div className="form-container">Loading...</div>;

  return (
    <div className="form-container">
      <h2 className="form-title">{form.title}</h2>
      <div className="form-questions">
        {form.questions.map((q, idx) => (
          <div key={idx} className="form-question">
            <label className="question-label">{q.label}</label>

            {/* Text Input */}
            {q.type === 'text' && (
              <input
                className="form-input"
                onChange={(e) =>
                  handleChange(q.id || idx, e.target.value, 'text')
                }
                placeholder="Answer Here"
              />
            )}

            {/* Textarea */}
            {q.type === 'textarea' && (
              <textarea
                className="form-input"
                onChange={(e) =>
                  handleChange(q.id || idx, e.target.value, 'textarea')
                }
              />
            )}

            {/* Radio Buttons */}
            {q.type === 'radio' &&
              q.options?.map((opt, i) => (
                <label key={i} className="option-label">
                  <input
                    type="radio"
                    name={`q_${idx}`}
                    value={opt}
                    onChange={(e) =>
                      handleChange(q.id || idx, e.target.value, 'radio')
                    }
                  />
                  {opt}
                </label>
              ))}

            {/* Checkbox */}
            {q.type === 'checkbox' &&
              q.options?.map((opt, i) => (
                <label key={i} className="option-label">
                  <input
                    type="checkbox"
                    value={opt}
                    onChange={(e) =>
                      handleChange(q.id || idx, e.target.value, 'checkbox')
                    }
                  />
                  {opt}
                </label>
              ))}
          </div>
        ))}
      </div>

      <div className="submit-section">
        <button onClick={submit} className="btn btn-primary">
          Submit
        </button>
      </div>
    </div>
  );
}

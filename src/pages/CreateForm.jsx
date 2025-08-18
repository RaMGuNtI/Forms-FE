import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './CreateForm.css';
export default function CreateForm() {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const nav = useNavigate();

  const addQuestion = () =>
    setQuestions((prev) => [
      ...prev,
      { id: Date.now(), label: '', type: 'text', options: [] },
    ]);

  const updateQ = (idx, key, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, [key]: value } : q))
    );
  };

  const addOption = (idx) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === idx ? { ...q, options: [...q.options, ''] } : q
      )
    );
  };

  const updateOption = (qIdx, optIdx, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIdx
          ? {
              ...q,
              options: q.options.map((opt, oi) =>
                oi === optIdx ? value : opt
              ),
            }
          : q
      )
    );
  };

  const removeOption = (qIdx, optIdx) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.filter((_, oi) => oi !== optIdx) }
          : q
      )
    );
  };

  const submit = async () => {
    try {
      const payload = { title, questions };
      await api.post('/api/forms', payload);
      alert('Form created');
      nav('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const deleteQuestion = (idx) => {
    setQuestions((prev) => {
      return prev.filter((e, id) => id != idx);
    });
  };

  return (
    <div className="form-container">
      <h2>Create Form</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Form title"
        className="input mb-4"
      />
      <div>
        {questions.map((q, idx) => (
          <div key={q.id} className="question-card">
            <input
              value={q.label}
              onChange={(e) => updateQ(idx, 'label', e.target.value)}
              placeholder="Question label"
              className="input mb-2"
            />
            <select
              value={q.type}
              onChange={(e) => updateQ(idx, 'type', e.target.value)}
              className="input mb-2"
            >
              <option value="text">Text</option>
              <option value="textarea">Textarea</option>
              <option value="radio">Radio</option>
              <option value="checkbox">Checkbox</option>
            </select>

            {(q.type === 'radio' || q.type === 'checkbox') && (
              <div className="options-section">
                <p>Options:</p>
                {q.options.map((opt, optIdx) => (
                  <div key={optIdx} className="option-row">
                    <input
                      value={opt}
                      onChange={(e) =>
                        updateOption(idx, optIdx, e.target.value)
                      }
                      placeholder={`Option ${optIdx + 1}`}
                      className="input option-input"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(idx, optIdx)}
                      className="btn btn-danger"
                    >
                      ❌
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(idx)}
                  className="btn btn-secondary"
                >
                  ➕ Add Option
                </button>
              </div>
            )}
            <button className="btn addq" onClick={() => deleteQuestion(idx)}>
              Delete Question
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={addQuestion} className="btn addq">
          Add Question
        </button>
        <button onClick={submit} className="btn btn-primary">
          Create
        </button>
      </div>
    </div>
  );
}

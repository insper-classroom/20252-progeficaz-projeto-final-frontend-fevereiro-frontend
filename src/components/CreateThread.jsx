import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forumAPI } from '../services/api';
import './CreateThread.css';

const CreateThread = () => {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const response = await forumAPI.createThread(title);
      navigate(`/thread/${response.data.id}`);
    } catch (err) {
      console.error('Error creating thread:', err);
      alert('Failed to create thread');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-thread">
      <div className="create-thread-header">
        <Link to="/" className="back-link">← Back to Threads</Link>
        <h1>Create New Thread</h1>
      </div>

      <form onSubmit={handleSubmit} className="create-thread-form">
        <div className="form-group">
          <label htmlFor="title">Thread Title: *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter thread title..."
            required
            maxLength="200"
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={submitting || !title.trim()}>
            {submitting ? 'Creating...' : 'Create Thread'}
          </button>
          <Link to="/" className="cancel-btn">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default CreateThread;
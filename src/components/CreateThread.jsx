import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forumAPI } from '../services/api';
import './CreateThread.css';

const CreateThread = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      console.log('Creating thread with data:', { title, description });
      const response = await forumAPI.createThread(title, description);
      console.log('Thread created successfully:', response.data);
      navigate(`/thread/${response.data.id}`);
    } catch (err) {
      console.error('Error creating thread:', err);
      console.error('Error details:', err.response?.data);
      alert(`Failed to create thread: ${err.response?.data?.message || err.message}`);
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

        <div className="form-group">
          <label htmlFor="description">Description (optional):</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of what this thread is about..."
            maxLength="500"
            rows="3"
          />
          <div className={`character-count ${description.length > 450 ? 'character-count-warning' : ''}`}>
            {description.length}/500 characters
          </div>
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
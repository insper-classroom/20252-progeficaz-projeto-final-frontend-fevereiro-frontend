import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { forumAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import { formatDate } from '../utils/helpers';
import './ThreadList.css';

const ThreadList = () => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await forumAPI.getThreads();
        setThreads(response.data);
      } catch (err) {
        setError('Failed to load threads');
        console.error('Error fetching threads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, []);

  if (loading) return <LoadingSpinner message="Loading threads..." />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="thread-list">
      <div className="thread-list-header">
        <h2>Forum Threads</h2>
        <Link to="/create" className="create-thread-btn">
          Create New Thread
        </Link>
      </div>
      
      {threads.length === 0 ? (
        <div className="no-threads">
          <p>No threads yet. Be the first to create one!</p>
          <Link to="/create" className="create-thread-btn">
            Create Thread
          </Link>
        </div>
      ) : (
        <div className="threads">
          {threads.map(thread => (
            <div key={thread.id} className="thread-item">
              <Link to={`/thread/${thread.id}`} className="thread-link">
                <h3 className="thread-title" title={thread.title}>
                  {thread.title}
                </h3>
                <p className="thread-date">
                  Created: {formatDate(thread.created_at, true)}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThreadList;
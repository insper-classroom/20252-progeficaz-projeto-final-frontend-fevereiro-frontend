import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { forumAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import { formatDate, formatDateTime } from '../utils/helpers';
import './ThreadDetail.css';

const ThreadDetail = () => {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState({ author: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const response = await forumAPI.getThread(id);
        setThread(response.data);
      } catch (err) {
        setError('Failed to load thread');
        console.error('Error fetching thread:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchThread();
  }, [id]);

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!newPost.content.trim()) return;

    setSubmitting(true);
    try {
      const response = await forumAPI.createPost(
        id,
        newPost.author || 'Anonymous',
        newPost.content
      );
      
      // Add the new post to the thread
      setThread(prev => ({
        ...prev,
        posts: [...prev.posts, response.data]
      }));
      
      // Reset form
      setNewPost({ author: '', content: '' });
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading thread..." />;
  if (error) return <div className="error">{error}</div>;
  if (!thread) return <div className="error">Thread not found</div>;

  return (
    <div className="thread-detail">
      <div className="thread-header">
        <Link to="/" className="back-link">← Back to Threads</Link>
        <h1 className="thread-title">{thread.title}</h1>
        <p className="thread-date">
          Created: {formatDate(thread.created_at)}
        </p>
      </div>

      <div className="posts">
        {thread.posts && thread.posts.length > 0 ? (
          thread.posts.map(post => (
            <div key={post.id} className="post">
              <div className="post-header">
                <span className="post-author">{post.author}</span>
                <span className="post-date">
                  {formatDateTime(post.created_at)}
                </span>
              </div>
              <div className="post-content">{post.content}</div>
            </div>
          ))
        ) : (
          <div className="no-posts">
            <p>No posts yet. Be the first to reply!</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmitPost} className="post-form">
        <h3>Reply to Thread</h3>
        <div className="form-group">
          <label htmlFor="author">Your Name (optional):</label>
          <input
            type="text"
            id="author"
            value={newPost.author}
            onChange={(e) => setNewPost(prev => ({ ...prev, author: e.target.value }))}
            placeholder="Anonymous"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Message: *</label>
          <textarea
            id="content"
            value={newPost.content}
            onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Write your reply..."
            required
            rows="4"
          />
        </div>
        <button type="submit" disabled={submitting || !newPost.content.trim()}>
          {submitting ? 'Posting...' : 'Post Reply'}
        </button>
      </form>
    </div>
  );
};

export default ThreadDetail;
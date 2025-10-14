import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import FilterDisplay from './FilterDisplay';
import { forumAPI } from '../services/api';
import './ThreadDetail.css';

const ThreadDetail = () => {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState({ author: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchThread();
  }, [id]);

  const fetchThread = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching thread with ID:', id);
      const response = await forumAPI.getThread(id);
      console.log('API Response:', response.data);
      
      // Handle different possible response structures
      if (response.data.thread && response.data.posts) {
        // Structure: { thread: {...}, posts: [...] }
        setThread(response.data.thread);
        setPosts(response.data.posts || []);
      } else if (response.data.id) {
        // Structure: thread data directly in response.data
        setThread(response.data);
        setPosts(response.data.posts || []);
      } else {
        throw new Error('Invalid response structure');
      }
      
    } catch (error) {
      console.error('Error fetching thread:', error);
      
      if (error.response?.status === 404) {
        setError('Pergunta não encontrada');
      } else if (error.response?.status === 500) {
        setError('Erro interno do servidor. Tente novamente mais tarde.');
      } else {
        setError(error.response?.data?.error || 'Erro ao carregar a pergunta');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    
    if (!newPost.author.trim() || !newPost.content.trim()) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    try {
      setSubmitting(true);
      await forumAPI.createPost(id, newPost.author.trim(), newPost.content.trim());
      setNewPost({ author: '', content: '' });
      await fetchThread(); // Reload to get new post
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Erro ao criar resposta. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div>Carregando...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error">
        <h2>Erro</h2>
        <p>{error}</p>
        <Link to="/" className="back-link">← Voltar para o fórum</Link>
      </div>
    );
  }
  
  if (!thread) {
    return (
      <div className="error">
        <h2>Pergunta não encontrada</h2>
        <p>A pergunta que você está procurando não existe ou foi removida.</p>
        <Link to="/" className="back-link">← Voltar para o fórum</Link>
      </div>
    );
  }

  return (
    <div className="thread-detail">
      <div className="thread-header">
        <Link to="/" className="back-link">← Voltar para o fórum</Link>
        <h1 className="thread-title">{thread.title}</h1>
        
        {thread.description && (
          <div className="thread-description">
            <p>{thread.description}</p>
          </div>
        )}
        
        {/* Display filters below description */}
        <FilterDisplay filters={{
          semester: thread.semester,
          courses: thread.courses,
          subjects: thread.subjects
        }} />
      </div>

      <div className="posts-section">
        <h2>Respostas ({posts.length})</h2>
        
        {posts.length > 0 ? (
          <div className="posts-list">
            {posts.map(post => (
              <div key={post.id} className="post">
                <div className="post-header">
                  <strong>{post.author}</strong>
                  <span className="post-date">
                    {new Date(post.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="post-content">
                  {post.content}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-posts">
            Ainda não há respostas para esta pergunta. Seja o primeiro a responder!
          </div>
        )}
      </div>

      <div className="new-post-section">
        <h3>Adicionar Resposta</h3>
        <form onSubmit={handleSubmitPost} className="new-post-form">
          <div className="form-group">
            <label>Seu nome:</label>
            <input
              type="text"
              value={newPost.author}
              onChange={(e) => setNewPost(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Digite seu nome"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Sua resposta:</label>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Digite sua resposta"
              rows="6"
              required
            />
          </div>
          
          <button type="submit" disabled={submitting} className="submit-btn">
            {submitting ? 'Enviando...' : 'Enviar Resposta'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ThreadDetail;
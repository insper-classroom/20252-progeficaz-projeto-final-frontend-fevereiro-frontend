import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import FilterDisplay from './FilterDisplay';
import { forumAPI } from '../services/api';
import { extractErrorMessage } from '../utils/restfulHelpers';
// Importar serviço de moderação
import { verificarConteudo } from '../services/moderationService';
import './ThreadDetail.css';

const ThreadDetail = () => {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState({ author: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  // Estado para mensagem de moderação
  const [moderationWarning, setModerationWarning] = useState(null);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching thread with ID:', id);
        const response = await forumAPI.getThread(id);
        console.log('API Response:', response.data);
        
        // The API service now normalizes the response structure
        if (response.data.thread && response.data.posts) {
          // Normalized structure from API service
          setThread(response.data.thread);
          setPosts(response.data.posts);
        } else {
          throw new Error('Invalid response structure received from API');
        }
        
      } catch (error) {
        console.error('Error fetching thread:', error);
        
        // Use utility function for consistent error handling
        setError(extractErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchThread();
  }, [id]);

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    
    if (!newPost.author.trim() || !newPost.content.trim()) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    try {
      setSubmitting(true);
      setModerationWarning(null); // Limpar avisos anteriores

      // ====== MODERAÇÃO DE CONTEÚDO ======
      // Verificar conteúdo da resposta antes de enviar
      console.log('🔍 Verificando resposta com moderação...');
      
      const resultadoModeracao = await verificarConteudo(newPost.content);

      // Se o conteúdo foi rejeitado, bloquear envio
      if (!resultadoModeracao.aprovado) {
        console.warn('⚠️ Resposta bloqueada pela moderação');
        
        // Mostrar mensagem de aviso
        setModerationWarning({
          mensagem: resultadoModeracao.mensagem || 
                   'Sua resposta contém conteúdo impróprio e não pode ser publicada.'
        });
        
        setSubmitting(false);
        return; // Impedir envio
      }

      console.log('✅ Resposta aprovada pela moderação');
      // ====== FIM DA MODERAÇÃO ======

      const response = await forumAPI.createPost(id, newPost.author.trim(), newPost.content.trim());
      console.log('Post created:', response.data);
      
      setNewPost({ author: '', content: '' });
      
      // Reload the thread to get the new post
      const threadResponse = await forumAPI.getThread(id);
      if (threadResponse.data.thread && threadResponse.data.posts) {
        setThread(threadResponse.data.thread);
        setPosts(threadResponse.data.posts);
      }
      
    } catch (error) {
      console.error('Error creating post:', error);
      
      // Use utility function for consistent error handling
      alert(extractErrorMessage(error));
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

        {/* Mensagem de aviso de moderação */}
        {moderationWarning && (
          <div className="moderation-warning">
            <div className="moderation-warning-icon">⚠️</div>
            <div className="moderation-warning-content">
              <strong>Resposta Bloqueada</strong>
              <p>{moderationWarning.mensagem}</p>
              <p className="moderation-hint">
                Por favor, revise sua resposta e remova qualquer conteúdo impróprio antes de tentar novamente.
              </p>
            </div>
          </div>
        )}

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
              onChange={(e) => {
                setNewPost(prev => ({ ...prev, content: e.target.value }));
                // Limpar aviso ao editar
                if (moderationWarning) {
                  setModerationWarning(null);
                }
              }}
              placeholder="Digite sua resposta"
              rows="6"
              required
            />
          </div>
          
          <button type="submit" disabled={submitting} className="submit-btn">
            {submitting ? 'Verificando e enviando...' : 'Enviar Resposta'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ThreadDetail;
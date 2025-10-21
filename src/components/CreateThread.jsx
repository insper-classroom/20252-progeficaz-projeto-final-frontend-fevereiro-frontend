import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import QuestionFilters from './QuestionFilters';
import { forumAPI } from '../services/api';
import { extractErrorMessage } from '../utils/restfulHelpers';
// Importar serviço de moderação
import { verificarMultiplosCampos } from '../services/moderationService';
import './CreateThread.css';

const CreateThread = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filters, setFilters] = useState({
    semester: null,
    courses: [],
    subjects: []
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  // Estado para mensagem de moderação
  const [moderationWarning, setModerationWarning] = useState(null);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Clear filter errors when user makes changes
    const filterErrors = ['semester', 'subjects'];
    const clearedErrors = { ...errors };
    filterErrors.forEach(key => {
      if (clearedErrors[key]) {
        delete clearedErrors[key];
      }
    });
    setErrors(clearedErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    
    if (!filters.semester) {
      newErrors.semester = 'Semestre é obrigatório';
    }
    
    if (!filters.subjects || filters.subjects.length === 0) {
      newErrors.subjects = 'Pelo menos uma matéria deve ser selecionada';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setModerationWarning(null); // Limpar avisos anteriores
    
    try {
      // ====== MODERAÇÃO DE CONTEÚDO ======
      // Verificar título e descrição antes de enviar
      console.log('🔍 Verificando conteúdo com moderação...');
      
      const resultadoModeracao = await verificarMultiplosCampos({
        titulo: title,
        descricao: description
      });

      // Se o conteúdo foi rejeitado, bloquear envio
      if (!resultadoModeracao.aprovado) {
        console.warn('⚠️ Conteúdo bloqueado pela moderação');
        
        // Mostrar mensagem de aviso
        setModerationWarning({
          campo: resultadoModeracao.campoRejeitado,
          mensagem: resultadoModeracao.mensagem
        });
        
        // Destacar o campo problemático
        setErrors(prev => ({
          ...prev,
          [resultadoModeracao.campoRejeitado]: 'Este campo contém conteúdo impróprio'
        }));
        
        setLoading(false);
        return; // Impedir envio
      }

      console.log('✅ Conteúdo aprovado pela moderação');
      // ====== FIM DA MODERAÇÃO ======
      
      // Prepare data with filters
      const threadData = {
        title: title.trim(),
        description: description.trim(),
        semester: filters.semester,
        courses: filters.courses,
        subjects: filters.subjects
      };
      
      console.log('Creating thread with data:', threadData);
      const response = await forumAPI.createThread(
        threadData.title, 
        threadData.description,
        threadData.semester,
        threadData.courses,
        threadData.subjects
      );
      
      console.log('Thread created successfully:', response.data);
      
      // Navigate to the created thread
      if (response.data.id) {
        navigate(`/thread/${response.data.id}`);
      } else {
        console.error('No thread ID in response:', response.data);
        setErrors({
          submit: 'Pergunta criada, mas houve um erro ao redirecionar. Verifique a lista de perguntas.'
        });
      }
      
    } catch (error) {
      console.error('Error creating thread:', error);
      
      // Use utility function for consistent error handling
      setErrors({
        submit: extractErrorMessage(error)
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: '' }));
    }
    // Limpar aviso de moderação ao editar
    if (moderationWarning?.campo === 'titulo') {
      setModerationWarning(null);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    // Limpar aviso de moderação ao editar
    if (moderationWarning?.campo === 'descricao') {
      setModerationWarning(null);
    }
  };

  return (
    <div className="create-thread">
      <div className="create-thread-header">
        <Link to="/" className="back-link">← Voltar para o fórum</Link>
        <h1>Nova Pergunta</h1>
      </div>

      <form onSubmit={handleSubmit} className="create-thread-form">
        {/* Mensagem de aviso de moderação */}
        {moderationWarning && (
          <div className="moderation-warning">
            <div className="moderation-warning-icon">⚠️</div>
            <div className="moderation-warning-content">
              <strong>Conteúdo Bloqueado</strong>
              <p>{moderationWarning.mensagem}</p>
              <p className="moderation-hint">
                Por favor, revise o {moderationWarning.campo === 'titulo' ? 'título' : 'descrição'} 
                e remova qualquer conteúdo impróprio antes de tentar novamente.
              </p>
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Título da Pergunta <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Digite o título da sua pergunta"
            maxLength="200"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
          <div className={`character-count ${title.length > 180 ? 'character-count-warning' : ''}`}>
            {title.length}/200
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Descrição (opcional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Adicione mais detalhes sobre sua pergunta (opcional)"
            maxLength="500"
            rows="4"
          />
          <div className={`character-count ${description.length > 450 ? 'character-count-warning' : ''}`}>
            {description.length}/500
          </div>
        </div>

        {/* Filters Section */}
        <QuestionFilters
          onChange={handleFiltersChange}
          initialValues={filters}
          errors={errors}
        />

        {errors.submit && (
          <div className="error-message submit-error">
            {errors.submit}
          </div>
        )}

        <div className="form-actions">
          <Link to="/" className="cancel-btn">
            Cancelar
          </Link>
          <button 
            type="submit" 
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Verificando e criando...' : 'Criar Pergunta'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateThread;
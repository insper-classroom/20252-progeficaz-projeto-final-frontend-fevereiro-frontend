import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import QuestionFilters from './QuestionFilters';
import { forumAPI } from '../services/api';
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
    
    try {
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
      navigate(`/thread/${response.data.id}`);
    } catch (error) {
      console.error('Error creating thread:', error);
      setErrors({
        submit: error.response?.data?.error || 'Erro ao criar pergunta. Tente novamente.'
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
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  return (
    <div className="create-thread">
      <div className="create-thread-header">
        <Link to="/" className="back-link">← Voltar para o fórum</Link>
        <h1>Nova Pergunta</h1>
      </div>

      <form onSubmit={handleSubmit} className="create-thread-form">
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
            {loading ? 'Criando...' : 'Criar Pergunta'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateThread;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FilterModal from './FilterModal';
import FilterDisplay from './FilterDisplay';
import { forumAPI } from '../services/api';
import { extractErrorMessage } from '../utils/restfulHelpers';
import LoadingSpinner from './LoadingSpinner';
import './ThreadList.css';

const ThreadList = () => {
  const [threads, setThreads] = useState([]);
  const [filteredThreads, setFilteredThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    semester: [],
    courses: [],
    subjects: []
  });

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await forumAPI.getThreads();
        console.log('Threads response:', response.data);
        
        // The API service now returns normalized thread data
        if (Array.isArray(response.data)) {
          setThreads(response.data);
        } else {
          console.error('Expected array of threads, received:', response.data);
          setThreads([]);
          setError('Formato de resposta inesperado do servidor');
        }
        
      } catch (err) {
        console.error('Error fetching threads:', err);
        
        // Use utility function for consistent error handling
        setError(extractErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, []);

  useEffect(() => {
    const hasActiveFilters = () => {
      return (activeFilters.semester && activeFilters.semester.length > 0) || 
             (activeFilters.courses && activeFilters.courses.length > 0) || 
             (activeFilters.subjects && activeFilters.subjects.length > 0);
    };

    const applyFiltersToThreads = () => {
      let filtered = threads;

      // Apply search filter first
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(thread => 
          thread.title.toLowerCase().includes(searchLower)
        );
      }

      // Apply category filters if active
      if (hasActiveFilters()) {
        console.log('Applying filters:', activeFilters);
        console.log('All threads:', threads);

        filtered = filtered.filter(thread => {
          console.log('Checking thread:', thread);
          
          // Check semester filter
          if (activeFilters.semester && activeFilters.semester.length > 0) {
            const threadSemester = parseInt(thread.semester);
            const hasMatchingSemester = activeFilters.semester.some(filterSemester => {
              const normalizedFilterSemester = parseInt(filterSemester);
              return threadSemester === normalizedFilterSemester;
            });
            
            console.log('Semester check:', {
              threadSemester,
              activeFilterSemesters: activeFilters.semester,
              hasMatch: hasMatchingSemester
            });
            
            if (!hasMatchingSemester) {
              return false;
            }
          }

          // Check courses filter
          if (activeFilters.courses && activeFilters.courses.length > 0) {
            if (!thread.courses || !Array.isArray(thread.courses)) {
              console.log('Thread has no courses array');
              return false;
            }
            
            const hasMatchingCourse = thread.courses.some(threadCourse => 
              activeFilters.courses.includes(threadCourse)
            );
            
            console.log('Courses check:', {
              threadCourses: thread.courses,
              activeFilterCourses: activeFilters.courses,
              hasMatch: hasMatchingCourse
            });
            
            if (!hasMatchingCourse) {
              return false;
            }
          }

          // Check subjects filter
          if (activeFilters.subjects && activeFilters.subjects.length > 0) {
            if (!thread.subjects || !Array.isArray(thread.subjects)) {
              console.log('Thread has no subjects array');
              return false;
            }
            
            const hasMatchingSubject = thread.subjects.some(threadSubject => 
              activeFilters.subjects.includes(threadSubject)
            );
            
            console.log('Subjects check:', {
              threadSubjects: thread.subjects,
              activeFilterSubjects: activeFilters.subjects,
              hasMatch: hasMatchingSubject
            });
            
            if (!hasMatchingSubject) {
              return false;
            }
          }

          console.log('Thread passed all filters');
          return true;
        });

        console.log('Filtered threads:', filtered);
      }

      setFilteredThreads(filtered);
    };

    applyFiltersToThreads();
  }, [threads, activeFilters, searchTerm]);

  const hasActiveFilters = () => {
    return (activeFilters.semester && activeFilters.semester.length > 0) || 
           (activeFilters.courses && activeFilters.courses.length > 0) || 
           (activeFilters.subjects && activeFilters.subjects.length > 0);
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
  };

  const handleClearAllFilters = () => {
    const clearedFilters = {
      semester: [],
      courses: [],
      subjects: []
    };
    setActiveFilters(clearedFilters);
    setSearchTerm('');
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  if (loading) return <LoadingSpinner message="Carregando perguntas..." />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="thread-list">
      <div className="thread-list-header">
        <h1>Fórum de Perguntas</h1>
        <div className="header-actions">
          <button 
            className="filter-button"
            onClick={() => setIsFilterModalOpen(true)}
          >
            🔍 Filtrar
            {hasActiveFilters() && <span className="filter-badge">{
              activeFilters.semester.length + 
              activeFilters.courses.length + 
              activeFilters.subjects.length
            }</span>}
          </button>
          <Link to="/create" className="create-btn">
            + Nova Pergunta
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Pesquisar perguntas por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="clear-search-button"
              onClick={handleClearSearch}
              title="Limpar pesquisa"
            >
              ✕
            </button>
          )}
          <span className="search-icon">🔍</span>
        </div>
        {searchTerm && (
          <div className="search-info">
            Pesquisando por: <strong>"{searchTerm}"</strong>
          </div>
        )}
      </div>

      {(hasActiveFilters() || searchTerm) && (
        <div className="active-filters-section">
          <div className="active-filters-header">
            <h3>
              {hasActiveFilters() && searchTerm 
                ? 'Filtros e Pesquisa Ativos'
                : hasActiveFilters() 
                ? 'Filtros Ativos'
                : 'Pesquisa Ativa'
              }
            </h3>
            <button 
              className="clear-all-filters"
              onClick={handleClearAllFilters}
            >
              Limpar Todos
            </button>
          </div>
          {hasActiveFilters() && <FilterDisplay filters={activeFilters} />}
        </div>
      )}

      <div className="threads-container">
        {filteredThreads.length > 0 ? (
          <>
            <div className="threads-count">
              {(hasActiveFilters() || searchTerm)
                ? `${filteredThreads.length} de ${threads.length} pergunta(s) encontrada(s)`
                : `${threads.length} pergunta(s) no total`
              }
            </div>
            <div className="threads">
              {filteredThreads.map(thread => (
                <div key={thread.id} className="thread-card">
                  <Link to={`/thread/${thread.id}`} className="thread-link">
                    <h3 className="thread-title">{thread.title}</h3>
                    <div className="thread-meta">
                      <span className="thread-date">
                        {new Date(thread.created_at).toLocaleDateString('pt-BR')}
                      </span>
                      {thread.posts_count !== undefined && (
                        <span className="thread-replies">
                          {thread.posts_count} resposta(s)
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </>
        ) : (hasActiveFilters() || searchTerm) ? (
          <div className="no-threads-filtered">
            <h3>Nenhuma pergunta encontrada</h3>
            <p>
              {searchTerm 
                ? `Não foram encontradas perguntas com o título contendo "${searchTerm}".`
                : 'Não foram encontradas perguntas que correspondem aos filtros selecionados.'
              }
            </p>
            <button 
              className="clear-filters-btn"
              onClick={handleClearAllFilters}
            >
              {searchTerm && hasActiveFilters() ? 'Limpar Pesquisa e Filtros' : searchTerm ? 'Limpar Pesquisa' : 'Limpar Filtros'}
            </button>
          </div>
        ) : (
          <div className="no-threads">
            <h3>Nenhuma pergunta ainda</h3>
            <p>Seja o primeiro a fazer uma pergunta!</p>
            <Link to="/create" className="create-first-btn">
              Criar Primeira Pergunta
            </Link>
          </div>
        )}
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={activeFilters}
      />
    </div>
  );
};

export default ThreadList;
import React, { useState, useEffect } from 'react';
import FilterSelector from './FilterSelector';
import { FILTER_CONFIG, SEMESTERS, COURSES } from '../config/filterConfig';
import { api } from '../services/api';
import './FilterModal.css';

const FilterModal = ({ isOpen, onClose, onApplyFilters, currentFilters = {} }) => {
    const [filters, setFilters] = useState({
        semester: [],
        courses: [],
        subjects: []
    });
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [subjectSearchTerm, setSubjectSearchTerm] = useState('');

    // Initialize filters when modal opens
    useEffect(() => {
        if (isOpen) {
            setFilters({
                semester: currentFilters.semester || [],
                courses: currentFilters.courses || [],
                subjects: currentFilters.subjects || []
            });
            loadSubjects();
        }
    }, [isOpen, currentFilters]);

    // Load subjects when semester or courses change
    useEffect(() => {
        if (isOpen) {
            loadSubjects();
        }
    }, [filters.semester, filters.courses, isOpen]);

    // Search subjects when search term changes
    useEffect(() => {
        if (subjectSearchTerm && isOpen) {
            searchSubjects();
        } else if (!subjectSearchTerm && isOpen) {
            loadSubjects();
        }
    }, [subjectSearchTerm, isOpen]);

    const loadSubjects = async () => {
        setLoadingSubjects(true);
        try {
            const params = new URLSearchParams();
            
            // Add semester filters if any are selected
            if (filters.semester && filters.semester.length > 0) {
                filters.semester.forEach(semester => {
                    params.append('semester', semester);
                });
            }
            
            // Add course filters if any are selected
            if (filters.courses && filters.courses.length > 0) {
                filters.courses.forEach(course => {
                    params.append('courses', course);
                });
            }

            const endpoint = params.toString() ? `/filters/subjects?${params.toString()}` : '/filters/subjects';
            const response = await api.get(endpoint);
            
            const subjectObjects = response.data.map(subject => ({
                id: subject,
                name: subject
            }));
            
            setSubjectOptions(subjectObjects);
        } catch (error) {
            console.error('Error loading subjects:', error);
            setSubjectOptions([]);
        } finally {
            setLoadingSubjects(false);
        }
    };

    const searchSubjects = async () => {
        if (!subjectSearchTerm.trim()) {
            loadSubjects();
            return;
        }

        setLoadingSubjects(true);
        try {
            const params = new URLSearchParams();
            params.append('q', subjectSearchTerm);
            
            if (filters.semester && filters.semester.length > 0) {
                filters.semester.forEach(semester => {
                    params.append('semester', semester);
                });
            }
            
            if (filters.courses && filters.courses.length > 0) {
                filters.courses.forEach(course => {
                    params.append('courses', course);
                });
            }

            const response = await api.get(`/filters/subjects?${params.toString()}`);
            
            const subjectObjects = response.data.map(subject => ({
                id: subject,
                name: subject
            }));
            
            setSubjectOptions(subjectObjects);
        } catch (error) {
            console.error('Error searching subjects:', error);
            setSubjectOptions([]);
        } finally {
            setLoadingSubjects(false);
        }
    };

    const handleFilterChange = (filterKey, value) => {
        const newFilters = { ...filters, [filterKey]: value };

        // Clear subjects when semester or courses change
        if (filterKey === 'semester' || filterKey === 'courses') {
            if (newFilters.subjects && newFilters.subjects.length > 0) {
                newFilters.subjects = [];
            }
        }

        setFilters(newFilters);
    };

    const handleSubjectSearch = (searchTerm) => {
        setSubjectSearchTerm(searchTerm);
    };

    const handleApplyFilters = () => {
        onApplyFilters(filters);
        onClose();
    };

    const handleClearFilters = () => {
        const clearedFilters = {
            semester: [],
            courses: [],
            subjects: []
        };
        setFilters(clearedFilters);
        onApplyFilters(clearedFilters);
        onClose();
    };

    const hasActiveFilters = () => {
        return (filters.semester && filters.semester.length > 0) || 
               (filters.courses && filters.courses.length > 0) || 
               (filters.subjects && filters.subjects.length > 0);
    };

    if (!isOpen) return null;

    return (
        <div className="filter-modal-overlay" onClick={onClose}>
            <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
                <div className="filter-modal-header">
                    <h2>Filtrar Perguntas</h2>
                    <button className="close-button" onClick={onClose}>✕</button>
                </div>
                
                <div className="filter-modal-content">
                    <p className="filter-description">
                        Selecione os filtros para encontrar perguntas específicas. 
                        Todos os filtros são opcionais e permitem múltiplas seleções.
                    </p>

                    <div className="filter-item">
                        <FilterSelector
                            label="Semestre"
                            options={SEMESTERS}
                            value={filters.semester}
                            onChange={(value) => handleFilterChange('semester', value)}
                            multiple={true}
                            required={false}
                            searchable={false}
                            placeholder="Selecione os semestres..."
                        />
                    </div>

                    <div className="filter-item">
                        <FilterSelector
                            label="Curso"
                            options={COURSES}
                            value={filters.courses}
                            onChange={(value) => handleFilterChange('courses', value)}
                            multiple={true}
                            required={false}
                            searchable={false}
                            placeholder="Selecione os cursos..."
                        />
                    </div>

                    <div className="filter-item">
                        <FilterSelector
                            label="Matéria"
                            options={subjectOptions}
                            value={filters.subjects}
                            onChange={(value) => handleFilterChange('subjects', value)}
                            multiple={true}
                            required={false}
                            searchable={true}
                            placeholder={loadingSubjects ? "Carregando..." : "Selecione as matérias..."}
                            onSearch={handleSubjectSearch}
                            disabled={loadingSubjects}
                        />
                        
                        {loadingSubjects && (
                            <div className="loading-text">Carregando matérias...</div>
                        )}

                        {!loadingSubjects && subjectOptions.length === 0 && (
                            <div className="info-text">
                                {filters.semester.length > 0 || filters.courses.length > 0
                                    ? "Nenhuma matéria encontrada para os filtros selecionados."
                                    : "Todas as matérias disponíveis."
                                }
                            </div>
                        )}

                        {!loadingSubjects && subjectOptions.length > 0 && (
                            <div className="info-text">
                                {subjectOptions.length} matéria(s) disponível(eis)
                            </div>
                        )}
                    </div>
                </div>

                <div className="filter-modal-actions">
                    <button 
                        className="clear-button" 
                        onClick={handleClearFilters}
                        disabled={!hasActiveFilters()}
                    >
                        Limpar Filtros
                    </button>
                    <div className="action-buttons">
                        <button className="cancel-button" onClick={onClose}>
                            Cancelar
                        </button>
                        <button className="apply-button" onClick={handleApplyFilters}>
                            Aplicar Filtros
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;

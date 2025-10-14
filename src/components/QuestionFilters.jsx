import React, { useState, useEffect } from 'react';
import FilterSelector from './FilterSelector';
import { FILTER_CONFIG, getFilterOrder, shouldShowFilter } from '../config/filterConfig';
import { api } from '../services/api';
import './QuestionFilters.css';

const QuestionFilters = ({ onChange, initialValues = {}, errors = {} }) => {
    const [filters, setFilters] = useState(initialValues);
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [subjectSearchTerm, setSubjectSearchTerm] = useState('');

    // Load subjects when component mounts and when semester or courses change
    useEffect(() => {
        loadSubjects();
    }, [filters.semester, filters.courses]);

    // Search subjects when search term changes
    useEffect(() => {
        if (subjectSearchTerm) {
            searchSubjects();
        } else if (!subjectSearchTerm && (filters.semester || (filters.courses && filters.courses.length > 0))) {
            loadSubjects();
        }
    }, [subjectSearchTerm]);

    const loadSubjects = async () => {
        setLoadingSubjects(true);
        try {
            const params = new URLSearchParams();
            
            // Se há semestre selecionado, adiciona ao filtro
            if (filters.semester) {
                params.append('semester', filters.semester);
            }
            
            // Se há cursos selecionados, adiciona ao filtro
            if (filters.courses && filters.courses.length > 0) {
                filters.courses.forEach(course => {
                    params.append('courses', course);
                });
            }

            // Se não há filtros, busca todas as matérias
            const endpoint = params.toString() ? `/filters/subjects?${params.toString()}` : '/filters/subjects';
            const response = await api.get(endpoint);
            
            // Convert string array to objects with id and name
            const subjectObjects = response.data.map(subject => ({
                id: subject,
                name: subject
            }));
            
            setSubjectOptions(subjectObjects);
        } catch (error) {
            console.error('Error loading subjects:', error);
            // Em caso de erro, mantém as opções atuais ou usa array vazio
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
            
            // Adiciona filtros de contexto se existirem
            if (filters.semester) {
                params.append('semester', filters.semester);
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
            // Em caso de erro na busca, filtra localmente
            const filtered = subjectOptions.filter(subject =>
                subject.name.toLowerCase().includes(subjectSearchTerm.toLowerCase())
            );
            setSubjectOptions(filtered);
        } finally {
            setLoadingSubjects(false);
        }
    };

    const handleFilterChange = (filterKey, value) => {
        const newFilters = { ...filters, [filterKey]: value };

        // Limpa matérias selecionadas quando filtros de contexto mudam
        if (filterKey === 'semester' || filterKey === 'courses') {
            // Apenas limpa se havia matérias selecionadas
            if (newFilters.subjects && newFilters.subjects.length > 0) {
                newFilters.subjects = [];
            }
        }

        setFilters(newFilters);
        onChange(newFilters);
    };

    const handleSubjectSearch = (searchTerm) => {
        setSubjectSearchTerm(searchTerm);
    };

    const getFilterOptions = (filterKey) => {
        const config = FILTER_CONFIG[filterKey];
        
        if (filterKey === 'subjects') {
            return subjectOptions;
        }
        
        return config.options;
    };

    const getSubjectPlaceholder = () => {
        if (loadingSubjects) {
            return "Carregando...";
        }
        
        if (filters.semester && filters.courses && filters.courses.length > 0) {
            return `Matérias do ${filters.semester}º semestre para os cursos selecionados...`;
        } else if (filters.semester) {
            return `Matérias do ${filters.semester}º semestre...`;
        } else if (filters.courses && filters.courses.length > 0) {
            return "Matérias dos cursos selecionados...";
        }
        
        return "Selecione as matérias...";
    };

    return (
        <div className="question-filters">
            <h3 className="filters-title">Filtros da Pergunta</h3>
            <p className="filters-description">
                Configure os filtros para categorizar sua pergunta. 
                Campos obrigatórios são marcados com <span className="required-mark">*</span>
            </p>

            {getFilterOrder().map(filterKey => {
                const config = FILTER_CONFIG[filterKey];
                
                if (!shouldShowFilter(filterKey, filters)) {
                    return null;
                }

                // Placeholder personalizado para matérias
                const placeholder = filterKey === 'subjects' 
                    ? getSubjectPlaceholder() 
                    : `Selecione ${config.label.toLowerCase()}...`;

                return (
                    <div key={filterKey} className="filter-item">
                        <FilterSelector
                            label={config.label}
                            options={getFilterOptions(filterKey)}
                            value={filters[filterKey]}
                            onChange={(value) => handleFilterChange(filterKey, value)}
                            multiple={config.multiple}
                            required={config.required}
                            searchable={config.searchable}
                            placeholder={placeholder}
                            onSearch={config.searchable ? handleSubjectSearch : null}
                            disabled={loadingSubjects && filterKey === 'subjects'}
                        />
                        
                        {errors[filterKey] && (
                            <div className="filter-error">
                                {errors[filterKey]}
                            </div>
                        )}
                        
                        {filterKey === 'subjects' && loadingSubjects && (
                            <div className="loading-text">Carregando matérias...</div>
                        )}

                        {/* Mostra informação sobre o contexto atual das matérias */}
                        {filterKey === 'subjects' && !loadingSubjects && subjectOptions.length === 0 && (
                            <div className="info-text">
                                {filters.semester || (filters.courses && filters.courses.length > 0)
                                    ? "Nenhuma matéria encontrada para os filtros selecionados."
                                    : "Selecione um semestre ou curso para ver as matérias disponíveis."
                                }
                            </div>
                        )}

                        {filterKey === 'subjects' && !loadingSubjects && subjectOptions.length > 0 && (
                            <div className="info-text">
                                {subjectOptions.length} matéria(s) disponível(eis)
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default QuestionFilters;

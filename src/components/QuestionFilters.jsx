import React, { useState, useEffect, useCallback } from 'react';
import FilterSelector from './FilterSelector';
import { FILTER_CONFIG, getFilterOrder, shouldShowFilter } from '../config/filterConfig';
import { api } from '../services/api';
import './QuestionFilters.css';

const QuestionFilters = ({ onChange, initialValues = {}, errors = {} }) => {
    const [filters, setFilters] = useState(initialValues);
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [subjectSearchTerm, setSubjectSearchTerm] = useState('');

    const loadSubjects = useCallback(async () => {
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

            // Busca matérias (com ou sem filtros)
            const endpoint = params.toString() ? `/filters/subjects?${params.toString()}` : '/filters/subjects';
            console.log('Carregando matérias do endpoint:', endpoint);
            
            const response = await api.get(endpoint);
            console.log('Resposta de matérias:', response.data);
            
            // Convert string array to objects with id and name
            const subjectObjects = response.data.map(subject => ({
                id: subject,
                name: subject
            }));
            
            console.log('Matérias convertidas:', subjectObjects);
            setSubjectOptions(subjectObjects);
        } catch (error) {
            console.error('Error loading subjects:', error);
            // Em caso de erro, usa array vazio
            setSubjectOptions([]);
        } finally {
            setLoadingSubjects(false);
        }
    }, [filters.semester, filters.courses]);

    const searchSubjects = useCallback(async (searchTerm) => {
        if (!searchTerm.trim()) {
            loadSubjects();
            return;
        }

        setLoadingSubjects(true);
        try {
            const params = new URLSearchParams();
            params.append('q', searchTerm);
            
            // Adiciona filtros de contexto se existirem
            if (filters.semester) {
                params.append('semester', filters.semester);
            }
            
            if (filters.courses && filters.courses.length > 0) {
                filters.courses.forEach(course => {
                    params.append('courses', course);
                });
            }

            console.log('Buscando matérias com termo:', searchTerm);
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
    }, [filters.semester, filters.courses, loadSubjects]);

    // Load subjects when component mounts and when semester or courses change
    useEffect(() => {
        console.log('useEffect disparado - carregando matérias');
        loadSubjects();
    }, [loadSubjects]);

    // Search subjects when search term changes
    useEffect(() => {
        if (subjectSearchTerm) {
            console.log('Buscando com termo:', subjectSearchTerm);
            searchSubjects(subjectSearchTerm);
        }
    }, [subjectSearchTerm, searchSubjects]);

    const handleFilterChange = (filterKey, value) => {
        console.log('Filtro alterado:', filterKey, value);
        const newFilters = { ...filters, [filterKey]: value };

        // Não limpa as matérias quando outros filtros mudam
        // Apenas recarrega as opções disponíveis
        if (filterKey === 'semester' || filterKey === 'courses') {
            // As matérias selecionadas são mantidas
            // O useEffect irá recarregar as opções disponíveis
        }

        setFilters(newFilters);
        onChange(newFilters);
    };

    const handleSubjectSearch = (searchTerm) => {
        console.log('Termo de busca alterado:', searchTerm);
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
            return "Carregando matérias...";
        }
        
        if (subjectOptions.length === 0) {
            return "Nenhuma matéria disponível";
        }
        
        return "Selecione uma ou mais matérias...";
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

                        {/* Informação sobre matérias disponíveis */}
                        {filterKey === 'subjects' && !loadingSubjects && (
                            <div className="info-text">
                                {subjectOptions.length > 0 
                                    ? `${subjectOptions.length} matéria(s) disponível(eis)`
                                    : "Nenhuma matéria encontrada. Verifique se o backend está rodando."
                                }
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default QuestionFilters;

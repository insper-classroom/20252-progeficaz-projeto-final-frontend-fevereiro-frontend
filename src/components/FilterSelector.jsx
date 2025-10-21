import React, { useState, useEffect } from 'react';
import './FilterSelector.css';

const FilterSelector = ({ 
    label, 
    options, 
    value, 
    onChange, 
    multiple = false, 
    required = false, 
    searchable = false,
    placeholder = "Selecione...",
    onSearch = null,
    disabled = false
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState(options);

    useEffect(() => {
        console.log('FilterSelector - options atualizadas:', options);
        if (searchable && searchTerm) {
            if (onSearch && typeof onSearch === 'function') {
                onSearch(searchTerm);
            } else {
                const filtered = options.filter(option =>
                    option.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setFilteredOptions(filtered);
            }
        } else {
            setFilteredOptions(options);
        }
    }, [searchTerm, options, searchable, onSearch]);

    const handleOptionClick = (option) => {
        console.log('Opção clicada:', option);
        if (multiple) {
            const newValue = value || [];
            if (newValue.includes(option.id)) {
                onChange(newValue.filter(id => id !== option.id));
            } else {
                onChange([...newValue, option.id]);
            }
        } else {
            onChange(option.id);
            setIsOpen(false);
        }
    };

    const getDisplayText = () => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
            return placeholder;
        }

        if (multiple) {
            const selectedOptions = options.filter(opt => value.includes(opt.id));
            if (selectedOptions.length === 0) {
                return placeholder;
            }
            if (selectedOptions.length === 1) {
                return selectedOptions[0].name;
            }
            // Mostrar os nomes dos primeiros itens selecionados
            if (selectedOptions.length <= 2) {
                return selectedOptions.map(opt => opt.name).join(', ');
            }
            return `${selectedOptions.length} selecionados`;
        } else {
            const selected = options.find(opt => opt.id === value);
            return selected ? selected.name : placeholder;
        }
    };

    const isSelected = (optionId) => {
        if (multiple) {
            return value && value.includes(optionId);
        }
        return value === optionId;
    };

    return (
        <div className={`filter-selector ${disabled ? 'disabled' : ''}`}>
            <label className="filter-label">
                {label}
                {required && <span className="required-mark"> *</span>}
            </label>
            
            <div className="select-wrapper">
                <div 
                    className={`select-display ${isOpen ? 'open' : ''}`}
                    onClick={() => {
                        if (!disabled) {
                            console.log('Abrindo dropdown. Opções disponíveis:', options.length);
                            setIsOpen(!isOpen);
                        }
                    }}
                >
                    <span className="select-text">{getDisplayText()}</span>
                    <span className="select-arrow">▼</span>
                </div>

                {isOpen && !disabled && (
                    <div className="options-dropdown">
                        {searchable && (
                            <div className="search-wrapper">
                                <input
                                    type="text"
                                    placeholder="Pesquisar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                    autoFocus
                                />
                            </div>
                        )}
                        
                        <div className="options-list">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map(option => (
                                    <div
                                        key={option.id}
                                        className={`option ${isSelected(option.id) ? 'selected' : ''}`}
                                        onClick={() => handleOptionClick(option)}
                                    >
                                        <span>{option.name}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="no-options">
                                    {searchTerm 
                                        ? 'Nenhum resultado encontrado' 
                                        : options.length === 0 
                                        ? 'Nenhuma opção disponível (verifique se o backend está rodando)' 
                                        : 'Nenhuma opção disponível'}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Click outside to close */}
            {isOpen && (
                <div 
                    className="overlay" 
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default FilterSelector;

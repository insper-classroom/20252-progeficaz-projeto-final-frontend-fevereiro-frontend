import React from 'react';
import { FILTER_CONFIG, SEMESTERS, COURSES } from '../config/filterConfig';
import './FilterDisplay.css';

const FilterDisplay = ({ filters }) => {
    if (!filters) return null;

    const getFilterDisplayValue = (filterKey, value) => {
        
        if (!value || (Array.isArray(value) && value.length === 0)) {
            return null;
        }

        console.log(`Getting display value for ${filterKey}:`, value);

        switch (filterKey) {
            case 'semester': {
                // Handle both single value and array format for active filters
                const semesterValues = Array.isArray(value) ? value : [value];
                const semesterNames = semesterValues.map(semesterValue => {
                    const normalizedValue = parseInt(semesterValue);
                    const semester = SEMESTERS.find(s => s.id === normalizedValue);
                    return semester ? semester.name : `${normalizedValue}º Semestre`;
                });
                return semesterNames.join(', ');
            }
            
            case 'courses': {
                if (!Array.isArray(value) || value.length === 0) return null;
                const courseNames = value.map(courseId => {
                    const course = COURSES.find(c => c.id === courseId);
                    return course ? course.name : courseId;
                });
                return courseNames.join(', ');
            }
            
            case 'subjects':
                if (!Array.isArray(value) || value.length === 0) return null;
                return value.join(', ');
            
            default:
                return Array.isArray(value) ? value.join(', ') : value;
        }
    };

    const renderFilter = (filterKey) => {
        const config = FILTER_CONFIG[filterKey];
        const displayValue = getFilterDisplayValue(filterKey, filters[filterKey]);
        
        if (!displayValue) return null;

        return (
            <div key={filterKey} className="filter-display-item">
                <span className="filter-label">{config.label}:</span>
                <span className="filter-value">{displayValue}</span>
            </div>
        );
    };

    const hasAnyFilters = Object.keys(filters).some(key => {
        const value = filters[key];
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return value !== null && value !== undefined && value !== '';
    });

    if (!hasAnyFilters) return null;

    return (
        <div className="filter-display">
            <div className="filter-display-content">
                {Object.keys(FILTER_CONFIG).map(renderFilter)}
            </div>
        </div>
    );
};

export default FilterDisplay;

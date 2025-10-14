/**
 * ===== DEVELOPER CONFIGURATION SECTION =====
 * Filter Configuration for Forum Questions
 * 
 * This file contains all filter definitions and can be easily modified by developers.
 * Each filter has specific properties that control its behavior:
 * - required: boolean - whether the filter is mandatory
 * - multiple: boolean - whether multiple options can be selected
 * - searchable: boolean - whether the filter supports search
 * - dependsOn: array - filters that must be selected before this one appears
 */

// Semester filter - Required, single selection
export const SEMESTERS = [
    { id: 1, name: "1º Semestre" },
    { id: 2, name: "2º Semestre" },
    { id: 3, name: "3º Semestre" },
    { id: 4, name: "4º Semestre" },
    { id: 5, name: "5º Semestre" },
    { id: 6, name: "6º Semestre" },
    { id: 7, name: "7º Semestre" },
    { id: 8, name: "8º Semestre" },
    { id: 9, name: "9º Semestre" },
    { id: 10, name: "10º Semestre" },
];

// Course filter - Optional, multiple selection
export const COURSES = [
    { id: "cc", name: "Ciência da Computação" },
    { id: "adm", name: "Administração" },
    { id: "eng_civil", name: "Engenharia Civil" },
    { id: "eng_mec", name: "Engenharia Mecânica" },
    { id: "eng_ele", name: "Engenharia Elétrica" },
    { id: "eng_comp", name: "Engenharia de Computação" },
    { id: "direito", name: "Direito" },
    { id: "medicina", name: "Medicina" },
    { id: "psicologia", name: "Psicologia" },
];

// Filter configuration metadata
export const FILTER_CONFIG = {
    semester: {
        label: "Semestre",
        required: true,
        multiple: false,
        dependsOn: [],
        searchable: false,
        options: SEMESTERS
    },
    courses: {
        label: "Curso",
        required: false,
        multiple: true,
        dependsOn: [],
        searchable: false,
        options: COURSES
    },
    subjects: {
        label: "Matéria",
        required: true,
        multiple: true,
        dependsOn: [], // Removido as dependências para sempre mostrar o filtro
        searchable: true,
        options: [] // Dynamic - loaded from API based on dependencies
    }
};

// Helper function to get filter order (filters with dependencies come after their dependencies)
export const getFilterOrder = () => {
    return ["semester", "courses", "subjects"];
};

// Helper function to check if a filter should be visible based on its dependencies
export const shouldShowFilter = (filterKey, currentFilters) => {
    const filter = FILTER_CONFIG[filterKey];
    if (!filter.dependsOn || filter.dependsOn.length === 0) {
        return true;
    }
    
    return filter.dependsOn.every(dependency => {
        const depValue = currentFilters[dependency];
        return depValue && (Array.isArray(depValue) ? depValue.length > 0 : true);
    });
};

// ===== END DEVELOPER CONFIGURATION SECTION =====

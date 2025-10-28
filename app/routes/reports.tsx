

import React, { useState } from 'react';
// Importe seu botão, modal, etc., conforme sua biblioteca de componentes
import { Button, Modal, Select, Textarea } from '~/components/ui; 

// Esta é a função de conexão que você precisa no front-end
const submitReport = async (data) => {
    // ... (Lógica de fetch/POST para /api/reports com JWT) ...
};

const reportTypes = [
    // Use a lista do seu constants.py para preencher as opções
    { value: 'sexual', label: 'Conteúdo Sexual' },
    { value: 'violence', label: 'Violência' },
    // ... outros tipos ...
    { value: 'other', label: 'Outros (Descreva)' },
];

function ReportModal({ contentType, contentId, isOpen, onClose }) {
    const [reportType, setReportType] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!reportType) {
            alert("Selecione um tipo de denúncia.");
            return;
        }
        if (reportType === 'other' && description.trim() === '') {
            alert("A descrição é obrigatória para o tipo 'Outros'.");
            return;
        }

        setLoading(true);
        const formData = {
            content_type: contentType, // Vindo da Thread/Post que você está denunciando
            content_id: contentId,     // Vindo da Thread/Post que você está denunciando
            report_type: reportType,
            description: description || null
        };

        try {
            await submitReport(formData);
            alert('Denúncia enviada com sucesso!');
            onClose(); // Fecha o modal após o sucesso
        } catch (error) {
            alert(`Falha ao denunciar: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2>Denunciar Conteúdo</h2>
            <p>Denunciando um(a) **{contentType}** com ID: {contentId}</p>

            <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <option value="">Selecione o Motivo</option>
                {reportTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                ))}
            </Select>

            {(reportType === 'other' || description) && (
                <Textarea 
                    placeholder="Detalhes da denúncia (Obrigatório se 'Outros')"
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                />
            )}
            
            <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Enviando...' : 'Confirmar Denúncia'}
            </Button>
        </Modal>
    );
}
export default ReportModal;
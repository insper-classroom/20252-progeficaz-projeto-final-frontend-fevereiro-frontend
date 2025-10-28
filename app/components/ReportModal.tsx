
import React, { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { useCreateReport } from '~/hooks/use-reports'; // Importa o hook do Passo A

interface ReportModalProps {
  contentId: string;
  contentType: 'thread' | 'post';
  children: React.ReactNode; // Para ser usado com o DialogTrigger
}

const REPORT_OPTIONS = [
  { value: 'sexual', label: 'Conteúdo Sexual' },
  { value: 'violence', label: 'Violência' },
  { value: 'discrimination', label: 'Discriminação' },
  { value: 'scam', label: 'Enganoso/Golpe' },
  { value: 'self_harm', label: 'Auto-mutilação/Suicídio' },
  { value: 'spam', label: 'Spam' },
  { value: 'other', label: 'Outros (Descrição Obrigatória)' },
];

export function ReportModal({ contentId, contentType, children }: ReportModalProps) {
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const reportMutation = useCreateReport();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportType) {
      alert("Por favor, selecione um tipo de denúncia.");
      return;
    }
    
    // Regra do Back-end: Descrição é obrigatória se o tipo for 'other'
    if (reportType === 'other' && description.trim() === '') {
      alert("A descrição é obrigatória para o tipo 'Outros'.");
      return;
    }

    const payload = {
      content_id: contentId,
      content_type: contentType,
      report_type: reportType,
      description: description.trim() || null, // Envia null se vazio
    };

    reportMutation.mutate(payload, {
        onSuccess: () => {
            setIsOpen(false); // Fecha o modal após o sucesso (a toast já é exibida pelo hook)
            setReportType('');
            setDescription('');
        }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Denunciar {contentType === 'thread' ? 'a Thread' : 'o Post'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <Select value={reportType} onValueChange={setReportType} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o motivo da denúncia" />
            </SelectTrigger>
            <SelectContent>
              {REPORT_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Textarea
            placeholder={`Detalhes da denúncia (Obrigatório se "Outros"). Máximo 500 caracteres.`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            disabled={reportMutation.isPending}
          />

          <Button 
            type="submit" 
            variant="destructive" 
            className="w-full"
            disabled={reportMutation.isPending || !reportType}
          >
            {reportMutation.isPending ? 'Enviando Denúncia...' : 'Confirmar Denúncia'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
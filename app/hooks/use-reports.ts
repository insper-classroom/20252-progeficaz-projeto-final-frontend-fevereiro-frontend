
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// 1. Defina a interface (o que seu back-end espera)
interface ReportPayload {
  content_type: 'thread' | 'post';
  content_id: string;
  report_type: string;
  description?: string | null;
}

// 2. A função de conexão (a "Lógica de fetch/POST com JWT")
const createReportRequest = async (payload: ReportPayload) => {
  const token = localStorage.getItem('access_token');
  const API_BASE_URL = '/api'; // Use a URL relativa se estiver proxy
  
  if (!token) {
    throw new Error("Usuário não autenticado. Faça login para denunciar.");
  }

  const response = await fetch(`${API_BASE_URL}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    // Lança a mensagem de erro do back-end
    throw new Error(data.error || "Falha desconhecida ao criar denúncia.");
  }
  
  return data;
};

// 3. O Hook que será usado no componente
export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReportRequest,
    onSuccess: (data, variables) => {
      toast.success("Denúncia enviada com sucesso! Analisaremos o conteúdo.");
      // Opcional: Invalide as threads/posts para talvez ocultar o botão de denúncia
      // se a regra do seu backend permitir apenas uma denúncia por usuário.
      queryClient.invalidateQueries({ queryKey: ['thread', variables.content_id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      // Exibe a mensagem de erro que o seu back-end enviou (ex: "You have already reported this content")
      toast.error(error.message); 
    },
  });
};
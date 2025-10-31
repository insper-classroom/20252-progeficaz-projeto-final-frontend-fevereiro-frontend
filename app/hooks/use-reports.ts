
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { apiClient } from '~/lib/api-client';

// 1. Defina a interface (o que seu back-end espera)
interface ReportPayload {
  content_type: 'thread' | 'post';
  content_id: string;
  report_type: string;
  description?: string | null;
}

// 2. A função de conexão (a "Lógica de fetch/POST com JWT")
const createReportRequest = async (payload: ReportPayload) => {
  const data = apiClient.post('/api/reports', payload).then(
    (res) => res.data
  ).catch((error) => {
    // Repassa o erro para ser tratado no hook
    throw new Error(error.response?.data?.error || "Erro desconhecido ao criar denúncia.");
  })
  console.log(data);

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
      console.log(error);
      toast.error(error.message); 
    },
  });
};
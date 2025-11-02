import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reportService } from '~/services'
import type { CreateReportRequest } from '~/types'

/**
 * Hook para listar todas denúncias
 */
export function useReports() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: () => reportService.listReports(),
  })
}

/**
 * Hook para obter uma denúncia específica
 */
export function useReport(reportId: string) {
  return useQuery({
    queryKey: ['reports', reportId],
    queryFn: () => reportService.getReport(reportId),
    enabled: !!reportId,
  })
}

/**
 * Hook para criar denúncia
 */
export function useCreateReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateReportRequest) => reportService.createReport(data),
    onSuccess: () => {
      // Invalidar lista de denúncias
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })
}

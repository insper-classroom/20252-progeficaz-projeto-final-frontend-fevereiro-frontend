import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Plus } from 'lucide-react'
import { useCreateThread } from '~/hooks/use-threads'
import { toast } from 'sonner'
import type { CreateThreadDto } from '~/types'

export function CreateThreadDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<CreateThreadDto>({
    title: '',
    description: '',
    semester: 1,
    courses: [],
    subjects: ['Geral'],
  })
  const [coursesInput, setCoursesInput] = useState('')
  const [subjectsInput, setSubjectsInput] = useState('Geral')

  const createThread = useCreateThread()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('O título é obrigatório')
      return
    }

    if (formData.title.length > 200) {
      toast.error('O título deve ter no máximo 200 caracteres')
      return
    }

    if (formData.description && formData.description.length > 500) {
      toast.error('A descrição deve ter no máximo 500 caracteres')
      return
    }

    try {
      const dataToSend: CreateThreadDto = {
        title: formData.title,
        description: formData.description || undefined,
        semester: formData.semester,
        courses: coursesInput
          ? coursesInput.split(',').map((c) => c.trim()).filter(Boolean)
          : [],
        subjects: subjectsInput
          ? subjectsInput.split(',').map((s) => s.trim()).filter(Boolean)
          : ['Geral'],
      }

      await createThread.mutateAsync(dataToSend)
      toast.success('Thread criada com sucesso!')
      setOpen(false)
      // Reset form
      setFormData({
        title: '',
        description: '',
        semester: 1,
        courses: [],
        subjects: ['Geral'],
      })
      setCoursesInput('')
      setSubjectsInput('Geral')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erro ao criar thread')
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Thread
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Thread</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar uma nova thread de discussão.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Título <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Digite o título da thread..."
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              maxLength={200}
              required
            />
            <p className="text-xs text-muted-foreground">
              {formData.title.length}/200 caracteres
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva sua thread (opcional)..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              maxLength={500}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              {formData.description?.length || 0}/500 caracteres
            </p>
          </div>

          {/* Semester */}
          <div className="space-y-2">
            <Label htmlFor="semester">Semestre</Label>
            <Input
              id="semester"
              type="number"
              min={1}
              max={10}
              value={formData.semester}
              onChange={(e) =>
                setFormData({ ...formData, semester: parseInt(e.target.value) })
              }
            />
            <p className="text-xs text-muted-foreground">
              Escolha o semestre (1-10)
            </p>
          </div>

          {/* Courses */}
          <div className="space-y-2">
            <Label htmlFor="courses">Cursos</Label>
            <Input
              id="courses"
              placeholder="Ex: Engenharia, Administração (separados por vírgula)"
              value={coursesInput}
              onChange={(e) => setCoursesInput(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Separe os cursos por vírgula
            </p>
          </div>

          {/* Subjects */}
          <div className="space-y-2">
            <Label htmlFor="subjects">Disciplinas</Label>
            <Input
              id="subjects"
              placeholder="Ex: Cálculo, Física, Programação (separados por vírgula)"
              value={subjectsInput}
              onChange={(e) => setSubjectsInput(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Separe as disciplinas por vírgula. Padrão: Geral
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createThread.isPending}>
              {createThread.isPending ? 'Criando...' : 'Criar Thread'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

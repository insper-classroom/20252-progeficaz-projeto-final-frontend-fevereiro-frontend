import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { useAuth } from '~/providers'
import { useThreads, useFiltersConfig } from '~/hooks'
import {
  useUpvoteObj,
  useDownvoteObj,
} from '~/hooks/use-votes'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Skeleton } from '~/components/ui/skeleton'
import { Separator } from '~/components/ui/separator'
import { Checkbox } from '~/components/ui/checkbox'
import { ScrollArea } from '~/components/ui/scroll-area'
import { VoteButtons } from '~/components/VoteButtons'
import { CreateThreadDialog } from '~/components/CreateThreadDialog'
import { Search, LogOut, User, Filter, X } from 'lucide-react'
import { GalleryVerticalEnd } from "lucide-react"
import { toast } from 'sonner'
import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {


  return [
    { title: 'Insper quest ' },
    { name: 'description', content: 'Insper quest  - Thread Management System' },
  ]
}

export default function Home() {
  const navigate = useNavigate()

  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth()
  const { data: threads, isLoading: threadsLoading } = useThreads()
  const { data: filtersConfig, isLoading: filtersLoading } = useFiltersConfig()

  const [searchQuery, setSearchQuery] = useState('')

  // Inject a small client-side stylesheet so very long words/texts will break
  // instead of creating a horizontal scroll inside the thread cards.
  if (typeof document !== 'undefined' && !document.getElementById('threads-break-style')) {
    const style = document.createElement('style')
    style.id = 'threads-break-style'
    style.textContent = `
      /* Allow long unbroken text to wrap inside the thread cards */
      .group h3,
      .group p,
      .group .line-clamp-2 {
        overflow-wrap: anywhere;
        word-break: break-word;
        white-space: normal;
      }
    `
    document.head.appendChild(style)
  }
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  // Vote mutations
  const upvoteObj = useUpvoteObj()
  const downvoteObj = useDownvoteObj()

  const handleLogout = () => {
    logout()
    toast.info('Logged out', {
      description: 'You have been logged out successfully.',
    })
    navigate('/login')
  }

  // Filter threads based on search and active filters
  const filteredThreads = threads?.filter((thread) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        thread.title.toLowerCase().includes(query) ||
        thread.description?.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    // Dynamic filters (to be implemented)
    // TODO: Apply dynamic filters based on activeFilters and thread properties

    return true
  })

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container max-w-7xl mx-auto">
          <div className="flex h-16 items-center justify-between gap-6">
            {/* App Name */}
            <div className="flex items-center shrink-0 gap-2">
              <img
                src="app/components/img/logo.png" 
                alt="Insper Quest Logo"
                className="h-10 w-10 rounded-full object-cover" // Faz a imagem ficar circular
              />
              <h1 className="text-2xl font-bold">Insper quest</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search threads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="max-w-[200px] truncate">{user?.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="container max-w-7xl mx-auto py-8 h-[calc(100vh-8rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-8 h-full">
            
            {/* Sidebar Esquerda */}
            <aside className="flex flex-col h-full min-h-0">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <h2 className="font-semibold">Filters</h2>
                </div>
                {Object.keys(activeFilters).some(
                  (key) => activeFilters[key].length > 0
                ) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveFilters({})}
                    className="h-7 px-2 text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-6 pr-4 pb-4">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-foreground/90">
                      Áreas de Interesse
                    </h3>
                    <div className="space-y-2.5">
                      {[
                        { id: "computacao", label: "Ciência da Computação" },
                        { id: "engenharias", label: "Engenharias" },
                        { id: "economia", label: "Economia" },
                        { id: "administracao", label: "Administração" },
                      ].map((filter) => {
                        const isSelected = activeFilters["area"]?.includes(filter.id)
                        return (
                          <div
                            key={filter.id}
                            className="flex items-center space-x-2.5"
                          >
                            <Checkbox
                              id={`area-${filter.id}`}
                              checked={isSelected || false}
                              onCheckedChange={(checked) => {
                                setActiveFilters((prev) => {
                                  const current = prev["area"] || []
                                  if (checked) {
                                    return {
                                      ...prev,
                                      area: [...current, filter.id],
                                    }
                                  } else {
                                    return {
                                      ...prev,
                                      area: current.filter((v) => v !== filter.id),
                                    }
                                  }
                                })
                              }}
                            />
                            <label
                              htmlFor={`area-${filter.id}`}
                              className="text-sm cursor-pointer select-none"
                            >
                              {filter.label}
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </aside>

            {/* Área Principal */}
            <section className="flex flex-col h-full min-h-0 border-l  pl-8 pr-8">
              <div className="flex items-baseline justify-between border-b pb-3 mb-4 shrink-0">
                <div>
                  <h2 className="text-xl font-semibold">
                    Threads
                  </h2>
                  {filteredThreads && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {filteredThreads.length} {filteredThreads.length === 1 ? 'result' : 'results'}
                    </p>
                  )}
                </div>
                <CreateThreadDialog />
              </div>

              <ScrollArea className="flex-1 min-h-0 h-full">
                <div className="pr-4 pb-4">
                  {threadsLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ) : filteredThreads?.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        {searchQuery
                          ? 'No threads match your search.'
                          : 'No threads available.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredThreads?.map((thread) => (
                        <div
                          key={thread.id}
                          className="group py-4 px-5 rounded-lg border bg-card hover:bg-accent/5 hover:shadow-sm transition-all"
                        >
                          <div className="flex gap-3">
                            <VoteButtons
                              score={thread.score}
                              userVote={thread.user_vote}
                              onUpvote={() => upvoteObj.mutate({ postId: thread.id, objType: "threads" })}
                              onDownvote={() => downvoteObj.mutate({ postId: thread.id, objType: "threads" })}
                              isLoading={
                                upvoteObj.isPending ||
                                downvoteObj.isPending
                              }
                              size="sm"
                              orientation="vertical"
                            />
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => navigate(`/threads/${thread.id}`)}
                            >
                              <h3 className="font-medium text-base mb-1 group-hover:text-primary transition-colors">
                                {thread.title}
                              </h3>
                              {thread.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                  {thread.description}
                                </p>
                              )}
                              <div className="flex items-center gap-3 text-xs text-muted-foreground/80">
                                <span>
                                  {new Date(thread.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </span>
                                {thread.posts && thread.posts.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <span>
                                      {thread.posts.length} {thread.posts.length === 1 ? 'comentário' : 'comentários'}
                                    </span>
                                  </>
                                )}
                                {/* Adicionando o autor */}
                                <span>•</span>
                                <span className="font-medium text-muted-foreground">
                                  Por: {thread.author || 'Desconhecido'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </section>

            {/* Sidebar Direita */}
            <aside className="flex flex-col h-full min-h-0 border-l pl-4">
              <div className="flex flex-col items-center gap-4 py-6">
                {/* Foto do Usuário */}
                <div className="relative w-24 h-24 rounded-full bg-muted">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    title="Adicionar foto"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Lógica para salvar a foto do usuário
                        console.log("Foto selecionada:", file);
                      }
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    Adicionar Foto
                  </span>
                </div>

                {/* Nome do Usuário */}
                <h3 className="text-lg font-semibold">{user?.name || "Usuário"}</h3>

                {/* Estatísticas */}
                <div className="flex flex-col items-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    Perguntas feitas: <span className="font-medium">{user?.questionsAsked || 0}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Perguntas respondidas: <span className="font-medium">{user?.questionsAnswered || 0}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}

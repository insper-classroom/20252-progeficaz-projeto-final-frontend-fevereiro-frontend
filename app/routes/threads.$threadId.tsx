import { ArrowLeft, MessageSquare, Send } from 'lucide-react'
import { useEffect, useState } from 'react' // Adicionado useEffect para melhor prática
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'
import { Textarea } from '~/components/ui/textarea'
import { VoteButtons } from '~/components/VoteButtons'
import { useCreatePost } from '~/hooks/use-posts'
import { ReportModal } from '~/components/ReportModal'
import { useThread } from '~/hooks/use-threads'
import {
  useDownvoteObj,
  useUpvoteObj,
  // Se precisar, importe useRemoveVoteObj aqui
} from '~/hooks/use-votes'
import { useAuth } from '~/providers'

export default function ThreadPage() {
  const { threadId } = useParams<{ threadId: string }>() // Tipagem mais específica
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [newComment, setNewComment] = useState('')

  // Garantindo que threadId exista antes de passar para o hook
  const { data: thread, isLoading, error } = useThread(threadId!)
  const createPost = useCreatePost()

  // Vote mutations
  const upvoteObj = useUpvoteObj()
  const downvoteObj = useDownvoteObj()

  // CORREÇÃO: Usar useEffect para navegação é uma prática mais segura
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  // Se o usuário não está autenticado, renderiza nulo enquanto o useEffect redireciona.
  if (!isAuthenticated) {
    return null
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) {
      toast.error('O comentário não pode estar vazio')
      return
    }

    try {
      await createPost.mutateAsync({
        threadId: threadId!,
        data: {
          content: newComment,
        },
      })
      setNewComment('')
      toast.success('Comentário enviado com sucesso!')
    } catch (error) {
      toast.error('Erro ao enviar comentário')
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (error || !thread) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Thread não encontrada
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  // CORREÇÃO: O fechamento do if e o início do corpo principal
  const posts = thread.posts || []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card" >
        <div className="max-w-4xl mx-auto p-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <div className="flex gap-4">
            {/* VOTE BUTTONS: Bloco correto mantido para a Thread */}
            <VoteButtons
              score={thread.score}
              userVote={thread.user_vote}
              onUpvote={() => upvoteObj.mutate({ postId: threadId!, objType: "threads" })}
              onDownvote={() => downvoteObj.mutate({ postId: threadId!, objType: "threads" })}
              isLoading={
                upvoteObj.isPending ||
                downvoteObj.isPending
              }
              size="lg"
            />

            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{thread.title}</h1>
                {thread.description && (
                  <p className="text-muted-foreground">{thread.description}</p>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  Criado em {new Date(thread.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {/* Botões de upvote e downvote DUPLICADOS E INCORRETOS FORAM REMOVIDOS AQUI */}
              
            </div>
          </div>
            <div>
                <ReportModal
                    contentId={thread.id}
                    contentType="post"
                >
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-red-500 hover:text-red-600">
                        Reportar
                    </Button>
                </ReportModal>

                
            </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Comment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Adicionar comentário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <Textarea
                placeholder="Escreva seu comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={createPost.isPending || !newComment.trim()}
                >
                  {createPost.isPending ? (
                    'Enviando...'
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Posts/Comments List */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comentários ({posts.length})
          </h2>

          {posts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                Nenhum comentário ainda. Seja o primeiro a comentar!
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4 pr-4">
                {posts.map((post, index) => (
                  <Card key={post.id} className="hover:bg-accent/50 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex gap-3">
                        <VoteButtons
                          score={post.score}
                          userVote={post.user_vote}
                          onUpvote={() => upvoteObj.mutate({ postId: post.id, objType: "posts" })}
                          onDownvote={() => downvoteObj.mutate({ postId: post.id, objType: "posts" })}
                          isLoading={
                            upvoteObj.isPending ||
                            downvoteObj.isPending
                          }
                          size="sm"
                        />
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-sm">{post.author}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(post.created_at).toLocaleString('pt-BR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            {user?.email === post.author && (
                              <Button variant="ghost" size="sm">
                                Editar
                              </Button>
                            )}
                          </div>
                          <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
                        </div>
                      </div>
                    </CardContent>
                    {/* Usar o Separator apenas entre os posts */}
                    {index < posts.length - 1 && <Separator />}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  )
}
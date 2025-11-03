import { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router'
import { useAuth } from '~/providers'
import {
  useThread,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  useUpdateThread,
  useDeleteThread,
  useUpvote,
  useDownvote,
  usePinPost,
  useUnpinPost,
  useCurrentUser,
} from '~/hooks'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import { Skeleton } from '~/components/ui/skeleton'
import { Badge } from '~/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Calendar,
  User,
  Pin,
  PinOff,
  Edit,
  Trash2,
  Send,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Route } from './+types/thread.$id'

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Thread - Fevereiro` },
    { name: 'description', content: 'Thread details' },
  ]
}

export default function ThreadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: currentUser } = useCurrentUser()

  // Load thread data
  const { data: thread, isLoading: threadLoading } = useThread(id!)

  // Mutations
  const { mutate: createPost } = useCreatePost()
  const { mutate: updatePost } = useUpdatePost()
  const { mutate: deletePost } = useDeletePost()
  const { mutate: updateThread } = useUpdateThread()
  const { mutate: deleteThread } = useDeleteThread()
  const { mutate: upvote } = useUpvote()
  const { mutate: downvote } = useDownvote()
  const { mutate: pinPost } = usePinPost()
  const { mutate: unpinPost } = useUnpinPost()

  // State
  const [newPostContent, setNewPostContent] = useState('')
  const [editingPost, setEditingPost] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<{
    open: boolean
    type: 'thread' | 'post'
    id: string
  }>({ open: false, type: 'post', id: '' })

  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast.error('Please enter a message')
      return
    }

    createPost(
      { threadId: id!, data: { content: newPostContent } },
      {
        onSuccess: () => {
          toast.success('Post created!')
          setNewPostContent('')
        },
        onError: (error: any) => {
          toast.error('Failed to create post', {
            description: error?.response?.data?.error || error?.message,
          })
        },
      }
    )
  }

  const handleUpdatePost = (postId: string) => {
    if (!editContent.trim()) {
      toast.error('Please enter a message')
      return
    }

    updatePost(
      { postId, data: { content: editContent } },
      {
        onSuccess: () => {
          toast.success('Post updated!')
          setEditingPost(null)
          setEditContent('')
        },
        onError: (error: any) => {
          toast.error('Failed to update post', {
            description: error?.response?.data?.error || error?.message,
          })
        },
      }
    )
  }

  const handleDeletePost = (postId: string) => {
    deletePost(postId, {
      onSuccess: () => {
        toast.success('Post deleted!')
        setDeleteDialogOpen({ open: false, type: 'post', id: '' })
      },
      onError: (error: any) => {
        toast.error('Failed to delete post', {
          description: error?.response?.data?.error || error?.message,
        })
      },
    })
  }

  const handleDeleteThread = () => {
    if (!id) return

    deleteThread(id, {
      onSuccess: () => {
        toast.success('Thread deleted!')
        navigate('/')
      },
      onError: (error: any) => {
        toast.error('Failed to delete thread', {
          description: error?.response?.data?.error || error?.message,
        })
      },
    })
  }

  const handleVote = (
    type: 'upvote' | 'downvote',
    objectType: 'threads' | 'posts',
    objectId: string
  ) => {
    const voteAction = type === 'upvote' ? upvote : downvote

    voteAction(
      { objType: objectType, objectId },
      {
        onError: (error: any) => {
          toast.error('Failed to vote', {
            description: error?.response?.data?.error || error?.message,
          })
        },
      }
    )
  }

  const handlePinToggle = (postId: string, isPinned: boolean) => {
    const action = isPinned ? unpinPost : pinPost

    action(postId, {
      onSuccess: () => {
        toast.success(isPinned ? 'Post unpinned' : 'Post pinned')
      },
      onError: (error: any) => {
        toast.error('Failed to pin/unpin post', {
          description: error?.response?.data?.error || error?.message,
        })
      },
    })
  }

  if (authLoading || threadLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!thread) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Thread not found</h2>
          <Button onClick={() => navigate('/')}>Go back</Button>
        </div>
      </div>
    )
  }

  const isThreadAuthor = thread.author === currentUser?.username || thread.author === currentUser?.email

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Fevereiro
            </h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Thread card */}
          <div className="border rounded-lg bg-card">
            <div className="flex gap-4 p-6">
              {/* Vote section */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant={thread.user_vote === 'upvote' ? 'default' : 'ghost'}
                  className="h-9 w-9 p-0"
                  onClick={() => handleVote('upvote', 'threads', thread.id)}
                >
                  <ArrowUp className="h-5 w-5" />
                </Button>
                <span className="text-lg font-bold">{thread.score}</span>
                <Button
                  size="sm"
                  variant={
                    thread.user_vote === 'downvote' ? 'destructive' : 'ghost'
                  }
                  className="h-9 w-9 p-0"
                  onClick={() => handleVote('downvote', 'threads', thread.id)}
                >
                  <ArrowDown className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{thread.title}</h2>
                    {thread.description && (
                      <p className="text-muted-foreground mb-4">
                        {thread.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  {isThreadAuthor && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            setDeleteDialogOpen({
                              open: true,
                              type: 'thread',
                              id: thread.id,
                            })
                          }
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete thread
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {thread.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(thread.created_at).toLocaleString()}
                  </span>
                  {thread.semester && (
                    <Badge variant="outline">{thread.semester}º Sem</Badge>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {thread.courses?.map((course) => (
                    <Badge key={course} variant="secondary">
                      {course}
                    </Badge>
                  ))}
                  {thread.subjects?.map((subject) => (
                    <Badge key={subject} variant="outline">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Posts section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Responses ({thread.posts?.length || 0})
              </h3>
            </div>

            {/* Create post */}
            <div className="border rounded-lg bg-card p-4">
              <Label htmlFor="new-post" className="mb-2 block">
                Add a response
              </Label>
              <Textarea
                id="new-post"
                placeholder="Share your thoughts..."
                rows={3}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="mb-2"
              />
              <div className="flex justify-end">
                <Button onClick={handleCreatePost} className="gap-2">
                  <Send className="h-4 w-4" />
                  Post
                </Button>
              </div>
            </div>

            {/* Posts list */}
            {thread.posts && thread.posts.length > 0 ? (
              <div className="space-y-3">
                {thread.posts.map((post) => {
                  const isPostAuthor = post.author === currentUser?.username || post.author === currentUser?.email
                  const isEditing = editingPost === post.id

                  return (
                    <div
                      key={post.id}
                      className={`border rounded-lg bg-card ${
                        post.pinned ? 'ring-2 ring-primary/20' : ''
                      }`}
                    >
                      <div className="flex gap-4 p-4">
                        {/* Vote section */}
                        <div className="flex flex-col items-center gap-1 shrink-0">
                          <Button
                            size="sm"
                            variant={
                              post.user_vote === 'upvote' ? 'default' : 'ghost'
                            }
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              handleVote('upvote', 'posts', post.id)
                            }
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-semibold">
                            {post.score}
                          </span>
                          <Button
                            size="sm"
                            variant={
                              post.user_vote === 'downvote'
                                ? 'destructive'
                                : 'ghost'
                            }
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              handleVote('downvote', 'posts', post.id)
                            }
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span>{post.author}</span>
                              <span>•</span>
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(post.created_at).toLocaleString()}
                              </span>
                              {post.pinned && (
                                <>
                                  <span>•</span>
                                  <Badge variant="secondary" className="gap-1">
                                    <Pin className="h-3 w-3" />
                                    Pinned
                                  </Badge>
                                </>
                              )}
                            </div>

                            {/* Actions */}
                            {(isPostAuthor || isThreadAuthor) && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {isThreadAuthor && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handlePinToggle(post.id, post.pinned)
                                        }
                                      >
                                        {post.pinned ? (
                                          <>
                                            <PinOff className="h-4 w-4 mr-2" />
                                            Unpin
                                          </>
                                        ) : (
                                          <>
                                            <Pin className="h-4 w-4 mr-2" />
                                            Pin
                                          </>
                                        )}
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                    </>
                                  )}
                                  {isPostAuthor && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setEditingPost(post.id)
                                          setEditContent(post.content)
                                        }}
                                      >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          setDeleteDialogOpen({
                                            open: true,
                                            type: 'post',
                                            id: post.id,
                                          })
                                        }
                                        className="text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>

                          {isEditing ? (
                            <div className="space-y-2">
                              <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows={3}
                              />
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingPost(null)
                                    setEditContent('')
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdatePost(post.id)}
                                >
                                  Save
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-foreground whitespace-pre-wrap">
                              {post.content}
                            </p>
                          )}

                          {post.updated_at !== post.created_at && (
                            <p className="text-xs text-muted-foreground mt-2">
                              (edited)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">
                  No responses yet. Be the first to respond!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen.open}
        onOpenChange={(open) =>
          setDeleteDialogOpen({ ...deleteDialogOpen, open })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete {deleteDialogOpen.type === 'thread' ? 'Thread' : 'Post'}?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this{' '}
              {deleteDialogOpen.type}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() =>
                setDeleteDialogOpen({ ...deleteDialogOpen, open: false })
              }
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteDialogOpen.type === 'thread') {
                  handleDeleteThread()
                } else {
                  handleDeletePost(deleteDialogOpen.id)
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

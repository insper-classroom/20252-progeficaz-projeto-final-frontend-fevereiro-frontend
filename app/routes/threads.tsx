import { useState } from 'react'
import { useThreads, useCreateThread, useDeleteThread } from '~/hooks'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Skeleton } from '~/components/ui/skeleton'
import { Separator } from '~/components/ui/separator'
import { toast } from 'sonner'
import type { Route } from './+types/threads'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Threads' },
    { name: 'description', content: 'Manage your threads' },
  ]
}

export default function Threads() {
  const { data: threads, isLoading, error } = useThreads()
  const createThread = useCreateThread()
  const deleteThread = useDeleteThread()

  const [newThread, setNewThread] = useState({
    title: '',
    description: '',
  })

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault()
    createThread.mutate(newThread, {
      onSuccess: (thread) => {
        setNewThread({ title: '', description: '' })
        toast.success('Thread created!', {
          description: `"${thread.title}" has been created successfully.`,
        })
      },
      onError: (error: any) => {
        toast.error('Failed to create thread', {
          description:
            error?.response?.data?.message ||
            error?.message ||
            'Something went wrong. Please try again.',
        })
      },
    })
  }

  const handleDeleteThread = (threadId: string, threadTitle: string) => {
    if (confirm('Are you sure you want to delete this thread?')) {
      deleteThread.mutate(threadId, {
        onSuccess: () => {
          toast.success('Thread deleted', {
            description: `"${threadTitle}" has been deleted.`,
          })
        },
        onError: (error: any) => {
          toast.error('Failed to delete thread', {
            description:
              error?.response?.data?.message ||
              error?.message ||
              'Something went wrong. Please try again.',
          })
        },
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-[120px]" />
          </CardContent>
        </Card>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading threads: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Threads</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage discussion threads
        </p>
      </div>

      {/* Create Thread Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Thread</CardTitle>
          <CardDescription>
            Start a new discussion by creating a thread
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateThread} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter thread title"
                required
                value={newThread.title}
                onChange={(e) =>
                  setNewThread({ ...newThread, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter thread description (optional)"
                rows={3}
                value={newThread.description}
                onChange={(e) =>
                  setNewThread({ ...newThread, description: e.target.value })
                }
              />
            </div>

            <Button type="submit" disabled={createThread.isPending}>
              {createThread.isPending ? 'Creating...' : 'Create Thread'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Threads List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">All Threads</h2>
        {threads?.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No threads yet. Create one above!
              </p>
            </CardContent>
          </Card>
        ) : (
          threads?.map((thread) => (
            <Card key={thread.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle>{thread.title}</CardTitle>
                    {thread.description && (
                      <CardDescription className="mt-2">
                        {thread.description}
                      </CardDescription>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteThread(thread.id, thread.title)}
                    disabled={deleteThread.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(thread.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

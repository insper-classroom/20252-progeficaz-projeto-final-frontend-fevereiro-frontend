import {
  ArrowDown,
  ArrowUp,
  Calendar,
  LogOut,
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
  User,
  Flag,
  SearchIcon,
  Edit,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { ReportDialog } from '~/components/report-dialog'
import { AdvancedSearchDialog } from '~/components/advanced-search-dialog'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
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
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import { Textarea } from '~/components/ui/textarea'
import {
  useCourses,
  useCreateThread,
  useUpdateThread,
  useDeleteThread,
  useCurrentUser,
  useDownvote,
  useSemesters,
  useSubjects,
  useThreads,
  useUpvote,
} from '~/hooks'
import { useAuth } from '~/providers'
import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Fevereiro - Forum' },
    { name: 'description', content: 'Fevereiro - Insper Forum' },
  ]
}

export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth()
  const { data: currentUser } = useCurrentUser()

  // Filters state
  const [selectedSemester, setSelectedSemester] = useState<number>()
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Load data
  const { data: threads, isLoading: threadsLoading } = useThreads({
    semester: selectedSemester,
    courses: selectedCourses.length > 0 ? selectedCourses : undefined,
  })
  const { data: semesters } = useSemesters()
  const { data: courses } = useCourses()
  const { data: subjects } = useSubjects({
    courses: selectedCourses.length > 0 ? selectedCourses : undefined,
    semester: selectedSemester,
  })

  // Mutations
  const { mutate: createThread } = useCreateThread()
  const { mutate: updateThread } = useUpdateThread()
  const { mutate: deleteThread } = useDeleteThread()
  const { mutate: upvote } = useUpvote()
  const { mutate: downvote } = useDownvote()

  // Dialogs state
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false)
  const [reportDialog, setReportDialog] = useState<{
    open: boolean
    contentType: 'thread' | 'post'
    contentId: string
    contentPreview?: string
  }>({ open: false, contentType: 'thread', contentId: '' })
  const [editingThread, setEditingThread] = useState<{
    open: boolean
    threadId: string
    data: any
  } | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<{
    open: boolean
    threadId: string
  }>({ open: false, threadId: '' })
  const [newThread, setNewThread] = useState({
    title: '',
    description: '',
    semester: '',
    courses: [] as string[],
    subjects: [] as string[],
  })

  const handleLogout = () => {
    logout()
    toast.info('Logged out successfully')
    navigate('/login')
  }

  const handleDeleteThread = (threadId: string) => {
    deleteThread(threadId, {
      onSuccess: () => {
        toast.success('Thread deleted successfully!')
        setDeleteDialogOpen({ open: false, threadId: '' })
      },
      onError: (error: any) => {
        toast.error('Failed to delete thread', {
          description: error?.response?.data?.error || error?.message,
        })
      },
    })
  }

  const handleCreateThread = () => {
    if (!newThread.title || !newThread.semester) {
      toast.error('Please fill in required fields')
      return
    }

    createThread(
      {
        title: newThread.title,
        description: newThread.description || undefined,
        semester: parseInt(newThread.semester),
        courses: newThread.courses.length > 0 ? newThread.courses : undefined,
        subjects: newThread.subjects.length > 0 ? newThread.subjects : undefined,
      },
      {
        onSuccess: () => {
          toast.success('Thread created successfully!')
          setCreateDialogOpen(false)
          setNewThread({
            title: '',
            description: '',
            semester: '',
            courses: [],
            subjects: [],
          })
        },
        onError: (error: any) => {
          toast.error('Failed to create thread', {
            description: error?.response?.data?.error || error?.message,
          })
        },
      }
    )
  }

  const handleVote = (
    type: 'upvote' | 'downvote',
    threadId: string
  ) => {
    const voteAction = type === 'upvote' ? upvote : downvote

    voteAction(
      { objType: 'threads', objectId: threadId },
      {
        onError: (error: any) => {
          toast.error('Failed to vote', {
            description: error?.response?.data?.error || error?.message,
          })
        },
      }
    )
  }

  // Filter threads by search
  const filteredThreads = threads?.filter((thread) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      thread.title.toLowerCase().includes(query) ||
      thread.description?.toLowerCase().includes(query) ||
      thread.author.toLowerCase().includes(query)
    )
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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <h1 className="text-2xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Fevereiro
              </h1>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xl flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Quick search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAdvancedSearchOpen(true)}
                className="gap-2 shrink-0"
              >
                <SearchIcon className="h-4 w-4" />
                <span className="hidden md:inline">Advanced</span>
              </Button>
            </div>

            {/* User menu */}
            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/reports')}
                className="gap-2"
              >
                <Flag className="h-4 w-4" />
                <span className="hidden md:inline">Reports</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline max-w-[150px] truncate">
                      {currentUser?.username || currentUser?.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
            {/* Feed */}
            <div className="space-y-4">
              {/* Create thread button */}
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full gap-2" size="lg">
                    <Plus className="h-5 w-5" />
                    Create Thread
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Thread</DialogTitle>
                    <DialogDescription>
                      Share your question or start a discussion
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">
                        Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        placeholder="What's your question?"
                        maxLength={200}
                        value={newThread.title}
                        onChange={(e) =>
                          setNewThread({ ...newThread, title: e.target.value })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        {newThread.title.length}/200 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description (optional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide more details..."
                        maxLength={500}
                        rows={4}
                        value={newThread.description}
                        onChange={(e) =>
                          setNewThread({
                            ...newThread,
                            description: e.target.value,
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        {newThread.description.length}/500 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="semester">
                        Semester <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={newThread.semester}
                        onValueChange={(value) =>
                          setNewThread({ ...newThread, semester: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(semesters) &&
                            semesters.map((sem: any) => (
                              <SelectItem
                                key={sem.id}
                                value={sem.id.toString()}
                              >
                                {sem.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Courses (optional)</Label>
                        <Select
                          value=""
                          onValueChange={(value) => {
                            if (!newThread.courses.includes(value)) {
                              setNewThread({
                                ...newThread,
                                courses: [...newThread.courses, value],
                              })
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Add course" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.isArray(courses) &&
                              courses.map((course: any) => (
                                <SelectItem key={course.id} value={course.id}>
                                  {course.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-1">
                          {newThread.courses.map((courseId) => {
                            const course = Array.isArray(courses)
                              ? courses.find((c: any) => c.id === courseId)
                              : null
                            const courseName = course && typeof course === 'object' ? course.name : courseId
                            return (
                              <Badge
                                key={courseId}
                                variant="secondary"
                                className="cursor-pointer"
                                onClick={() =>
                                  setNewThread({
                                    ...newThread,
                                    courses: newThread.courses.filter(
                                      (c) => c !== courseId
                                    ),
                                  })
                                }
                              >
                                {courseName} ×
                              </Badge>
                            )
                          })}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Subjects (optional)</Label>
                        <Select
                          value=""
                          onValueChange={(value) => {
                            if (!newThread.subjects.includes(value)) {
                              setNewThread({
                                ...newThread,
                                subjects: [...newThread.subjects, value],
                              })
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Add subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.isArray(subjects) &&
                              subjects.map((subject: any, idx: number) => (
                                <SelectItem
                                  key={idx}
                                  value={typeof subject === 'string' ? subject : subject.name}
                                >
                                  {typeof subject === 'string' ? subject : subject.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-1">
                          {newThread.subjects.map((subject) => (
                            <Badge
                              key={subject}
                              variant="secondary"
                              className="cursor-pointer"
                              onClick={() =>
                                setNewThread({
                                  ...newThread,
                                  subjects: newThread.subjects.filter(
                                    (s) => s !== subject
                                  ),
                                })
                              }
                            >
                              {subject} ×
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setCreateDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreateThread}>Create Thread</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Threads list */}
              {threadsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-40 w-full" />
                  ))}
                </div>
              ) : filteredThreads && filteredThreads.length > 0 ? (
                <div className="space-y-3">
                  {filteredThreads.map((thread) => (
                    <div
                      key={thread.id}
                      className="group relative border rounded-lg bg-card hover:shadow-md transition-all"
                    >
                      <div className="flex gap-4 p-4">
                        {/* Vote section */}
                        <div className="flex flex-col items-center gap-1 shrink-0">
                          <Button
                            size="sm"
                            variant={
                              thread.user_vote === 'upvote' ? 'default' : 'ghost'
                            }
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              handleVote('upvote', thread.id)
                            }
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-semibold min-w-[2ch] text-center">
                            {thread.score}
                          </span>
                          <Button
                            size="sm"
                            variant={
                              thread.user_vote === 'downvote'
                                ? 'destructive'
                                : 'ghost'
                            }
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              handleVote('downvote', thread.id)
                            }
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Content */}
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => navigate(`/thread/${thread.id}`)}
                        >
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                            {thread.title}
                          </h3>
                          {thread.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {thread.description}
                            </p>
                          )}

                          {/* Metadata */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {thread.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(thread.created_at).toLocaleDateString()}
                            </span>
                            {thread.semester && (
                              <Badge variant="outline" className="text-xs">
                                {thread.semester}º Sem
                              </Badge>
                            )}
                            {thread.courses?.map((course) => (
                              <Badge
                                key={course}
                                variant="secondary"
                                className="text-xs"
                              >
                                {course}
                              </Badge>
                            ))}
                          </div>

                          {thread.subjects && thread.subjects.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {thread.subjects.slice(0, 3).map((subject) => (
                                <Badge
                                  key={subject}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {subject}
                                </Badge>
                              ))}
                              {thread.subjects.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{thread.subjects.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="shrink-0">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => navigate(`/thread/${thread.id}`)}
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                View thread
                              </DropdownMenuItem>
                              {(thread.author === currentUser?.username ||
                                thread.author === currentUser?.email) && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      setDeleteDialogOpen({
                                        open: true,
                                        threadId: thread.id,
                                      })
                                    }
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem
                                onClick={() =>
                                  setReportDialog({
                                    open: true,
                                    contentType: 'thread',
                                    contentId: thread.id,
                                    contentPreview: thread.title,
                                  })
                                }
                              >
                                <Flag className="h-4 w-4 mr-2" />
                                Report
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? 'No threads match your search'
                      : 'No threads yet. Be the first to create one!'}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar with filters */}
            <aside className="space-y-4">
              <div className="sticky top-20 space-y-4">
                {/* Semester filter */}
                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold">Filter by Semester</h3>
                  <div className="space-y-2">
                    <Select
                      value={selectedSemester?.toString() || ''}
                      onValueChange={(value) =>
                        setSelectedSemester(value ? parseInt(value) : undefined)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All semesters" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(semesters) &&
                          semesters.map((sem: any) => (
                            <SelectItem key={sem.id} value={sem.id.toString()}>
                              {sem.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {selectedSemester && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSemester(undefined)}
                        className="w-full text-xs"
                      >
                        Clear semester filter
                      </Button>
                    )}
                  </div>
                </div>

                {/* Course filter */}
                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold">Filter by Course</h3>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (!selectedCourses.includes(value)) {
                        setSelectedCourses([...selectedCourses, value])
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Add course filter" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(courses) &&
                        courses.map((course: any) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {selectedCourses.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {selectedCourses.map((courseId) => {
                        const course = Array.isArray(courses)
                          ? courses.find((c: any) => c.id === courseId)
                          : null
                        const courseName = course && typeof course === 'object' ? course.name : courseId
                        return (
                          <Badge
                            key={courseId}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() =>
                              setSelectedCourses(
                                selectedCourses.filter((c) => c !== courseId)
                              )
                            }
                          >
                            {courseName} ×
                          </Badge>
                        )
                      })}
                    </div>
                  )}
                  {selectedCourses.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCourses([])}
                      className="w-full"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>

                {/* Stats */}
                <div className="border rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold mb-3">Statistics</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total threads</span>
                      <span className="font-medium">{threads?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Showing</span>
                      <span className="font-medium">
                        {filteredThreads?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <ReportDialog
        open={reportDialog.open}
        onOpenChange={(open) =>
          setReportDialog({ ...reportDialog, open })
        }
        contentType={reportDialog.contentType}
        contentId={reportDialog.contentId}
        contentPreview={reportDialog.contentPreview}
      />

      <AdvancedSearchDialog
        open={advancedSearchOpen}
        onOpenChange={setAdvancedSearchOpen}
      />

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen.open}
        onOpenChange={(open) =>
          setDeleteDialogOpen({ ...deleteDialogOpen, open })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Thread?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this
              thread and all its posts.
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
              onClick={() => handleDeleteThread(deleteDialogOpen.threadId)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

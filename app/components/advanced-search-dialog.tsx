import { useState } from 'react'
import { useSearchThreads, useSemesters, useCourses, useSubjects } from '~/hooks'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Badge } from '~/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import { Search, Calendar, User, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router'

interface AdvancedSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdvancedSearchDialog({
  open,
  onOpenChange,
}: AdvancedSearchDialogProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [semester, setSemester] = useState<number>()
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

  const { data: semesters } = useSemesters()
  const { data: courses } = useCourses()
  const { data: subjects } = useSubjects({
    courses: selectedCourses.length > 0 ? selectedCourses : undefined,
    semester,
  })

  const {
    data: searchResults,
    isLoading: searching,
    refetch,
  } = useSearchThreads(
    {
      q: query,
      semester,
      courses: selectedCourses.length > 0 ? selectedCourses : undefined,
      subjects: selectedSubjects.length > 0 ? selectedSubjects : undefined,
    },
    false // não executar automaticamente
  )

  const handleSearch = () => {
    if (!query.trim()) {
      return
    }
    refetch()
  }

  const handleClear = () => {
    setQuery('')
    setSemester(undefined)
    setSelectedCourses([])
    setSelectedSubjects([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Search
          </DialogTitle>
          <DialogDescription>
            Search threads with advanced filters
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Search query */}
          <div className="space-y-2">
            <Label htmlFor="search-query">Search Query *</Label>
            <div className="flex gap-2">
              <Input
                id="search-query"
                placeholder="Enter keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={!query.trim() || searching}>
                {searching ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester-filter">Semester</Label>
              <Select
                value={semester?.toString() || ''}
                onValueChange={(value) => setSemester(value ? parseInt(value) : undefined)}
              >
                <SelectTrigger id="semester-filter">
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
            </div>

            <div className="space-y-2">
              <Label>Courses</Label>
              <Select
                value=""
                onValueChange={(value) => {
                  if (!selectedCourses.includes(value)) {
                    setSelectedCourses([...selectedCourses, value])
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
              {selectedCourses.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedCourses.map((courseId) => {
                    const course = Array.isArray(courses)
                      ? courses.find((c: any) => c.id === courseId)
                      : null
                    const courseName =
                      course && typeof course === 'object' ? course.name : courseId
                    return (
                      <Badge
                        key={courseId}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() =>
                          setSelectedCourses(selectedCourses.filter((c) => c !== courseId))
                        }
                      >
                        {courseName} ×
                      </Badge>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Subjects</Label>
            <Select
              value=""
              onValueChange={(value) => {
                if (!selectedSubjects.includes(value)) {
                  setSelectedSubjects([...selectedSubjects, value])
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
            {selectedSubjects.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedSubjects.map((subject) => (
                  <Badge
                    key={subject}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject))
                    }
                  >
                    {subject} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClear} className="flex-1">
              Clear Filters
            </Button>
          </div>

          {/* Results */}
          {searchResults && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  Results ({searchResults.count})
                </h3>
              </div>

              {searching ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : searchResults.results.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {searchResults.results.map((result) => (
                    <div
                      key={result.id}
                      className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => {
                        navigate(`/thread/${result.id}`)
                        onOpenChange(false)
                      }}
                    >
                      <h4 className="font-medium text-sm mb-1 flex items-center justify-between">
                        {result.title}
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </h4>
                      {result.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {result.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {result.author}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(result.created_at).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{result.post_count} replies</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {result.score} pts
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No results found. Try different keywords or filters.
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

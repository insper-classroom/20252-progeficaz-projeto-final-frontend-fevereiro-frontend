import {
  AlertCircle,
  Calendar,
  FileWarning,
  Filter,
  LogOut,
  Search,
  User,
  BarChart3,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import { useCurrentUser, useReports } from '~/hooks'
import { useAuth } from '~/providers'
import type { ReportStatus, ReportType } from '~/types'
import type { Route } from './+types/reports'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Reports - Fevereiro' },
    { name: 'description', content: 'View and manage content reports' },
  ]
}

const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  sexual: 'Sexual Content',
  violence: 'Violence/Threats',
  discrimination: 'Discrimination/Hate Speech',
  scam: 'Scam/Fraud',
  self_harm: 'Self-harm/Suicide',
  spam: 'Spam',
  other: 'Other',
}

const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  pending: 'Pending',
  reviewed: 'Reviewing',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
}

const REPORT_STATUS_VARIANTS: Record<
  ReportStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending: 'secondary',
  reviewed: 'default',
  resolved: 'outline',
  dismissed: 'destructive',
}

export default function Reports() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth()
  const { data: currentUser } = useCurrentUser()
  const { data: reports, isLoading: reportsLoading } = useReports()

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<ReportType | 'all'>('all')
  const [contentTypeFilter, setContentTypeFilter] = useState<
    'thread' | 'post' | 'all'
  >('all')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Filter and search reports
  const filteredReports = useMemo(() => {
    if (!reports) return []

    return reports.filter((report) => {
      // Status filter
      if (statusFilter !== 'all' && report.status !== statusFilter) return false

      // Type filter
      if (typeFilter !== 'all' && report.report_type !== typeFilter)
        return false

      // Content type filter
      if (
        contentTypeFilter !== 'all' &&
        report.content_type !== contentTypeFilter
      )
        return false

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          report.id.toLowerCase().includes(query) ||
          report.reporter.toLowerCase().includes(query) ||
          report.description?.toLowerCase().includes(query) ||
          report.content_id.toLowerCase().includes(query)
        )
      }

      return true
    })
  }, [reports, statusFilter, typeFilter, contentTypeFilter, searchQuery])

  // Calculate statistics
  const stats = useMemo(() => {
    if (!reports) return null

    const total = reports.length
    const byStatus = reports.reduce(
      (acc, report) => {
        acc[report.status] = (acc[report.status] || 0) + 1
        return acc
      },
      {} as Record<ReportStatus, number>
    )

    const byType = reports.reduce(
      (acc, report) => {
        acc[report.report_type] = (acc[report.report_type] || 0) + 1
        return acc
      },
      {} as Record<ReportType, number>
    )

    return {
      total,
      pending: byStatus.pending || 0,
      reviewed: byStatus.reviewed || 0,
      resolved: byStatus.resolved || 0,
      dismissed: byStatus.dismissed || 0,
      byType,
    }
  }, [reports])

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
            <div className="flex items-center gap-4 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <h1 className="text-2xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Fevereiro
                </h1>
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <FileWarning className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Reports</h2>
              </div>
            </div>

            {/* User menu */}
            <div className="flex items-center gap-3 shrink-0">
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
                  <DropdownMenuItem onClick={() => navigate('/')}>
                    <Search className="h-4 w-4 mr-2" />
                    Home
                  </DropdownMenuItem>
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
            {/* Main content */}
            <div className="space-y-6">
              {/* Statistics Dashboard */}
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription className="flex items-center gap-2">
                        <FileWarning className="h-4 w-4" />
                        Total Reports
                      </CardDescription>
                      <CardTitle className="text-3xl">{stats.total}</CardTitle>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Pending
                      </CardDescription>
                      <CardTitle className="text-3xl text-yellow-600">
                        {stats.pending}
                      </CardTitle>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Resolved
                      </CardDescription>
                      <CardTitle className="text-3xl text-green-600">
                        {stats.resolved}
                      </CardTitle>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription className="flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        Dismissed
                      </CardDescription>
                      <CardTitle className="text-3xl text-red-600">
                        {stats.dismissed}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </div>
              )}

              {/* Filters and search */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search reports..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    {/* Status filter */}
                    <Select
                      value={statusFilter}
                      onValueChange={(value) =>
                        setStatusFilter(value as ReportStatus | 'all')
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewed">Reviewing</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="dismissed">Dismissed</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Type filter */}
                    <Select
                      value={typeFilter}
                      onValueChange={(value) =>
                        setTypeFilter(value as ReportType | 'all')
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        <SelectItem value="sexual">Sexual Content</SelectItem>
                        <SelectItem value="violence">
                          Violence/Threats
                        </SelectItem>
                        <SelectItem value="discrimination">
                          Discrimination
                        </SelectItem>
                        <SelectItem value="scam">Scam/Fraud</SelectItem>
                        <SelectItem value="self_harm">Self-harm</SelectItem>
                        <SelectItem value="spam">Spam</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Content type filter */}
                    <Select
                      value={contentTypeFilter}
                      onValueChange={(value) =>
                        setContentTypeFilter(value as 'thread' | 'post' | 'all')
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All content" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All content</SelectItem>
                        <SelectItem value="thread">Threads</SelectItem>
                        <SelectItem value="post">Posts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Active filters summary */}
                  {(statusFilter !== 'all' ||
                    typeFilter !== 'all' ||
                    contentTypeFilter !== 'all' ||
                    searchQuery) && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Active filters:
                      </span>
                      {statusFilter !== 'all' && (
                        <Badge variant="secondary">
                          Status: {REPORT_STATUS_LABELS[statusFilter]}
                        </Badge>
                      )}
                      {typeFilter !== 'all' && (
                        <Badge variant="secondary">
                          Type: {REPORT_TYPE_LABELS[typeFilter]}
                        </Badge>
                      )}
                      {contentTypeFilter !== 'all' && (
                        <Badge variant="secondary">
                          Content: {contentTypeFilter}
                        </Badge>
                      )}
                      {searchQuery && (
                        <Badge variant="secondary">Search: {searchQuery}</Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setStatusFilter('all')
                          setTypeFilter('all')
                          setContentTypeFilter('all')
                          setSearchQuery('')
                        }}
                        className="ml-auto"
                      >
                        Clear all
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reports list */}
              {reportsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : filteredReports.length > 0 ? (
                <div className="space-y-3">
                  {filteredReports.map((report) => (
                    <Card
                      key={report.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/reports/${report.id}`)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge
                                variant={REPORT_STATUS_VARIANTS[report.status]}
                              >
                                {REPORT_STATUS_LABELS[report.status]}
                              </Badge>
                              <Badge variant="outline">
                                {REPORT_TYPE_LABELS[report.report_type]}
                              </Badge>
                              <Badge variant="secondary">
                                {report.content_type}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg">
                              Report #{report.id.slice(0, 8)}
                            </CardTitle>
                          </div>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          {report.description && (
                            <p className="text-muted-foreground line-clamp-2">
                              {report.description}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Reported by: {report.reporter}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(report.created_at).toLocaleDateString()}{' '}
                              {new Date(report.created_at).toLocaleTimeString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Content ID: {report.content_id.slice(0, 8)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileWarning className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {searchQuery ||
                      statusFilter !== 'all' ||
                      typeFilter !== 'all' ||
                      contentTypeFilter !== 'all'
                        ? 'No reports match your filters'
                        : 'No reports yet'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-4">
              <div className="sticky top-20 space-y-4">
                {/* Report type distribution */}
                {stats && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <BarChart3 className="h-4 w-4" />
                        Report Types
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {Object.entries(stats.byType)
                        .sort(([, a], [, b]) => b - a)
                        .map(([type, count]) => (
                          <div
                            key={type}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-muted-foreground">
                              {REPORT_TYPE_LABELS[type as ReportType]}
                            </span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                )}

                {/* Quick stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Showing</span>
                      <span className="font-medium">
                        {filteredReports.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-medium">{reports?.length || 0}</span>
                    </div>
                    {stats && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Resolution Rate
                        </span>
                        <span className="font-medium">
                          {stats.total > 0
                            ? Math.round(
                                ((stats.resolved + stats.dismissed) /
                                  stats.total) *
                                  100
                              )
                            : 0}
                          %
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}

import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FileWarning,
  LogOut,
  MessageSquare,
  User,
  XCircle,
  ExternalLink,
} from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
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
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'
import { useCurrentUser, useReport } from '~/hooks'
import { useAuth } from '~/providers'
import type { ReportStatus, ReportType } from '~/types'
import type { Route } from './+types/report.$id'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Report Details - Fevereiro' },
    { name: 'description', content: 'View report details' },
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

const REPORT_TYPE_DESCRIPTIONS: Record<ReportType, string> = {
  sexual: 'Content containing explicit sexual material or adult content',
  violence:
    'Content depicting or threatening violence, harm, or dangerous activities',
  discrimination:
    'Content promoting discrimination, hate speech, or targeting protected groups',
  scam: 'Fraudulent content, scams, or attempts to deceive users',
  self_harm:
    'Content promoting or depicting self-harm, suicide, or eating disorders',
  spam: 'Unsolicited, repetitive, or irrelevant content',
  other: 'Other violations not covered by the categories above',
}

const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  pending: 'Pending Review',
  reviewed: 'Under Review',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
}

const REPORT_STATUS_DESCRIPTIONS: Record<ReportStatus, string> = {
  pending: 'This report is awaiting review by a moderator',
  reviewed: 'This report is currently being reviewed',
  resolved: 'This report has been resolved and action has been taken',
  dismissed: 'This report has been reviewed and dismissed',
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

export default function ReportDetails() {
  const navigate = useNavigate()
  const params = useParams()
  const reportId = params.id || ''
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth()
  const { data: currentUser } = useCurrentUser()
  const { data: report, isLoading: reportLoading } = useReport(reportId)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

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
            {/* Logo and breadcrumb */}
            <div className="flex items-center gap-4 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <h1 className="text-2xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Fevereiro
                </h1>
              </Button>
              <div className="h-6 w-px bg-border" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/reports')}
                className="gap-2"
              >
                <FileWarning className="h-4 w-4" />
                Reports
              </Button>
              <div className="h-6 w-px bg-border" />
              <span className="text-sm text-muted-foreground">
                #{reportId.slice(0, 8)}
              </span>
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
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Home
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/reports')}>
                    <FileWarning className="h-4 w-4 mr-2" />
                    Reports
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
        <div className="container max-w-5xl mx-auto px-4 py-6">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/reports')}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Reports
          </Button>

          {reportLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : report ? (
            <div className="space-y-6">
              {/* Status alert */}
              <Alert
                variant={
                  report.status === 'pending'
                    ? 'default'
                    : report.status === 'resolved'
                      ? 'default'
                      : 'destructive'
                }
              >
                {report.status === 'pending' && <Clock className="h-4 w-4" />}
                {report.status === 'reviewed' && (
                  <AlertCircle className="h-4 w-4" />
                )}
                {report.status === 'resolved' && (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                {report.status === 'dismissed' && <XCircle className="h-4 w-4" />}
                <AlertTitle>
                  {REPORT_STATUS_LABELS[report.status]}
                </AlertTitle>
                <AlertDescription>
                  {REPORT_STATUS_DESCRIPTIONS[report.status]}
                </AlertDescription>
              </Alert>

              {/* Main report card */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant={REPORT_STATUS_VARIANTS[report.status]}
                          className="text-sm"
                        >
                          {REPORT_STATUS_LABELS[report.status]}
                        </Badge>
                        <Badge variant="outline" className="text-sm">
                          {REPORT_TYPE_LABELS[report.report_type]}
                        </Badge>
                        <Badge variant="secondary" className="text-sm">
                          {report.content_type}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl">
                        Report #{report.id.slice(0, 8)}
                      </CardTitle>
                      <CardDescription>
                        Full details and analysis of this content report
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Report Information */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Report Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Report ID
                          </p>
                          <p className="font-mono text-sm">{report.id}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Reported By
                          </p>
                          <p className="font-medium flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {report.reporter}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Report Date
                          </p>
                          <p className="font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(report.created_at).toLocaleDateString()}{' '}
                            at {new Date(report.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Content Type
                          </p>
                          <p className="font-medium capitalize">
                            {report.content_type}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Violation Type */}
                    <div>
                      <h3 className="font-semibold mb-2">Violation Type</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-destructive" />
                          <span className="font-medium">
                            {REPORT_TYPE_LABELS[report.report_type]}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {REPORT_TYPE_DESCRIPTIONS[report.report_type]}
                        </p>
                      </div>
                    </div>

                    {/* Reporter's Description */}
                    {report.description && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-semibold mb-2">
                            Reporter's Description
                          </h3>
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm">{report.description}</p>
                          </div>
                        </div>
                      </>
                    )}

                    <Separator />

                    {/* Reported Content */}
                    <div>
                      <h3 className="font-semibold mb-2">Reported Content</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              Content ID
                            </p>
                            <p className="font-mono text-sm">
                              {report.content_id}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (report.content_type === 'thread') {
                                navigate(`/thread/${report.content_id}`)
                              }
                            }}
                            className="gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            View Content
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analysis card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Report Analysis</CardTitle>
                  <CardDescription>
                    Contextual information and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Severity Level</h4>
                      <Badge
                        variant={
                          ['sexual', 'violence', 'self_harm'].includes(
                            report.report_type
                          )
                            ? 'destructive'
                            : ['discrimination', 'scam'].includes(
                                  report.report_type
                                )
                              ? 'default'
                              : 'secondary'
                        }
                      >
                        {['sexual', 'violence', 'self_harm'].includes(
                          report.report_type
                        )
                          ? 'High'
                          : ['discrimination', 'scam'].includes(
                                report.report_type
                              )
                            ? 'Medium'
                            : 'Low'}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">
                        Recommended Action
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {report.status === 'pending'
                          ? 'Awaiting moderator review'
                          : report.status === 'reviewed'
                            ? 'Under investigation'
                            : report.status === 'resolved'
                              ? 'Action has been taken'
                              : 'No action required'}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Guidelines</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Review the reported content in its full context</li>
                      <li>
                        Consider the severity and impact of the violation
                      </li>
                      <li>
                        Check if this is a repeat offense from the same user
                      </li>
                      <li>Document your decision and reasoning</li>
                      <li>
                        Take appropriate action based on community guidelines
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Report Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <div className="w-px flex-1 bg-border" />
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-semibold text-sm">Report Created</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(report.created_at).toLocaleString()}
                        </p>
                        <p className="text-sm mt-1">
                          Report submitted by {report.reporter}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            report.status !== 'pending'
                              ? 'bg-primary'
                              : 'bg-muted'
                          }`}
                        />
                        {report.status !== 'pending' && (
                          <div className="w-px flex-1 bg-border" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-semibold text-sm">Current Status</p>
                        <p className="text-sm mt-1">
                          {REPORT_STATUS_LABELS[report.status]}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Report not found</p>
                <Button
                  variant="outline"
                  onClick={() => navigate('/reports')}
                  className="mt-4"
                >
                  Back to Reports
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

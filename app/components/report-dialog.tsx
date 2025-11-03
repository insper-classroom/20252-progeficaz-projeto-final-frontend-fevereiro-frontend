import { useState } from 'react'
import { useCreateReport } from '~/hooks'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import type { ReportType } from '~/types'

interface ReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contentType: 'thread' | 'post'
  contentId: string
  contentPreview?: string
}

const REPORT_TYPES: Array<{
  id: ReportType
  name: string
  description: string
}> = [
  {
    id: 'sexual',
    name: 'Sexual Content',
    description: 'Explicit sexual content',
  },
  {
    id: 'violence',
    name: 'Violence',
    description: 'Violent or threatening content',
  },
  {
    id: 'discrimination',
    name: 'Discrimination',
    description: 'Hate speech or discriminatory content',
  },
  { id: 'scam', name: 'Scam/Fraud', description: 'Fraudulent or deceptive content' },
  {
    id: 'self_harm',
    name: 'Self Harm',
    description: 'Content about self-harm or suicide',
  },
  { id: 'spam', name: 'Spam', description: 'Repetitive or unsolicited content' },
  { id: 'other', name: 'Other', description: 'Other issues (requires description)' },
]

export function ReportDialog({
  open,
  onOpenChange,
  contentType,
  contentId,
  contentPreview,
}: ReportDialogProps) {
  const [reportType, setReportType] = useState<ReportType | ''>('')
  const [description, setDescription] = useState('')
  const { mutate: createReport, isPending } = useCreateReport()

  const handleSubmit = () => {
    if (!reportType) {
      toast.error('Please select a report type')
      return
    }

    if (reportType === 'other' && !description.trim()) {
      toast.error('Description is required for "Other" reports')
      return
    }

    createReport(
      {
        content_type: contentType,
        content_id: contentId,
        report_type: reportType,
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Report submitted', {
            description: 'Thank you for helping keep our community safe.',
          })
          onOpenChange(false)
          setReportType('')
          setDescription('')
        },
        onError: (error: any) => {
          toast.error('Failed to submit report', {
            description: error?.response?.data?.error || error?.message,
          })
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Report {contentType === 'thread' ? 'Thread' : 'Post'}
          </DialogTitle>
          <DialogDescription>
            Help us keep the community safe by reporting inappropriate content.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {contentPreview && (
            <Alert>
              <AlertDescription className="text-xs line-clamp-2">
                <strong>Content:</strong> {contentPreview}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type *</Label>
            <Select
              value={reportType}
              onValueChange={(value) => setReportType(value as ReportType)}
            >
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{type.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {type.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Additional Details {reportType === 'other' && '*'}
            </Label>
            <Textarea
              id="description"
              placeholder="Provide additional context (optional)"
              rows={3}
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/500 characters
            </p>
          </div>

          <Alert>
            <AlertDescription className="text-xs">
              Your report will be reviewed by moderators. False reports may result
              in account restrictions.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import { Button } from '~/components/ui/button'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { cn } from '~/lib/utils'

interface VoteButtonsProps {
  score?: number
  userVote?: 'upvote' | 'downvote' | null
  onUpvote: () => void
  onDownvote: () => void
  isLoading?: boolean
  orientation?: 'horizontal' | 'vertical'
  size?: 'sm' | 'default' | 'lg'
}

export function VoteButtons({
  score = 0,
  userVote,
  onUpvote,
  onDownvote,
  isLoading = false,

  orientation = 'horizontal',
  size = 'default',
  

}: VoteButtonsProps) {
  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation()
    onUpvote()
}

  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDownvote()
}

  const buttonSize = size === 'sm' ? 'icon-sm' : size === 'lg' ? 'icon-lg' : 'icon'
  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'

  const containerClass = cn(
    'flex items-center gap-1',
    orientation === 'vertical' ? 'flex-col' : 'flex-row'
  )

  return (
    <div className={containerClass}>
      <Button
        variant={userVote === 'upvote' ? 'default' : 'ghost'}
        size={buttonSize}
        onClick={handleUpvote}
        disabled={isLoading}
        className={cn(
          userVote === 'upvote' && 'bg-green-500 hover:bg-green-600 text-white'
        )}
      >
        <ThumbsUp className={iconSize} />
      </Button>

      <span
        className={cn(
          'text-sm font-semibold min-w-[2ch] text-center',
          userVote === 'upvote' && 'text-green-600',
          userVote === 'downvote' && 'text-red-600'
        )}
      >
        {score}
      </span>

      <Button
        variant={userVote === 'downvote' ? 'default' : 'ghost'}
        size={buttonSize}
        onClick={handleDownvote}
        disabled={isLoading}
        className={cn(
          userVote === 'downvote' && 'bg-red-500 hover:bg-red-600 text-white'
        )}
      >
        <ThumbsDown className={iconSize} />
      </Button>
    </div>
  )}

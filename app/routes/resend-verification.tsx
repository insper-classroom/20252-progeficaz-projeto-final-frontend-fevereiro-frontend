import { useState } from 'react'
import { Link } from 'react-router'
import { useResendVerification } from '~/hooks'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { CheckCircle2, Mail } from 'lucide-react'
import { toast } from 'sonner'
import type { Route } from './+types/resend-verification'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Resend Verification - Fevereiro' },
    { name: 'description', content: 'Resend verification email' },
  ]
}

export default function ResendVerification() {
  const { mutate: resendVerification, isPending, error } = useResendVerification()
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    resendVerification(
      { email },
      {
        onSuccess: () => {
          setSuccess(true)
          toast.success('Email sent!', {
            description: 'Check your inbox for the verification link.',
          })
        },
        onError: (error: any) => {
          toast.error('Failed to send email', {
            description:
              error?.response?.data?.error ||
              error?.message ||
              'Please try again.',
          })
        },
      }
    )
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Check your email
            </CardTitle>
            <CardDescription>
              We've sent a verification link to{' '}
              <span className="font-medium">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Click the link in the email to verify your account.
              </AlertDescription>
            </Alert>

            <Link to="/login">
              <Button variant="outline" className="w-full">
                Back to login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Resend verification email
          </CardTitle>
          <CardDescription>
            Enter your email to receive a new verification link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu.nome@al.insper.edu.br"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {(error as any)?.response?.data?.error ||
                    error.message ||
                    'Failed to resend verification email.'}
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Sending...' : 'Resend verification email'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Remember your password?{' '}
            <Link to="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

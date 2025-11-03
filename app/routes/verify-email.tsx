import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router'
import { useVerifyEmail } from '~/hooks'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import type { Route } from './+types/verify-email'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Verify Email - Fevereiro' },
    { name: 'description', content: 'Verify your email address' },
  ]
}

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { mutate: verifyEmail, isPending, isSuccess, isError, error } = useVerifyEmail()
  const [attempted, setAttempted] = useState(false)

  useEffect(() => {
    if (token && !attempted) {
      setAttempted(true)
      verifyEmail({ authToken: token })
    }
  }, [token, verifyEmail, attempted])

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold">Invalid Link</CardTitle>
            <CardDescription>
              This verification link is invalid or expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/resend-verification">
              <Button className="w-full">Request new verification email</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Verifying your email...
            </CardTitle>
            <CardDescription>Please wait</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Email verified!
            </CardTitle>
            <CardDescription>
              Your email has been successfully verified.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                You can now sign in to your account and start using Fevereiro.
              </AlertDescription>
            </Alert>

            <Link to="/login">
              <Button className="w-full">Go to login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Verification failed
            </CardTitle>
            <CardDescription>
              {(error as any)?.response?.data?.error ||
                error?.message ||
                'This verification link is invalid or has expired.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/resend-verification">
              <Button className="w-full">Request new verification email</Button>
            </Link>
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

  return null
}

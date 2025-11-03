import { useState } from 'react'
import { Navigate, Link } from 'react-router'
import { useRegister } from '~/hooks'
import { useAuth } from '~/providers'
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
import type { Route } from './+types/register'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Register - Fevereiro' },
    { name: 'description', content: 'Create a new account' },
  ]
}

export default function Register() {
  const { isAuthenticated } = useAuth()
  const { mutate: register, isPending, error } = useRegister()
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    register(formData, {
      onSuccess: () => {
        setSuccess(true)
        toast.success('Account created!', {
          description: 'Please check your email to verify your account.',
        })
      },
      onError: (error: any) => {
        toast.error('Registration failed', {
          description:
            error?.response?.data?.error ||
            error?.message ||
            'Failed to create account. Please try again.',
        })
      },
    })
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
              <span className="font-medium">{formData.email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Click the link in the email to verify your account and start
                using Fevereiro.
              </AlertDescription>
            </Alert>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email?
              </p>
              <Link to="/resend-verification" className="text-sm underline">
                Resend verification email
              </Link>
            </div>

            <div className="text-center">
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Back to login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Use your Insper email to create your account
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
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Must be an @insper.edu.br or @al.insper.edu.br email
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {(error as any)?.response?.data?.error ||
                    error.message ||
                    'Failed to register. Please try again.'}
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

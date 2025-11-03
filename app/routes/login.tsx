import { useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router'
import { useLogin } from '~/hooks'
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
import { toast } from 'sonner'
import type { Route } from './+types/login'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Login - Fevereiro' },
    { name: 'description', content: 'Login to your account' },
  ]
}

export default function Login() {
  const navigate = useNavigate()
  const { isAuthenticated, login: setAuth } = useAuth()
  const { mutate: login, isPending, error } = useLogin()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(formData, {
      onSuccess: (data) => {
        // API retorna apenas access_token após login bem-sucedido
        // Vamos buscar o usuário com o token
        setAuth(data.access_token, {
          id: '',
          username: formData.email.split('@')[0],
          email: formData.email,
        })
        toast.success('Login successful!', {
          description: `Welcome back!`,
        })
        navigate('/')
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.error || error?.message

        // Verificar se é erro de email não verificado
        if (errorMessage?.toLowerCase().includes('not verified') ||
            errorMessage?.toLowerCase().includes('verify')) {
          toast.error('Email not verified', {
            description: 'Please verify your email before logging in.',
            action: {
              label: 'Resend email',
              onClick: () => navigate('/resend-verification'),
            },
          })
        } else {
          toast.error('Login failed', {
            description: errorMessage || 'Invalid credentials. Please try again.',
          })
        }
      },
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
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
                    'Failed to login. Please try again.'}
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm space-y-2">
            <div>
              Don&apos;t have an account?{' '}
              <Link to="/register" className="underline">
                Sign up
              </Link>
            </div>
            <div>
              <Link
                to="/resend-verification"
                className="text-muted-foreground hover:text-foreground underline"
              >
                Resend verification email
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

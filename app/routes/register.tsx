import { useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router'
import { useRegister, useLogin } from '~/hooks'
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
import { toast } from 'sonner'
import type { Route } from './+types/register'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Register' },
    { name: 'description', content: 'Create a new account' },
  ]
}

export default function Register() {
  const navigate = useNavigate()
  const { isAuthenticated, login: setAuth } = useAuth()
  const { mutate: register, isPending: isRegistering } = useRegister()
  const { mutate: login, isPending: isLoggingIn } = useLogin()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const isPending = isRegistering || isLoggingIn

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // First, register the user
    register(formData, {
      onSuccess: () => {
        toast.success('Conta registrada, enviando email de verificação!')

        // Then automatically log in with the same credentials
        navigate('/verify')
      },
      onError: (error: any) => {
        toast.error('Falha no registro', {
          description:
            error?.response?.data?.message ||
            error?.message ||
            'Falha ao criar conta. Tente novamente.',
        })
      },
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Enter your information to create your account
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
                placeholder="seu.email@al.insper.edu.br"
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
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

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

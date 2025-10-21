import { Navigate, NavLink, Outlet, useNavigate } from 'react-router'
import { useAuth } from '~/providers'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'
import { toast } from 'sonner'

export default function ProtectedLayout() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    toast.info('Logged out', {
      description: 'You have been logged out successfully.',
    })
    navigate('/login')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-[200px] mx-auto" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <NavLink to="/dashboard" className="flex items-center space-x-2">
              <span className="font-bold text-xl">App</span>
            </NavLink>
            <nav className="flex items-center gap-4">
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/threads"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`
                }
              >
                Threads
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

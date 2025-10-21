import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { useAuth } from '~/providers'
import { useThreads, useFiltersConfig } from '~/hooks'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Skeleton } from '~/components/ui/skeleton'
import { Separator } from '~/components/ui/separator'
import { Checkbox } from '~/components/ui/checkbox'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Search, LogOut, User, Filter, X } from 'lucide-react'
import { toast } from 'sonner'
import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Fevereiro' },
    { name: 'description', content: 'Fevereiro - Thread Management System' },
  ]
}

export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth()
  const { data: threads, isLoading: threadsLoading } = useThreads()
  const { data: filtersConfig, isLoading: filtersLoading } = useFiltersConfig()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const handleLogout = () => {
    logout()
    toast.info('Logged out', {
      description: 'You have been logged out successfully.',
    })
    navigate('/login')
  }

  // Filter threads based on search and active filters
  const filteredThreads = threads?.filter((thread) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        thread.title.toLowerCase().includes(query) ||
        thread.description?.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    // Dynamic filters (to be implemented)
    // TODO: Apply dynamic filters based on activeFilters and thread properties

    return true
  })

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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container max-w-7xl mx-auto">
          <div className="flex h-16 items-center justify-between gap-6">
            {/* App Name */}
            <div className="flex items-center shrink-0">
              <h1 className="text-2xl font-bold">Fevereiro</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search threads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="max-w-[200px] truncate">{user?.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="container max-w-7xl mx-auto py-8 h-[calc(100vh-8rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 h-full">
            {/* Filters Sidebar */}
            <aside className="flex flex-col h-full min-h-0">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <h2 className="font-semibold">Filters</h2>
                </div>
                {Object.keys(activeFilters).some(
                  (key) => activeFilters[key].length > 0
                ) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveFilters({})}
                    className="h-7 px-2 text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-6 pr-4 pb-4">
                  {filtersLoading ? (
                    <>
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </>
                  ) : filtersConfig?.filters && filtersConfig.filters.length > 0 ? (
                    filtersConfig.filters.map((filter, index) => (
                      <div key={index} className="space-y-3">
                        <h3 className="text-sm font-medium text-foreground/90">
                          {filter.label}
                        </h3>
                        <div className="space-y-2.5">
                          {filter.options.map((option) => {
                            const isSelected = activeFilters[filter.type]?.includes(
                              option.value
                            )
                            return (
                              <div
                                key={option.id}
                                className="flex items-center space-x-2.5"
                              >
                                <Checkbox
                                  id={`${filter.type}-${option.id}`}
                                  checked={isSelected || false}
                                  onCheckedChange={(checked) => {
                                    setActiveFilters((prev) => {
                                      const current = prev[filter.type] || []
                                      if (checked) {
                                        return {
                                          ...prev,
                                          [filter.type]: [...current, option.value],
                                        }
                                      } else {
                                        return {
                                          ...prev,
                                          [filter.type]: current.filter(
                                            (v) => v !== option.value
                                          ),
                                        }
                                      }
                                    })
                                  }}
                                />
                                <label
                                  htmlFor={`${filter.type}-${option.id}`}
                                  className="text-sm cursor-pointer select-none"
                                >
                                  {option.label}
                                </label>
                              </div>
                            )
                          })}
                        </div>
                        {index < filtersConfig.filters.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No filters available
                    </p>
                  )}
                </div>
              </ScrollArea>
            </aside>

            {/* Main Content Area */}
            <section className="flex flex-col h-full min-h-0 border-l pl-8">
              <div className="flex items-baseline justify-between border-b pb-3 mb-4 shrink-0">
                <div>
                  <h2 className="text-xl font-semibold">
                    Threads
                  </h2>
                  {filteredThreads && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {filteredThreads.length} {filteredThreads.length === 1 ? 'result' : 'results'}
                    </p>
                  )}
                </div>
              </div>

              <ScrollArea className="flex-1 min-h-0 h-full">
                <div className="pr-4 pb-4">
                  {threadsLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ) : filteredThreads?.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        {searchQuery
                          ? 'No threads match your search.'
                          : 'No threads available.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredThreads?.map((thread) => (
                        <div
                          key={thread.id}
                          className="group py-4 px-5 rounded-lg border bg-card hover:bg-accent/5 hover:shadow-sm transition-all cursor-pointer"
                        >
                          <h3 className="font-medium text-base mb-1 group-hover:text-primary transition-colors">
                            {thread.title}
                          </h3>
                          {thread.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {thread.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground/80">
                            <span>
                              {new Date(thread.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

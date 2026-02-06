'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Youtube, LogOut, Sparkles, FileText, Image, Search, CheckSquare, BarChart3, ArrowRight, Crown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const toolIcons = {
  'title-hook': Sparkles,
  'script-outline': FileText,
  'thumbnail-brief': Image,
  'seo-toolkit': Search,
  'upload-checklist': CheckSquare,
  'analytics-tracker': BarChart3,
}

const toolNames = {
  'title-hook': 'Title & Hook Generator',
  'script-outline': 'Script Outline Builder',
  'thumbnail-brief': 'Thumbnail Brief Creator',
  'seo-toolkit': 'SEO Toolkit',
  'upload-checklist': 'Upload Checklist',
  'analytics-tracker': 'Analytics Tracker',
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [toolRuns, setToolRuns] = useState([])
  const [usageToday, setUsageToday] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      await loadDashboardData(user.id)
    }
    checkAuth()
  }, [])

  const loadDashboardData = async (userId) => {
    try {
      // Get profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      setProfile(profileData)

      // Get recent tool runs
      const { data: runsData } = await supabase
        .from('tool_runs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10)
      setToolRuns(runsData || [])

      // Get today's usage
      const today = new Date().toISOString().split('T')[0]
      const { data: usageData } = await supabase
        .from('usage_daily')
        .select('count')
        .eq('user_id', userId)
        .eq('date', today)
        .single()
      setUsageToday(usageData?.count || 0)
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const isPro = profile?.plan === 'pro'
  const remainingUses = isPro ? '∞' : Math.max(0, 3 - usageToday)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">Creator Toolkit YouTube</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm hidden sm:block">{user?.email}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-300 hover:text-white">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
              <p className="text-gray-400">Ready to create some amazing content?</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={isPro ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gray-700'}>
                {isPro && <Crown className="w-3 h-3 mr-1" />}
                {isPro ? 'Pro Plan' : 'Free Plan'}
              </Badge>
              {!isPro && (
                <Link href="/pricing">
                  <Button size="sm" className="bg-gradient-to-r from-red-500 to-pink-500">
                    Upgrade
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-400">Uses Today</CardDescription>
              <CardTitle className="text-3xl text-white">
                {usageToday} / {isPro ? '∞' : '3'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                {isPro ? 'Unlimited generations' : `${remainingUses} uses remaining today`}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-400">Total Generations</CardDescription>
              <CardTitle className="text-3xl text-white">{toolRuns.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">All-time tool runs saved</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-400">Your Plan</CardDescription>
              <CardTitle className="text-3xl text-white capitalize">{profile?.plan || 'Free'}</CardTitle>
            </CardHeader>
            <CardContent>
              {!isPro && (
                <Link href="/pricing" className="text-sm text-red-400 hover:text-red-300">
                  Upgrade for unlimited →
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {['title-hook', 'script-outline', 'thumbnail-brief', 'seo-toolkit', 'upload-checklist'].map((slug) => {
              const Icon = toolIcons[slug]
              return (
                <Link key={slug} href={`/tools/${slug}`}>
                  <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all hover:scale-[1.02] cursor-pointer">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{toolNames[slug]}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-500" />
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent History */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent History</h2>
          {toolRuns.length === 0 ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="py-12 text-center">
                <p className="text-gray-400 mb-4">No tool runs yet. Start creating!</p>
                <Link href="/tools">
                  <Button className="bg-gradient-to-r from-red-500 to-pink-500">
                    Explore Tools
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {toolRuns.map((run) => {
                const Icon = toolIcons[run.tool_slug] || Sparkles
                return (
                  <Link key={run.id} href={`/tools/${run.tool_slug}?history=${run.id}`}>
                    <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all cursor-pointer">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white">{toolNames[run.tool_slug]}</p>
                          <p className="text-sm text-gray-400 truncate">
                            {run.input?.topic || 'No topic'} • {new Date(run.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

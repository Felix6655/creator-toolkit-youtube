'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, FileText, Image, Search, CheckSquare, BarChart3, Youtube, Zap, Users, TrendingUp, ArrowRight, Menu, X, LogOut, LayoutDashboard } from 'lucide-react'

const tools = [
  { slug: 'title-hook', name: 'Title & Hook Generator', description: 'Create click-worthy titles and opening hooks', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
  { slug: 'script-outline', name: 'Script Outline Builder', description: 'Structure your videos with pro-level outlines', icon: FileText, color: 'from-blue-500 to-cyan-500' },
  { slug: 'thumbnail-brief', name: 'Thumbnail Brief Creator', description: 'Design briefs for thumbnails that convert', icon: Image, color: 'from-orange-500 to-red-500' },
  { slug: 'seo-toolkit', name: 'SEO Toolkit', description: 'Optimize descriptions, tags, and chapters', icon: Search, color: 'from-green-500 to-emerald-500' },
  { slug: 'upload-checklist', name: 'Upload Checklist', description: 'Never miss a step when publishing', icon: CheckSquare, color: 'from-yellow-500 to-orange-500' },
  { slug: 'analytics-tracker', name: 'Analytics Tracker', description: 'Track your video performance', icon: BarChart3, color: 'from-indigo-500 to-purple-500', comingSoon: true },
]

const features = [
  { icon: Zap, title: 'Instant Results', description: 'Generate content in seconds, not hours' },
  { icon: Users, title: 'Creator-Focused', description: 'Built by creators, for creators' },
  { icon: TrendingUp, title: 'Growth-Oriented', description: 'Tools designed to boost your channel' },
]

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg hidden sm:block">Creator Toolkit YouTube</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/tools" className="text-gray-300 hover:text-white transition-colors">Tools</Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
              {!loading && (
                user ? (
                  <div className="flex items-center gap-3">
                    <Link href="/dashboard">
                      <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-300 hover:text-white">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link href="/login">
                    <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
                      Get Started
                    </Button>
                  </Link>
                )
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4 space-y-3">
            <Link href="/tools" className="block py-2 text-gray-300 hover:text-white">Tools</Link>
            <Link href="/pricing" className="block py-2 text-gray-300 hover:text-white">Pricing</Link>
            {user ? (
              <>
                <Link href="/dashboard" className="block py-2 text-gray-300 hover:text-white">Dashboard</Link>
                <button onClick={handleSignOut} className="block py-2 text-gray-300 hover:text-white">Sign Out</button>
              </>
            ) : (
              <Link href="/login" className="block py-2 text-red-400 hover:text-red-300">Get Started</Link>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20">
            🚀 Free tools for YouTube creators
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Create Better YouTube
            <br />
            <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">Content Faster</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Professional tools to generate titles, scripts, thumbnails, and SEO optimization. 
            Everything you need to grow your channel—no AI keys required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tools">
              <Button size="lg" className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-lg px-8">
                Try Free Tools
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 text-lg px-8">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 border-t border-gray-800">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Creator Tools</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Everything you need to create, optimize, and grow your YouTube channel</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link key={tool.slug} href={tool.comingSoon ? '#' : `/tools/${tool.slug}`}>
                <Card className={`bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all hover:scale-[1.02] cursor-pointer h-full ${tool.comingSoon ? 'opacity-60' : ''}`}>
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-3`}>
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white flex items-center gap-2">
                      {tool.name}
                      {tool.comingSoon && <Badge variant="secondary" className="text-xs">Coming Soon</Badge>}
                    </CardTitle>
                    <CardDescription className="text-gray-400">{tool.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-gray-800/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400">Start free, upgrade when you need more</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Free</CardTitle>
                <CardDescription className="text-gray-400">Perfect for getting started</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-green-400" /> 3 generations per day</li>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-green-400" /> All 5 tools included</li>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-green-400" /> Save history (logged in)</li>
                </ul>
                <Link href="/login" className="block mt-6">
                  <Button className="w-full" variant="outline">Get Started Free</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-2xl">Pro</CardTitle>
                  <Badge className="bg-red-500">Popular</Badge>
                </div>
                <CardDescription className="text-gray-400">For serious creators</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold text-white">$15</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-green-400" /> Unlimited generations</li>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-green-400" /> All 5 tools included</li>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-green-400" /> Full history access</li>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-green-400" /> Priority support</li>
                </ul>
                <Link href="/pricing" className="block mt-6">
                  <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">Upgrade to Pro</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold">Creator Toolkit YouTube</span>
            </div>
            <div className="flex gap-6 text-gray-400 text-sm">
              <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            </div>
            <p className="text-gray-500 text-sm">© 2025 Creator Toolkit YouTube</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

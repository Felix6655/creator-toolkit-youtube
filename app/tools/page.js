'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Youtube, Sparkles, FileText, Image, Search, CheckSquare, BarChart3, ArrowRight, LogOut, LayoutDashboard } from 'lucide-react'

const tools = [
  { 
    slug: 'title-hook', 
    name: 'Title & Hook Generator', 
    description: 'Generate compelling video titles and opening hooks that grab attention and drive clicks', 
    icon: Sparkles, 
    color: 'from-purple-500 to-pink-500',
    features: ['10 title variations', '5 hook options', 'Multiple styles']
  },
  { 
    slug: 'script-outline', 
    name: 'Script Outline Builder', 
    description: 'Create structured video scripts with timestamps, sections, and professional flow', 
    icon: FileText, 
    color: 'from-blue-500 to-cyan-500',
    features: ['Auto timestamps', 'Section breakdowns', 'YouTube chapters']
  },
  { 
    slug: 'thumbnail-brief', 
    name: 'Thumbnail Brief Creator', 
    description: 'Design briefs for thumbnails with text options, visual concepts, and composition tips', 
    icon: Image, 
    color: 'from-orange-500 to-red-500',
    features: ['5 text options', 'Visual concepts', 'Color moods']
  },
  { 
    slug: 'seo-toolkit', 
    name: 'SEO Toolkit', 
    description: 'Optimize your video for search with descriptions, tags, chapters, and pinned comments', 
    icon: Search, 
    color: 'from-green-500 to-emerald-500',
    features: ['Full description', 'Tag generator', 'Pinned comment']
  },
  { 
    slug: 'upload-checklist', 
    name: 'Upload Checklist', 
    description: 'Complete pre-publish, publish day, and post-publish checklists for every upload', 
    icon: CheckSquare, 
    color: 'from-yellow-500 to-orange-500',
    features: ['Pre-publish tasks', 'Launch day list', 'Post-publish follow-up']
  },
  { 
    slug: 'analytics-tracker', 
    name: 'Analytics Tracker', 
    description: 'Track and analyze your video performance metrics over time', 
    icon: BarChart3, 
    color: 'from-indigo-500 to-purple-500',
    comingSoon: true,
    features: ['Performance tracking', 'Growth insights', 'Trend analysis']
  },
]

export default function ToolsPage() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
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
              <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors hidden sm:block">Pricing</Link>
              {user ? (
                <div className="flex items-center gap-3">
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-300 hover:text-white">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button className="bg-gradient-to-r from-red-500 to-pink-500">Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Creator Tools</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Professional tools to help you create better YouTube content. 
            Generate titles, scripts, thumbnails, and more—all optimized for growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link 
              key={tool.slug} 
              href={tool.comingSoon ? '#' : `/tools/${tool.slug}`}
              className={tool.comingSoon ? 'cursor-not-allowed' : ''}
            >
              <Card className={`bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all hover:scale-[1.02] h-full ${tool.comingSoon ? 'opacity-60 hover:scale-100' : ''}`}>
                <CardHeader>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4`}>
                    <tool.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-white flex items-center gap-2">
                    {tool.name}
                    {tool.comingSoon && <Badge variant="secondary" className="text-xs">Coming Soon</Badge>}
                  </CardTitle>
                  <CardDescription className="text-gray-400">{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tool.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {!tool.comingSoon && (
                    <div className="mt-4 flex items-center text-red-400 text-sm font-medium">
                      Try it now <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

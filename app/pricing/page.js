'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Youtube, CheckSquare, X, ArrowLeft, Crown, Loader2, LogOut, LayoutDashboard } from 'lucide-react'
import { toast } from 'sonner'

const faqs = [
  {
    question: 'What\'s included in the Free plan?',
    answer: 'The Free plan includes access to all 5 creator tools with 3 generations per day. You can generate titles, scripts, thumbnails, SEO content, and checklists. Your results are saved to history when logged in.'
  },
  {
    question: 'How does the daily limit work?',
    answer: 'Free users get 3 generations per day across all tools. The limit resets at midnight UTC. Pro users have unlimited generations with no daily limits.'
  },
  {
    question: 'Can I use the tools without signing up?',
    answer: 'Yes! You can use all tools without an account. However, your results won\'t be saved to history. Sign up for free to save your generations and track usage.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We\'re currently in early access and payment integration is coming soon. For now, you can test Pro features using the "Test Pro" button on this page.'
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, you can downgrade from Pro to Free at any time. Your saved history will remain accessible.'
  },
  {
    question: 'Do the tools use AI?',
    answer: 'Our tools use smart template-based generation with variation algorithms—no AI API keys required. This means instant results without the unpredictability of AI models.'
  }
]

export default function PricingPage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(profileData)
      }
      setLoading(false)
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const handlePlanChange = async (newPlan) => {
    if (!user) {
      toast.error('Please login first')
      return
    }
    setUpgrading(true)
    try {
      const response = await fetch('/api/auth/update-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: newPlan }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      
      setProfile(prev => ({ ...prev, plan: newPlan }))
      toast.success(newPlan === 'pro' ? '🎉 Upgraded to Pro!' : 'Downgraded to Free')
    } catch (error) {
      toast.error(error.message || 'Failed to update plan')
    } finally {
      setUpgrading(false)
    }
  }

  const isPro = profile?.plan === 'pro'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="h-6 w-px bg-gray-700" />
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Youtube className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg hidden md:block">Creator Toolkit YouTube</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
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
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Link href="/login">
                    <Button className="bg-gradient-to-r from-red-500 to-pink-500">Login</Button>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-red-500/10 text-red-400 border-red-500/20">
            Simple Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Start free and upgrade when you need more. No credit card required.
          </p>
          {user && profile && (
            <div className="mt-4">
              <Badge className={isPro ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gray-700'}>
                {isPro && <Crown className="w-3 h-3 mr-1" />}
                Current Plan: {isPro ? 'Pro' : 'Free'}
              </Badge>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {/* Free Plan */}
          <Card className={`bg-gray-800/50 border-gray-700 ${!isPro && user ? 'ring-2 ring-gray-600' : ''}`}>
            <CardHeader>
              <CardTitle className="text-white text-2xl">Free</CardTitle>
              <CardDescription className="text-gray-400">Perfect for getting started</CardDescription>
              <div className="pt-4">
                <span className="text-5xl font-bold text-white">$0</span>
                <span className="text-gray-400">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckSquare className="w-5 h-5 text-green-400 flex-shrink-0" /> 
                  <span>3 generations per day</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckSquare className="w-5 h-5 text-green-400 flex-shrink-0" /> 
                  <span>All 5 creator tools</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckSquare className="w-5 h-5 text-green-400 flex-shrink-0" /> 
                  <span>Save history (when logged in)</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckSquare className="w-5 h-5 text-green-400 flex-shrink-0" /> 
                  <span>Copy to clipboard</span>
                </li>
                <li className="flex items-center gap-3 text-gray-500">
                  <X className="w-5 h-5 flex-shrink-0" /> 
                  <span>Priority support</span>
                </li>
              </ul>
              {user ? (
                isPro ? (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => handlePlanChange('free')}
                    disabled={upgrading}
                  >
                    {upgrading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Downgrade to Free
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                )
              ) : (
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full">Get Started Free</Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className={`bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/30 ${isPro ? 'ring-2 ring-red-500' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-2xl">Pro</CardTitle>
                <Badge className="bg-red-500">Popular</Badge>
              </div>
              <CardDescription className="text-gray-400">For serious creators</CardDescription>
              <div className="pt-4">
                <span className="text-5xl font-bold text-white">$15</span>
                <span className="text-gray-400">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckSquare className="w-5 h-5 text-green-400 flex-shrink-0" /> 
                  <span><strong>Unlimited</strong> generations</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckSquare className="w-5 h-5 text-green-400 flex-shrink-0" /> 
                  <span>All 5 creator tools</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckSquare className="w-5 h-5 text-green-400 flex-shrink-0" /> 
                  <span>Full history access</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckSquare className="w-5 h-5 text-green-400 flex-shrink-0" /> 
                  <span>Copy to clipboard</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <CheckSquare className="w-5 h-5 text-green-400 flex-shrink-0" /> 
                  <span>Priority support</span>
                </li>
              </ul>
              {user ? (
                isPro ? (
                  <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500" disabled>
                    <Crown className="w-4 h-4 mr-2" />
                    Current Plan
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600" 
                    onClick={() => handlePlanChange('pro')}
                    disabled={upgrading}
                  >
                    {upgrading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Test Pro (No Payment)
                  </Button>
                )
              ) : (
                <Link href="/login" className="block">
                  <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
                    Sign Up for Pro
                  </Button>
                </Link>
              )}
              {!user && (
                <p className="text-center text-gray-500 text-xs mt-3">
                  Payment integration coming soon
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-gray-800/50 border border-gray-700 rounded-lg px-6">
                <AccordionTrigger className="text-white hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  )
}

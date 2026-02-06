import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { toolsConfig } from '@/lib/generators'

const FREE_DAILY_LIMIT = 3

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return url && key && url.startsWith('http')
}

export async function POST(request, { params }) {
  try {
    const { slug } = params
    const input = await request.json()
    
    // Validate tool exists
    const tool = toolsConfig[slug]
    if (!tool || tool.comingSoon) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 })
    }
    
    // Validate required fields
    for (const field of tool.fields) {
      if (field.required && !input[field.name]) {
        return NextResponse.json({ error: `${field.label} is required` }, { status: 400 })
      }
    }
    
    // Initialize Supabase client only if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    let user = null
    let profile = null
    let remainingUses = null
    
    if (isSupabaseConfigured()) {
      const cookieStore = cookies()
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value
          },
        },
      })
      
      // Check if user is logged in
      const { data: { user: authUser } } = await supabase.auth.getUser()
      user = authUser
      
      if (user) {
        // Get user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single()
        profile = profileData
        
        const isPro = profile?.plan === 'pro'
        const today = new Date().toISOString().split('T')[0]
        
        if (!isPro) {
          // Check and update usage for free users
          // Use upsert with atomic increment
          const { data: usageData, error: usageError } = await supabase
            .from('usage_daily')
            .select('count')
            .eq('user_id', user.id)
            .eq('date', today)
            .single()
          
          const currentCount = usageData?.count || 0
          
          if (currentCount >= FREE_DAILY_LIMIT) {
            return NextResponse.json({ 
              error: 'Daily limit reached. Upgrade to Pro for unlimited generations.',
              remainingUses: 0
            }, { status: 429 })
          }
          
          // Increment usage atomically
          if (usageData) {
            await supabase
              .from('usage_daily')
              .update({ count: currentCount + 1 })
              .eq('user_id', user.id)
              .eq('date', today)
          } else {
            await supabase
              .from('usage_daily')
              .insert({ user_id: user.id, date: today, count: 1 })
          }
          
          remainingUses = FREE_DAILY_LIMIT - currentCount - 1
        } else {
          remainingUses = '∞'
        }
      }
    }
    
    // Generate output using template generator
    const output = tool.generator(input)
    
    // Save to history if user is logged in
    if (user && supabaseUrl && supabaseAnonKey) {
      const cookieStore = cookies()
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value
          },
        },
      })
      
      await supabase
        .from('tool_runs')
        .insert({
          user_id: user.id,
          tool_slug: slug,
          input: input,
          output: output,
        })
    }
    
    return NextResponse.json({ 
      output,
      remainingUses,
      saved: !!user
    })
  } catch (error) {
    console.error('Tool generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

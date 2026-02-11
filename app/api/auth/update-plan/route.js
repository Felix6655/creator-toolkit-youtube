import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { sendUserUpgradedProEvent } from '@/lib/n8n'

export async function POST(request) {
  try {
    const { plan } = await request.json()
    
    if (!plan || !['free', 'pro'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }
    
    // Get user from auth header or cookie
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }
    
    // Create client with cookies for auth
    const cookieStore = cookies()
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
      },
    })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Update user's plan - users can only update their own profile (RLS enforced)
    const { error } = await supabase
      .from('profiles')
      .update({ plan })
      .eq('id', user.id)
    
    if (error) {
      console.error('Error updating plan:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Send n8n webhook event for Pro upgrade (non-blocking)
    // This is a placeholder for future Stripe integration
    if (plan === 'pro') {
      sendUserUpgradedProEvent(user.id, user.email).catch(() => {})
    }
    
    return NextResponse.json({ success: true, plan })
  } catch (error) {
    console.error('Update plan error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

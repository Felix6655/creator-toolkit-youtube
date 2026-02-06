import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create admin client for server operations
const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export async function POST(request) {
  try {
    const { userId, email } = await request.json()
    
    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing userId or email' }, { status: 400 })
    }
    
    const adminClient = createAdminClient()
    
    if (!adminClient) {
      // If no service role key, try with regular client
      // Profile might already exist from trigger
      return NextResponse.json({ success: true, message: 'Profile will be created via trigger' })
    }
    
    // Create profile for new user
    const { error } = await adminClient
      .from('profiles')
      .upsert({
        id: userId,
        email: email,
        plan: 'free',
        created_at: new Date().toISOString()
      }, { onConflict: 'id' })
    
    if (error) {
      console.error('Error creating profile:', error)
      // Don't fail if profile already exists
      if (error.code !== '23505') { // unique violation
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Post-signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

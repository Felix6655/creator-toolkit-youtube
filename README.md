# Creator Toolkit YouTube

A production-ready SaaS application for YouTube creators with tools to generate titles, scripts, thumbnails, SEO optimization, and upload checklists.

## Features

- 🎯 **Title & Hook Generator** - Create click-worthy titles and opening hooks
- 📝 **Script Outline Builder** - Structure videos with timestamps and sections
- 🖼️ **Thumbnail Brief Creator** - Design briefs with text, visuals, and composition tips
- 🔍 **SEO Toolkit** - Optimize descriptions, tags, chapters, and pinned comments
- ✅ **Upload Checklist** - Complete pre/publish/post-publish checklists
- 📊 **Analytics Tracker** - Coming soon!

## Tech Stack

- **Frontend & Backend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database & Auth**: Supabase (Postgres + Auth)
- **Deployment**: Vercel-ready
- **Automation**: n8n webhook integration

## SEO Features

This app includes full SEO support:

- ✅ **sitemap.xml** - Auto-generated at `/sitemap.xml` with all routes
- ✅ **robots.txt** - Configured at `/robots.txt` with sitemap reference
- ✅ **OpenGraph metadata** - Full OG tags for social sharing
- ✅ **Twitter cards** - Summary large image cards
- ✅ **Meta keywords** - Relevant keywords for search engines
- ✅ **Canonical URLs** - Proper canonical URL configuration

### SEO Files

- `/app/app/layout.js` - Global metadata configuration
- `/app/app/sitemap.js` - Dynamic sitemap generation
- `/app/app/robots.js` - Robots.txt configuration
- `/public/og.png` - OpenGraph image (replace with your branded image)

## n8n Webhook Integration

The app sends automated events to n8n for workflow automation.

### Setup n8n Integration

1. **Create a Webhook in n8n**:
   - Add a "Webhook" node in your n8n workflow
   - Set method to POST
   - Copy the webhook URL

2. **Add to Environment Variables**:
   ```env
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/creator-toolkit
   ```

3. **Events Sent**:

   | Event | Trigger | Payload |
   |-------|---------|---------|
   | `tool_used` | After content generation | `{ event, tool, user_id, timestamp }` |
   | `user_signed_up` | New user registration | `{ event, email, user_id, timestamp }` |
   | `user_upgraded_pro` | Pro plan upgrade | `{ event, user_id, email, plan, timestamp }` |

### Example n8n Workflows

- **Slack notification** on new signups
- **Email welcome sequence** trigger
- **Analytics tracking** to Google Sheets
- **CRM integration** (HubSpot, Pipedrive)

### Notes

- Events are sent asynchronously (non-blocking)
- App works normally if `N8N_WEBHOOK_URL` is not set
- Webhook failures are logged but don't affect the app

## Setup Instructions

### 1. Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Navigate to **Settings → API** and copy:
   - Project URL
   - anon public key
   - (optional) service_role key

### 2. Database Setup

1. In Supabase, go to **SQL Editor**
2. Copy the contents of `/sql/init.sql`
3. Run the SQL to create tables, RLS policies, and triggers

### 3. Environment Variables

Create a `.env.local` file (or add to `.env`):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Optional but recommended

# App URL (for SEO and redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# n8n Webhook (optional)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/creator-toolkit
```

### 4. Local Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Vercel Deployment

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel domain, e.g., `https://your-app.vercel.app`)
   - `N8N_WEBHOOK_URL` (optional)

## Auth Verification Checklist

### Signup Flow
- [ ] Go to `/login` and create an account
- [ ] Check email for confirmation (if email confirmation enabled)
- [ ] Verify profile created in Supabase: `SELECT * FROM profiles`
- [ ] Verify user redirected to `/dashboard`

### Login Flow
- [ ] Log out and log back in
- [ ] Verify session persists on page refresh
- [ ] Verify user email shows in navbar

### Protected Routes
- [ ] Access `/dashboard` when logged out → should redirect to `/login`
- [ ] Access `/dashboard` when logged in → should show dashboard

### Usage Limits
- [ ] Generate content as free user
- [ ] Verify count increments in usage_daily table
- [ ] After 3 uses, verify limit error appears
- [ ] Upgrade to Pro on `/pricing`
- [ ] Verify unlimited generations work

### Database Verification
```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies
SELECT policyname, tablename, cmd 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check profiles
SELECT * FROM profiles;

-- Check tool runs
SELECT * FROM tool_runs ORDER BY created_at DESC LIMIT 10;

-- Check usage
SELECT * FROM usage_daily;
```

## Project Structure

```
/app
  /app
    /api
      /auth
        /post-signup/route.js    # Profile creation + n8n signup event
        /update-plan/route.js    # Plan upgrade + n8n upgrade event
      /tools
        /[slug]/route.js         # Tool generation + n8n tool_used event
    /dashboard/page.js           # Protected dashboard
    /login/page.js               # Auth page
    /pricing/page.js             # Pricing with plan toggle
    /tools
      /page.js                   # Tools listing
      /[slug]/page.js            # Individual tool UI
    /page.js                     # Landing page
    /layout.js                   # Root layout + SEO metadata
    /sitemap.js                  # Dynamic sitemap
    /robots.js                   # Robots.txt config
  /lib
    /supabase.js                 # Supabase client
    /generators.js               # Template generators
    /n8n.js                      # n8n webhook helper
  /public
    /og.png                      # OpenGraph image
  /sql
    /init.sql                    # Database setup script
```

## Tool Slugs

- `title-hook` - Title & Hook Generator
- `script-outline` - Script Outline Builder
- `thumbnail-brief` - Thumbnail Brief Creator
- `seo-toolkit` - SEO Toolkit
- `upload-checklist` - Upload Checklist
- `analytics-tracker` - Analytics Tracker (Coming Soon)

## Usage Limits

- **Free Plan**: 3 generations per day (resets at midnight UTC)
- **Pro Plan**: Unlimited generations

## Security

- RLS policies ensure users can only access their own data
- Service role key is never exposed to client
- All inputs validated on server
- Usage limits enforced server-side
- n8n webhook URL kept server-side only

## License

MIT

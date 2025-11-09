# 🔧 Fixing Supabase DNS Error

## Problem
You're getting a `DNS_PROBE_FINISHED_NXDOMAIN` error when trying to authenticate with Google. This means the Supabase project URL `qfsgfjyjcxgavsrqbgeu.supabase.co` cannot be resolved.

## Possible Causes
1. **Supabase project was deleted or paused**
2. **Incorrect project URL**
3. **Project was renamed or moved**
4. **Network/DNS issues**

## Solution

### Option 1: Use Existing Supabase Project (Recommended)

1. **Check Your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Log in with your account
   - Check if your project `qfsgfjyjcxgavsrqbgeu` still exists

2. **If Project Exists:**
   - Go to Settings > API
   - Verify the Project URL matches what's in your code
   - Copy the correct URL and anon key

3. **Create `.env` File**
   - In the `frontend` directory, create a file named `.env`
   - Add the following content:
   ```env
   VITE_SUPABASE_URL=https://your-actual-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```
   - Replace with your actual values from Supabase dashboard

4. **Restart Development Server**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart it
   npm run dev
   ```

### Option 2: Create New Supabase Project

1. **Create New Project**
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Choose an organization
   - Enter project name (e.g., "LuxeMart")
   - Set a database password
   - Select a region
   - Click "Create new project"

2. **Get Your Credentials**
   - Wait for project to finish setting up (2-3 minutes)
   - Go to Settings > API
   - Copy the "Project URL" (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - Copy the "anon public" key

3. **Create `.env` File**
   ```env
   VITE_SUPABASE_URL=https://your-new-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-new-anon-key-here
   ```

4. **Set Up Database**
   - Go to SQL Editor in Supabase dashboard
   - Copy contents of `supabase-setup.sql` file
   - Paste and run in SQL Editor

5. **Configure Google OAuth**
   - Follow the instructions in `GOOGLE_OAUTH_SETUP.md`
   - Make sure to use your new project URL in the redirect URI

6. **Restart Development Server**
   ```bash
   npm run dev
   ```

### Option 3: Check if Project is Paused

1. **Check Project Status**
   - Go to https://supabase.com/dashboard
   - If project shows as "Paused", click to resume it
   - Free tier projects pause after 7 days of inactivity

2. **Wait for Project to Resume**
   - Resuming may take a few minutes
   - Once resumed, the URL should work again

## Verification

After fixing the issue:

1. **Test the URL**
   - Open your browser
   - Navigate to: `https://your-project-ref.supabase.co`
   - You should see a Supabase welcome page (not a DNS error)

2. **Test Authentication**
   - Start your development server: `npm run dev`
   - Go to http://localhost:5173/login
   - Click "Continue with Google"
   - The OAuth flow should work without DNS errors

## Troubleshooting

### Still Getting DNS Error?
- Double-check the URL in `.env` file (no trailing slashes)
- Make sure you restarted the dev server after creating `.env`
- Check browser console for any errors
- Try clearing browser cache

### Environment Variables Not Loading?
- Make sure `.env` file is in the `frontend` directory (not root)
- Variable names must start with `VITE_` for Vite to pick them up
- Restart the dev server after creating/modifying `.env`

### Need Help?
- Check Supabase status: https://status.supabase.com
- Review Supabase docs: https://supabase.com/docs
- Check browser console for detailed error messages

## Next Steps

Once your Supabase connection is working:
1. ✅ Set up Google OAuth (see `GOOGLE_OAUTH_SETUP.md`)
2. ✅ Test user authentication
3. ✅ Set first user as admin in database


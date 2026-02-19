# Supabase Authentication Setup Guide

Complete step-by-step guide to set up Supabase authentication for this project.

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Git installed

## 🚀 Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (recommended)
4. Click "New Project"
5. Fill in:
   - **Project Name**: `cicd-healer` (or your choice)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free
6. Click "Create new project"
7. Wait 2-3 minutes for setup to complete

## 🔑 Step 2: Get API Keys

1. In your Supabase project dashboard, click on the **Settings** icon (⚙️) in the left sidebar
2. Click **API** under Project Settings
3. You'll see two important keys:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. Copy both values

## 📝 Step 3: Configure Environment Variables

1. In your project root, open the `.env` file
2. Replace the placeholder values:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file
4. **IMPORTANT**: Never commit `.env` to Git (it's already in `.gitignore`)

## 🗄️ Step 4: Create Database Table

1. In Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Paste this SQL code:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

4. Click **Run** (or press Ctrl/Cmd + Enter)
5. You should see "Success. No rows returned"

## 🔐 Step 5: Configure OAuth Providers

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen if prompted
6. Application type: **Web application**
7. Add authorized redirect URIs:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
8. Copy **Client ID** and **Client Secret**
9. In Supabase dashboard:
   - Go to **Authentication** → **Providers**
   - Find **Google** and toggle it on
   - Paste Client ID and Client Secret
   - Click **Save**

### GitHub OAuth Setup

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in:
   - **Application name**: CI/CD Healer
   - **Homepage URL**: `http://localhost:5173` (for development)
   - **Authorization callback URL**: 
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
4. Click **Register application**
5. Copy **Client ID**
6. Click **Generate a new client secret** and copy it
7. In Supabase dashboard:
   - Go to **Authentication** → **Providers**
   - Find **GitHub** and toggle it on
   - Paste Client ID and Client Secret
   - Click **Save**

## 📧 Step 6: Configure Email Settings (Optional)

By default, Supabase uses their SMTP server. For production:

1. Go to **Authentication** → **Email Templates**
2. Customize email templates
3. For custom SMTP:
   - Go to **Settings** → **Auth**
   - Scroll to **SMTP Settings**
   - Configure your SMTP provider

## 🎨 Step 7: Install Dependencies

```bash
npm install
```

## 🏃 Step 8: Run the Application

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## ✅ Step 9: Test Authentication

### Test Email/Password:
1. Go to `/login`
2. Click "Sign up"
3. Enter name, email, and password
4. Check your email for verification link
5. Click the link to verify
6. Login with your credentials

### Test Google OAuth:
1. Go to `/login`
2. Click "Continue with Google"
3. Select your Google account
4. You'll be redirected to `/dashboard`

### Test GitHub OAuth:
1. Go to `/login`
2. Click "Continue with GitHub"
3. Authorize the application
4. You'll be redirected to `/dashboard`

## 🔍 Verify Setup

1. After successful login, you should see:
   - Your name and email in the dashboard header
   - Avatar (if using OAuth)
   - Ability to logout

2. Check Supabase dashboard:
   - Go to **Authentication** → **Users**
   - You should see your user listed
   - Go to **Table Editor** → **profiles**
   - You should see your profile data

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` file exists in project root
- Check that variables start with `VITE_`
- Restart dev server after changing `.env`

### OAuth redirect not working
- Check redirect URLs match exactly in provider settings
- Make sure OAuth is enabled in Supabase dashboard
- Clear browser cache and cookies

### Email not sending
- Check spam folder
- Verify email in Supabase dashboard under Authentication → Users
- For development, you can manually verify users in dashboard

### Profile not created
- Check SQL trigger was created successfully
- Manually insert profile in Table Editor if needed
- Check browser console for errors

## 📁 Project Structure

```
src/
├── lib/
│   └── supabase.ts          # Supabase client configuration
├── context/
│   └── AuthContext.tsx      # Authentication context & hooks
├── components/
│   └── ProtectedRoute.tsx   # Route protection component
├── pages/
│   ├── Landing.tsx          # Public landing page
│   ├── Login.tsx            # Login/Signup page
│   └── Dashboard.tsx        # Protected dashboard
└── App.tsx                  # Main app with routing
```

## 🔒 Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Use Row Level Security (RLS)** - Already configured
3. **Validate user input** - Implemented in forms
4. **Use HTTPS in production** - Supabase handles this
5. **Rotate secrets regularly** - Do this in Supabase dashboard
6. **Enable email verification** - Enabled by default
7. **Set up rate limiting** - Configure in Supabase Auth settings

## 🚀 Production Deployment

### Update OAuth Redirect URLs

When deploying to production (e.g., Vercel, Netlify):

1. Add production URL to OAuth providers:
   ```
   https://your-domain.com
   ```

2. Update Supabase redirect URLs:
   - Go to **Authentication** → **URL Configuration**
   - Add your production URL to **Site URL**
   - Add to **Redirect URLs**

### Environment Variables

Set these in your hosting platform:
```
VITE_SUPABASE_URL=your_production_url
VITE_SUPABASE_ANON_KEY=your_production_key
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [OAuth Providers](https://supabase.com/docs/guides/auth/social-login)

## 🆘 Support

If you encounter issues:
1. Check Supabase dashboard logs
2. Check browser console for errors
3. Review this guide step-by-step
4. Check Supabase Discord community

## ✨ Features Implemented

- ✅ Email/Password authentication
- ✅ Google OAuth
- ✅ GitHub OAuth
- ✅ User profiles with name and email
- ✅ Protected routes
- ✅ Automatic profile creation
- ✅ Session management
- ✅ Logout functionality
- ✅ Modern UI with Tailwind CSS
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications
- ✅ Responsive design

## 🎉 You're Done!

Your authentication system is now fully configured and production-ready!

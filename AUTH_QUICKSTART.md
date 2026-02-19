# 🚀 Authentication Quick Start

Get your authentication system running in 5 minutes!

## ⚡ Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy your **Project URL** and **anon key**

### 3. Configure Environment
Create `.env` file in project root:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Create Database Table
In Supabase SQL Editor, run:
```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 5. Run Application
```bash
npm run dev
```

Visit `http://localhost:5173`

## ✅ Test It

1. Go to `/login`
2. Click "Sign up"
3. Enter name, email, password
4. Check email for verification
5. Login and access `/dashboard`

## 🔐 Enable OAuth (Optional)

### Google OAuth
1. [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 Client
3. Add redirect: `https://xxxxx.supabase.co/auth/v1/callback`
4. In Supabase: Authentication → Providers → Google
5. Paste Client ID & Secret

### GitHub OAuth
1. [GitHub OAuth Apps](https://github.com/settings/developers)
2. New OAuth App
3. Callback: `https://xxxxx.supabase.co/auth/v1/callback`
4. In Supabase: Authentication → Providers → GitHub
5. Paste Client ID & Secret

## 📖 Full Documentation

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for complete guide.

## 🎯 What You Get

- ✅ Email/Password auth
- ✅ Google OAuth
- ✅ GitHub OAuth
- ✅ User profiles (name, email, avatar)
- ✅ Protected routes
- ✅ Auto profile creation
- ✅ Session management
- ✅ Modern UI
- ✅ Production-ready

## 🐛 Common Issues

**"Missing environment variables"**
- Restart dev server after creating `.env`

**OAuth not working**
- Check redirect URLs match exactly
- Enable provider in Supabase dashboard

**Email not sending**
- Check spam folder
- Manually verify user in Supabase dashboard

## 🆘 Need Help?

Check the full setup guide: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

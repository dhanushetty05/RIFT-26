# 🚀 Quick Reference Card

## 📦 Installation

```bash
npm install
```

## 🔑 Environment Setup

Create `.env` file:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🗄️ Database Setup

Run in Supabase SQL Editor:
```sql
-- See SUPABASE_SETUP.md for complete SQL
```

## 🏃 Run Application

```bash
# Frontend
npm run dev

# Backend
cd backend
python -m uvicorn main:app --reload
```

## 🌐 URLs

- Frontend: http://localhost:8080
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📖 Documentation

| Guide | Purpose | Time |
|-------|---------|------|
| [AUTH_QUICKSTART.md](./AUTH_QUICKSTART.md) | Quick setup | 5 min |
| [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) | Complete guide | 15 min |
| [AUTHENTICATION_SYSTEM.md](./AUTHENTICATION_SYSTEM.md) | Full docs | Reference |
| [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) | What was built | Overview |

## 🔐 Auth Methods

- Email + Password
- Google OAuth
- GitHub OAuth

## 🛣️ Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | Login/Signup |
| `/dashboard` | Protected | Main dashboard |

## 🎨 Design Colors

- **Dark**: #101d2d
- **Teal**: #045c61
- **White**: #ffffff

## 🧪 Test Checklist

- [ ] Sign up with email
- [ ] Login with email
- [ ] Google OAuth
- [ ] GitHub OAuth
- [ ] Protected routes
- [ ] Logout

## 🚀 Deploy

1. Set environment variables
2. Update OAuth redirect URLs
3. Deploy frontend
4. Deploy backend

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Missing env vars | Restart dev server |
| OAuth not working | Check redirect URLs |
| Profile not created | Check SQL trigger |
| Email not sending | Check spam folder |

## 📞 Support

- Check documentation files
- Review Supabase dashboard
- Check browser console
- Review error messages

---

**Quick Start**: [AUTH_QUICKSTART.md](./AUTH_QUICKSTART.md)

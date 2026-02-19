# 🚀 How to Run the CI/CD Healing Agent

## ⚡ Quick Start (One Click)

**Just double-click this file:**
```
start.bat
```

That's it! Both servers will start automatically.

---

## 📋 First Time Setup

### Step 1: Install Dependencies

**Backend (Python):**
```bash
cd backend
pip install -r requirements.txt
cd ..
```

**Frontend (Node.js):**
```bash
npm install
```

### Step 2: Configure API Keys

Edit `backend/.env` and add your keys:
```env
# Google Gemini API (FREE)
GOOGLE_API_KEY=your-gemini-api-key-here

# GitHub Token
GITHUB_TOKEN=your-github-token-here
```

**Get API Keys:**
- Google Gemini: https://makersuite.google.com/app/apikey
- GitHub Token: https://github.com/settings/tokens (select `repo` scope)

---

## 🎯 Running the Application

### Method 1: Automatic (Recommended) ⭐

**Double-click:**
```
start.bat
```

This opens 2 windows:
- Backend server (Python)
- Frontend server (React)

### Method 2: Manual Start

**Open 2 separate terminals:**

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Method 3: Mobile Access

**For phone access:**
```bash
START_MOBILE.bat
```

This will:
- Start both servers
- Generate QR code
- Scan with phone to access

---

## 🌐 Access the Application

### On Computer:
```
Frontend: http://localhost:5173
Backend:  http://localhost:8000
API Docs: http://localhost:8000/docs
```

### On Phone:
```
http://YOUR_IP_ADDRESS:5173
```
(Use START_MOBILE.bat to get QR code)

---

## 🎮 How to Use

### Step 1: Open the App
Go to: **http://localhost:5173**

### Step 2: Enter Repository Details
```
GitHub Repo URL: https://github.com/username/repo
Team Name: DevTeam
Leader Name: Alice
```

### Step 3: Click "Run Agent"

### Step 4: Watch the Process
The agent will:
1. ✅ Clone repository
2. ✅ Detect project type (Python/Node.js)
3. ✅ Install dependencies
4. ✅ Run tests or static analysis
5. ✅ Find bugs and errors
6. ✅ Generate AI fixes
7. ✅ Commit changes
8. ✅ Push to new branch

### Step 5: Check Results
- View dashboard for fixes
- Check GitHub for new branch: `TEAMNAME_LEADERNAME_AI_Fix`
- See commits with `[AI-AGENT]` prefix

---

## ✅ Verify It's Working

### Backend Console Should Show:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
[FixGen] Using Google Gemini ✓
```

### Frontend Console Should Show:
```
VITE v5.4.19  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.100:5173/
➜  press h + enter to show help
```

### Browser Should Show:
- Clean dashboard interface
- Input form for repository details
- "Run Agent" button

---

## 🛠️ Troubleshooting

### Backend Won't Start?

**Check Python version:**
```bash
python --version
# Should be 3.12 or higher
```

**Reinstall dependencies:**
```bash
cd backend
pip install -r requirements.txt --upgrade
```

**Try running directly:**
```bash
cd backend
python main.py
```

### Frontend Won't Start?

**Check Node version:**
```bash
node --version
# Should be 20 or higher
```

**Clear cache and reinstall:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port Already in Use?

**Kill existing processes:**
```bash
# Windows
taskkill /F /IM python.exe
taskkill /F /IM node.exe

# Or restart your computer
```

### API Keys Not Working?

**Check backend/.env file:**
```bash
# Make sure file exists
ls backend/.env

# Check contents (don't share these!)
cat backend/.env
```

**Verify keys are correct:**
- Google Gemini: Should start with `AIza...`
- GitHub Token: Should start with `ghp_...`

### Can't Access on Phone?

**Make sure:**
1. Phone and computer on same WiFi
2. Firewall allows ports 5173 and 8000
3. Using correct IP address
4. Both servers are running

---

## 🔄 Restart Servers

### Quick Restart:
```bash
RESTART_BACKEND.bat
```

### Manual Restart:

**Stop servers:**
- Press `Ctrl + C` in both terminal windows

**Start again:**
```bash
./start.bat
```

---

## 📊 Test with Sample Repository

### Python Project Example:
```
Repo URL: https://github.com/username/python-project
Team Name: PythonTeam
Leader Name: Alice
```

### Node.js Project Example:
```
Repo URL: https://github.com/username/react-app
Team Name: JSTeam
Leader Name: Bob
```

---

## 🎯 Expected Output

### In Dashboard:
```json
{
  "ci_status": "PASSED",
  "total_failures": 5,
  "total_fixes": 4,
  "iterations_used": 3,
  "time_taken": "2m 34s",
  "score": 135,
  "branch_name": "DEVTEAM_ALICE_AI_Fix"
}
```

### On GitHub:
- New branch created
- Commits with `[AI-AGENT]` prefix
- Fixed code files
- Ready for pull request

---

## 📝 Common Commands

### Start Everything:
```bash
./start.bat
```

### Start Backend Only:
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

### Start Frontend Only:
```bash
npm run dev
```

### Start for Mobile:
```bash
./START_MOBILE.bat
```

### Restart Backend:
```bash
./RESTART_BACKEND.bat
```

### Run Tests:
```bash
npm test
```

### Build for Production:
```bash
npm run build
```

---

## 🎉 You're All Set!

Your CI/CD Healing Agent is now running and ready to automatically fix bugs in your repositories!

**Next Steps:**
1. Open http://localhost:5173
2. Enter a GitHub repository URL
3. Click "Run Agent"
4. Watch it fix bugs automatically!
5. Check GitHub for the new branch with fixes

---

## 📞 Need Help?

**Check these files:**
- `README.md` - Complete documentation
- `HOW_TO_RUN.md` - Detailed setup guide
- `GOOGLE_GEMINI_SETUP.md` - API key setup
- `MOBILE_ACCESS.md` - Phone access guide

**Common Issues:**
- Backend not starting → Check Python version and dependencies
- Frontend not starting → Check Node version and run `npm install`
- API keys not working → Verify keys in `backend/.env`
- Can't push to GitHub → Check GitHub token permissions

---

**Happy Bug Fixing! 🚀**

# 🚀 Quick Start Guide - CodifyMe

## ✅ Database Setup - COMPLETE!
- Database created ✓
- Schema loaded ✓
- Companies seeded ✓

## 🎯 Next Steps

### Step 1: Start Backend Server

**Option A: Using IntelliJ IDEA / Eclipse**
1. Open the `backend` folder in your IDE
2. Right-click on `CodifyMeApplication.java`
3. Select "Run" or "Debug"
4. Wait for: `Started CodifyMeApplication in X seconds`

**Option B: Using Command Line (if Maven is installed)**
```bash
cd backend
mvn spring-boot:run
```

**Option C: Install Maven First**
1. Download Maven from: https://maven.apache.org/download.cgi
2. Extract and add to PATH
3. Then run: `mvn spring-boot:run`

### Step 2: Start Frontend Server

Open a **NEW terminal** and run:

```bash
cd "c:\Users\itsni\Desktop\GitHub Projects\AntiGravity\codifyme\frontend"
npm run dev
```

You should see:
```
  VITE v7.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 3: Open Application

1. Open browser: **http://localhost:5173**
2. Click "Get Started"
3. Fill in signup form:
   - Full Name: Your Name
   - Email: test@example.com
   - Password: password123
4. Click "Create Account"
5. Login with same credentials
6. Explore the dashboard!

## 🎉 What to Test

### Dashboard
- ✅ View your CrackScore (will be 0 initially)
- ✅ See active roadmaps section
- ✅ Check recent interviews
- ✅ Use quick action buttons

### Companies
- ✅ Click "Companies" in nav
- ✅ Search for companies (e.g., "Google")
- ✅ Filter by difficulty level
- ✅ View 30 pre-loaded companies

### Roadmap
- ✅ Click "Roadmap" in nav
- ✅ Create a new roadmap
- ✅ View generated tasks
- ✅ Mark tasks as complete

### Interview
- ✅ Click "Interview" in nav
- ✅ Start an interview
- ✅ Submit responses
- ✅ View AI feedback

## 🐛 Troubleshooting

### Backend won't start
- **Maven not found**: Use your IDE (IntelliJ/Eclipse) to run the application
- **Port 8080 in use**: Kill the process using port 8080
- **Database error**: Verify MySQL is running and credentials are correct

### Frontend issues
- **Port 5173 in use**: The frontend will auto-select another port
- **Cannot connect to backend**: Make sure backend is running on port 8080
- **Login fails**: Check browser console for errors

## 📝 Important Files

### Backend
- Main Application: `backend/src/main/java/com/codifyme/CodifyMeApplication.java`
- Configuration: `backend/src/main/resources/application.properties`

### Frontend
- Main App: `frontend/src/App.jsx`
- Environment: `frontend/.env.development`

## 🎊 You're All Set!

Everything is configured and ready. Just start the servers and enjoy your fully functional placement preparation platform!

**Backend**: Use your IDE or Maven
**Frontend**: `npm run dev`
**Browser**: http://localhost:5173

Happy coding! 🚀

# 🚀 How to Run the Sports Booking System

Follow these steps to run the application locally.

---

## ⚠️ Prerequisites

Before starting, make sure you have:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** (running locally) - [Download here](https://www.mongodb.com/try/download/community)
3. **Git** (optional, for version control)

---

## 📋 Step-by-Step Instructions

### Step 1: Start MongoDB

MongoDB needs to be running before starting the backend.

**Option A: MongoDB as a Service (Windows)**
```bash
# If MongoDB is installed as a Windows service, it's already running
# You can verify by opening MongoDB Compass or checking services
```

**Option B: Start MongoDB Manually**
```bash
# Open a new terminal/command prompt and run:
mongod

# Keep this terminal open - MongoDB will run here
# You should see "Waiting for connections on port 27017"
```

**Verify MongoDB is running:**
```bash
# In another terminal, run:
mongo
# or
mongosh

# You should connect to MongoDB shell
# Type 'exit' to close the shell
```

---

### Step 2: Start the Backend Server

**Open a NEW terminal** (don't close MongoDB terminal if you started it manually):

```bash
# Navigate to the backend folder
cd backend

# Start the development server with auto-restart
npm run dev

# OR start without auto-restart:
# npm start
```

**Expected Output:**
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000 in development mode
```

**If you see an error:**
- Check if MongoDB is running
- Check if port 5000 is already in use
- Check the error message for details

**Test the backend:**
Open your browser and go to: http://localhost:5000/health

You should see:
```json
{
  "status": "OK",
  "message": "Sports Booking API is running",
  "timestamp": "2026-01-23T20:58:35.272Z"
}
```

---

### Step 3: Start the Frontend (React)

**Open ANOTHER NEW terminal** (keep MongoDB and backend running):

```bash
# Navigate to the frontend folder
cd frontend

# Start the React development server
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled with 0 warnings
```

**Your browser should automatically open to:** http://localhost:3000

You'll see the default React welcome page (we'll replace this in future phases).

---

## 🎯 Summary - What Should Be Running

You should have **3 terminals** open:

### Terminal 1: MongoDB
```
📍 Location: Root or anywhere
🔧 Command: mongod
✅ Status: "Waiting for connections on port 27017"
```

### Terminal 2: Backend (Express)
```
📍 Location: /backend
🔧 Command: npm run dev
✅ Status: "Server running on port 5000"
🌐 URL: http://localhost:5000/health
```

### Terminal 3: Frontend (React)
```
📍 Location: /frontend
🔧 Command: npm start
✅ Status: "webpack compiled successfully"
🌐 URL: http://localhost:3000
```

---

## ✅ Verification Checklist

- [ ] MongoDB is running (check terminal for "Waiting for connections")
- [ ] Backend server is running on port 5000
- [ ] http://localhost:5000/health returns JSON response
- [ ] Frontend is running on port 3000
- [ ] http://localhost:3000 shows React app
- [ ] No error messages in any terminal

---

## 🐛 Common Issues & Solutions

### Issue 1: "Port 5000 already in use"
**Solution:** 
- Find and kill the process using port 5000
- Or change the port in `backend/config/config.js`:
  ```javascript
  PORT: process.env.PORT || 5001,  // Change to 5001
  ```

### Issue 2: "Cannot connect to MongoDB"
**Solution:**
- Make sure MongoDB is running (`mongod` command)
- Check if MongoDB is on port 27017
- Try connecting with MongoDB Compass to verify
- Check firewall settings

### Issue 3: "Module not found" errors
**Solution:**
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

### Issue 4: Frontend won't compile
**Solution:**
- Clear cache: `npm cache clean --force`
- Delete `node_modules` in frontend folder
- Run `npm install --legacy-peer-deps`

### Issue 5: CORS errors in browser console
**Solution:**
- Make sure backend is running on port 5000
- Make sure frontend is running on port 3000
- Check `backend/config/config.js` CORS_ORIGIN setting

---

## 🛑 How to Stop Everything

### Stop Frontend
- Go to terminal 3 (frontend)
- Press `Ctrl + C`
- Type `Y` when asked to terminate

### Stop Backend
- Go to terminal 2 (backend)
- Press `Ctrl + C`
- Type `Y` when asked to terminate

### Stop MongoDB (if started manually)
- Go to terminal 1 (MongoDB)
- Press `Ctrl + C`
- MongoDB will shut down gracefully

---

## 🔄 Restart After Stopping

If you've stopped everything and want to restart:

1. Start MongoDB (if not running as service)
2. Start Backend: `cd backend && npm run dev`
3. Start Frontend: `cd frontend && npm start`

---

## 📝 Development Tips

1. **Backend Auto-Restart:** Backend uses nodemon, so changes auto-restart the server
2. **Frontend Hot Reload:** React has hot reload, so changes appear instantly
3. **Check Logs:** Always watch terminal output for errors
4. **MongoDB Data:** Data persists between restarts in MongoDB's data directory
5. **Clear Browser Cache:** If frontend looks weird, try Ctrl+F5 (hard refresh)

---

## 🎉 Success!

If everything is running correctly, you should be able to:

✅ Open http://localhost:5000/health and see API status  
✅ Open http://localhost:3000 and see the React app  
✅ See no errors in any terminal  
✅ See MongoDB connection confirmed in backend terminal  

---

## 📞 Need Help?

If you encounter issues not covered here:

1. Check the terminal output for specific error messages
2. Check `phase-one.md` for technical details
3. Check `README.md` for configuration options
4. Review `backend/config/config.js` for settings

---

**Current Status:** Phase 1 Complete - Basic setup working ✅  
**Next Phase:** Phase 2 - We'll create database models and test them!

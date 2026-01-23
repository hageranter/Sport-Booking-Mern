# 📦 MongoDB Installation Guide for Windows

## Quick Install Steps

### Step 1: Download MongoDB

1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - **Version:** 8.0.4 (or latest)
   - **Platform:** Windows
   - **Package:** MSI
3. Click **Download**

### Step 2: Install MongoDB

1. Run the downloaded `.msi` file
2. Click **Next** through the wizard
3. **Important:** Choose **Complete** installation
4. **Important:** Check "Install MongoDB as a Service"
   - This will auto-start MongoDB when Windows starts
5. **Important:** Keep "Run service as Network Service user" selected
6. Click **Next**, then **Install**
7. Wait for installation to complete
8. Click **Finish**

### Step 3: Verify Installation

Open a **NEW** PowerShell/Command Prompt and run:

```powershell
mongod --version
```

You should see version information like:
```
db version v8.0.4
Build Info: {
    "version": "8.0.4",
    ...
}
```

### Step 4: Check if MongoDB Service is Running

```powershell
# Check MongoDB service status
Get-Service -Name MongoDB
```

You should see:
```
Status   Name               DisplayName
------   ----               -----------
Running  MongoDB            MongoDB
```

If it says "Stopped", start it:
```powershell
Start-Service -Name MongoDB
```

---

## 🎯 Alternative: MongoDB Compass (Recommended GUI)

MongoDB Compass is a GUI tool to manage MongoDB visually.

1. Go to: https://www.mongodb.com/try/download/compass
2. Download and install MongoDB Compass
3. Open MongoDB Compass
4. Connect to: `mongodb://localhost:27017`
5. You should see a connection established

---

## 🚀 After MongoDB is Running

Once MongoDB is installed and running as a service:

1. **You don't need to start MongoDB manually** - it auto-starts with Windows
2. Go back to your backend terminal
3. The backend should automatically restart (nodemon watches for changes)
4. OR manually restart: Press `Ctrl+C` then run `npm run dev` again

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000 in development mode
```

Then test: http://localhost:5000/health

---

## 🐛 Troubleshooting

### Issue: "mongod is not recognized"
**Solution:** Add MongoDB to PATH:
1. Search for "Environment Variables" in Windows
2. Edit "Path" in System Variables
3. Add: `C:\Program Files\MongoDB\Server\8.0\bin`
4. Restart PowerShell

### Issue: Service won't start
**Solution:**
1. Open Services app (search "services" in Windows)
2. Find "MongoDB" service
3. Right-click → Start
4. Right-click → Properties → Set Startup Type to "Automatic"

### Issue: Port 27017 already in use
**Solution:**
1. Check what's using the port:
   ```powershell
   netstat -ano | findstr :27017
   ```
2. Kill the process or change MongoDB port

---

## 📝 Quick Reference

**MongoDB Service Commands:**
```powershell
# Start MongoDB
Start-Service -Name MongoDB

# Stop MongoDB
Stop-Service -Name MongoDB

# Check status
Get-Service -Name MongoDB

# Restart MongoDB
Restart-Service -Name MongoDB
```

**Connect to MongoDB Shell:**
```powershell
mongosh
# or older versions:
mongo
```

**MongoDB Connection String (for our app):**
```
mongodb://localhost:27017/sportsbooking
```

---

## ✅ Verification Checklist

After installation:
- [ ] MongoDB installed successfully
- [ ] MongoDB service is running
- [ ] `mongod --version` works
- [ ] MongoDB Compass can connect (optional)
- [ ] Backend connects to MongoDB without errors
- [ ] http://localhost:5000/health returns JSON

---

**Estimated Installation Time:** 5-10 minutes  
**Disk Space Required:** ~500 MB

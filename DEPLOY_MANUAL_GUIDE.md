# 🚀 Prezinko Deployment - Step by Step Guide

## ⚠️ Prerequisites Needed

Before we start, you need to create accounts on these platforms (all have free tiers):

1. **GitHub Account** - https://github.com/signup
2. **Render Account** - https://render.com/register
3. **MongoDB Atlas Account** - https://www.mongodb.com/cloud/atlas/register

---

## 📋 STEP 1: Install Git (5 minutes)

### Download and Install Git

1. Go to: https://git-scm.com/download/win
2. Download "64-bit Git for Windows Setup"
3. Run the installer
4. Use default settings (just click "Next" through all options)
5. Click "Install"
6. After installation, **restart your terminal/PowerShell**

### Verify Git Installation

Open a new PowerShell window and run:
```powershell
git --version
```

You should see something like: `git version 2.x.x`

---

## 📋 STEP 2: Create MongoDB Atlas Database (10 minutes)

### 2.1 Create Account and Cluster

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (use Google/GitHub for faster signup)
3. Choose **FREE M0 cluster**
4. Select region closest to you (e.g., Mumbai for India)
5. Cluster Name: `prezinko-attendance`
6. Click **"Create"**
7. Wait 3-5 minutes for cluster creation

### 2.2 Create Database User

1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `prezinko_admin`
5. Password: Click **"Autogenerate Secure Password"** and **COPY IT**
   - Save this password somewhere safe!
6. Database User Privileges: **"Atlas admin"**
7. Click **"Add User"**

### 2.3 Allow Network Access

1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"**
4. Confirm: `0.0.0.0/0`
5. Click **"Confirm"**

### 2.4 Get Connection String

1. Click **"Database"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **4.1 or later**
5. **COPY** the connection string
6. It looks like:
   ```
   mongodb+srv://prezinko_admin:<password>@prezinko-attendance.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. Replace `<password>` with the password you saved earlier
8. Add database name at the end:
   ```
   mongodb+srv://prezinko_admin:YOUR_PASSWORD@prezinko-attendance.xxxxx.mongodb.net/attendance-system?retryWrites=true&w=majority
   ```
9. **SAVE THIS COMPLETE STRING** - you'll need it soon!

---

## 📋 STEP 3: Push Code to GitHub (10 minutes)

### 3.1 Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `prezinko-attendance`
3. Description: `Prezinko Attendance & Leave Management System`
4. Visibility: **Private** (recommended) or Public
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**
7. **Keep this page open** - you'll need the commands shown

### 3.2 Push Your Code

Open PowerShell in your project folder:
```powershell
cd C:\Users\mr\Desktop\Attenentions
```

Run these commands one by one:

```powershell
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Prezinko Attendance System"

# Add your GitHub repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/prezinko-attendance.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note**: GitHub will ask for authentication:
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your password)
  - Generate token at: https://github.com/settings/tokens
  - Click "Generate new token (classic)"
  - Select "repo" scope
  - Copy the token and use it as password

---

## 📋 STEP 4: Deploy Backend to Render (15 minutes)

### 4.1 Create Render Account

1. Go to: https://render.com/register
2. Sign up with **GitHub** (easiest option)
3. Authorize Render to access your GitHub

### 4.2 Create Web Service for Backend

1. Click **"New +"** → **"Web Service"**
2. Connect your repository: `prezinko-attendance`
3. Click **"Connect"**

### 4.3 Configure Backend Service

Fill in these settings:

```
Name: prezinko-backend
Region: Singapore (or closest to you)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### 4.4 Choose Plan

- Select **"Free"** plan
- Note: Free tier sleeps after 15 min of inactivity
- Upgrade to **Starter ($7/month)** later for 24/7 uptime

### 4.5 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

```
MONGODB_URI = [paste your MongoDB connection string from Step 2.4]
JWT_SECRET = [generate a random 32+ character string]
NODE_ENV = production
PORT = 5000
```

**To generate JWT_SECRET**, run this in PowerShell:
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### 4.6 Create Service

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Once deployed, you'll see: **"Your service is live 🎉"**
4. **COPY YOUR BACKEND URL**: `https://prezinko-backend-xxxx.onrender.com`
5. Test it by opening: `https://prezinko-backend-xxxx.onrender.com/health`
   - You should see: `{"status":"OK",...}`

---

## 📋 STEP 5: Seed the Database (5 minutes)

### 5.1 Update Backend .env Temporarily

In your local project:
```powershell
cd C:\Users\mr\Desktop\Attenentions\backend
```

Create a `.env` file with:
```
MONGODB_URI=your_mongodb_connection_string_from_step_2.4
```

### 5.2 Run Seed Scripts

```powershell
# Seed default users and data
node seed.js

# Seed leave types
node seedLeaveTypes.js
```

You should see:
```
✅ Database seeded successfully!
✅ Leave types seeded successfully!
```

### 5.3 Clean Up

Delete the `.env` file (don't commit it!):
```powershell
del .env
```

---

## 📋 STEP 6: Deploy Frontend to Render (10 minutes)

### 6.1 Create Production Environment File

In your local project:
```powershell
cd C:\Users\mr\Desktop\Attenentions\frontend
```

Create `.env.production` file with:
```
VITE_API_URL=https://prezinko-backend-xxxx.onrender.com/api
```

Replace `xxxx` with your actual backend URL from Step 4.6

### 6.2 Commit and Push

```powershell
cd C:\Users\mr\Desktop\Attenentions
git add .
git commit -m "Add production environment"
git push
```

### 6.3 Create Static Site on Render

1. Go to Render Dashboard
2. Click **"New +"** → **"Static Site"**
3. Select your repository: `prezinko-attendance`
4. Click **"Connect"**

### 6.4 Configure Frontend

```
Name: prezinko-frontend
Branch: main
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

### 6.5 Add Environment Variable

Click **"Advanced"** → **"Add Environment Variable"**

```
VITE_API_URL = https://prezinko-backend-xxxx.onrender.com/api
```

(Use your actual backend URL)

### 6.6 Create Static Site

1. Click **"Create Static Site"**
2. Wait 5-10 minutes for deployment
3. Once deployed: **"Your site is live 🎉"**
4. **YOUR APP IS NOW LIVE!**
   - URL: `https://prezinko-frontend-xxxx.onrender.com`

---

## 📋 STEP 7: Update Backend CORS (2 minutes)

### 7.1 Add Frontend URL to Backend

1. Go to Render Dashboard
2. Click on **"prezinko-backend"** service
3. Go to **"Environment"** tab
4. Click **"Add Environment Variable"**

```
FRONTEND_URL = https://prezinko-frontend-xxxx.onrender.com
```

5. Click **"Save Changes"**
6. Backend will auto-redeploy (wait 2-3 minutes)

---

## 🎉 STEP 8: Test Your Live App!

### 8.1 Open Your App

Go to: `https://prezinko-frontend-xxxx.onrender.com`

### 8.2 Login

**Admin Account:**
- Email: `admin@company.com`
- Password: `admin123`

**Employee Account:**
- Email: `employee@company.com`
- Password: `employee123`

### 8.3 Test Features

- ✅ Punch In/Out
- ✅ Leave Application
- ✅ Leave Types Management (Admin)
- ✅ Employee Management (Admin)
- ✅ Reports

---

## 📱 STEP 9: Make it a Mobile App (Optional - 5 minutes)

### On Android/iPhone:

1. Open your app URL in Chrome/Safari
2. Tap browser menu (⋮ or share icon)
3. Select **"Add to Home Screen"**
4. Name it: **"Prezinko"**
5. Tap **"Add"**

The Prezinko logo will appear on your home screen like a native app!

---

## 🔒 STEP 10: Security (IMPORTANT!)

### Change Default Passwords

1. Login as admin
2. Go to **Employee Management**
3. Change admin password
4. Update all employee passwords

### Enable 2FA (Optional)

Consider adding two-factor authentication for admin accounts in future updates.

---

## 💰 Current Cost: $0/month

You're running on free tier:
- ✅ Render Free (with 15-min sleep)
- ✅ MongoDB Atlas M0 (512MB)
- ✅ PWA (no app store fees)

### To Remove Sleep Limitation

Upgrade Render backend to **Starter ($7/month)** for 24/7 uptime

---

## 🎯 What You've Accomplished

✅ **Live Website** - Accessible from anywhere
✅ **Cloud Database** - MongoDB Atlas
✅ **Secure HTTPS** - Automatic SSL
✅ **Mobile Ready** - PWA installable
✅ **Prezinko Branded** - Logo everywhere
✅ **Production Ready** - Scalable infrastructure

---

## 🆘 Troubleshooting

**Backend not connecting to MongoDB:**
- Verify MongoDB connection string
- Check IP whitelist (should be 0.0.0.0/0)
- Check Render logs: Service → Logs tab

**Frontend can't reach backend:**
- Verify VITE_API_URL in frontend environment
- Check CORS settings in backend
- Test backend health: `/health` endpoint

**App not loading:**
- Check Render deployment logs
- Verify build completed successfully
- Clear browser cache

---

## 📞 Next Steps

1. **Custom Domain** (Optional):
   - Buy domain from Namecheap/GoDaddy
   - Add to Render in Settings → Custom Domains

2. **Monitoring**:
   - Set up UptimeRobot for uptime monitoring
   - Add Sentry for error tracking

3. **Backups**:
   - MongoDB Atlas has automatic backups
   - Export data regularly

4. **App Stores** (Optional):
   - Google Play Store: $25 one-time
   - Apple App Store: $99/year

---

## 🎊 Congratulations!

Your Prezinko Attendance & Leave Management System is now LIVE!

**Share your app:**
- Website: `https://prezinko-frontend-xxxx.onrender.com`
- Mobile: Install as PWA

**Need help?** Check:
- Render Docs: https://render.com/docs
- MongoDB Docs: https://docs.atlas.mongodb.com
- This guide: `DEPLOY_NOW.md`

---

**Made with ❤️ for Prezinko - Print. Gift. Delight.**

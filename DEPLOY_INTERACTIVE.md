# 🚀 Prezinko Deployment - Interactive Guide

## ⚠️ IMPORTANT: Read This First

This deployment requires **manual steps** on external platforms. I've prepared everything locally, but you'll need to:

1. Create accounts on 3 platforms (all free)
2. Copy/paste some values
3. Click buttons on web interfaces

**Estimated Time: 1 hour**
**Cost: $0 (free tier)**

---

## ✅ STEP 1: Install Git (If Not Already Installed)

### Check if Git is installed:

Open PowerShell and run:
```powershell
git --version
```

**If you see a version number (e.g., `git version 2.x.x`):**
✅ Git is installed! Skip to Step 2.

**If you see an error:**
1. Download Git: https://git-scm.com/download/win
2. Run installer with default settings
3. Restart PowerShell
4. Run `git --version` again

---

## ✅ STEP 2: Configure Git (One-time setup)

Run these commands (replace with your info):

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## ✅ STEP 3: Create MongoDB Atlas Account & Database

### 3.1 Create Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (use Google/GitHub for faster signup)
3. Complete verification

### 3.2 Create Free Cluster
1. Choose **"Build a Database"**
2. Select **"M0 FREE"** tier
3. Provider: **AWS** or **Google Cloud**
4. Region: Choose closest to you (e.g., Mumbai for India)
5. Cluster Name: `prezinko-attendance`
6. Click **"Create"**
7. **WAIT 3-5 minutes** for cluster creation

### 3.3 Create Database User
1. Click **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Username: `prezinko_admin`
4. Click **"Autogenerate Secure Password"**
5. **COPY THE PASSWORD** and save it somewhere safe!
6. Privileges: **"Atlas admin"**
7. Click **"Add User"**

### 3.4 Allow Network Access
1. Click **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"**
4. Confirm IP: `0.0.0.0/0`
5. Click **"Confirm"**

### 3.5 Get Connection String
1. Click **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **4.1 or later**
5. **COPY** the connection string
6. It looks like:
   ```
   mongodb+srv://prezinko_admin:<password>@prezinko-attendance.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. Replace `<password>` with your actual password
8. Add `/attendance-system` before the `?`:
   ```
   mongodb+srv://prezinko_admin:YOUR_PASSWORD@prezinko-attendance.xxxxx.mongodb.net/attendance-system?retryWrites=true&w=majority
   ```
9. **SAVE THIS COMPLETE STRING** - you'll need it!

---

## ✅ STEP 4: Seed Your Database Locally

Now that you have MongoDB, let's populate it with initial data.

### 4.1 Create Temporary .env File

In PowerShell, navigate to backend folder:
```powershell
cd C:\Users\mr\Desktop\Attenentions\backend
```

Create a `.env` file:
```powershell
@"
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING_FROM_STEP_3.5
"@ | Out-File -FilePath .env -Encoding utf8
```

**IMPORTANT:** Replace `YOUR_MONGODB_CONNECTION_STRING_FROM_STEP_3.5` with your actual connection string!

### 4.2 Run Seed Scripts

```powershell
# Seed users and initial data
node seed.js

# Seed leave types
node seedLeaveTypes.js
```

You should see:
```
✅ Database seeded successfully!
✅ Leave types seeded successfully!
```

### 4.3 Delete .env File (Security!)

```powershell
Remove-Item .env
```

**Verify it's deleted:**
```powershell
Test-Path .env
```
Should return: `False`

---

## ✅ STEP 5: Create GitHub Account & Repository

### 5.1 Create GitHub Account
1. Go to: https://github.com/signup
2. Sign up with email
3. Verify email
4. Complete setup

### 5.2 Create Repository
1. Go to: https://github.com/new
2. Repository name: `prezinko-attendance`
3. Description: `Prezinko Attendance & Leave Management System`
4. Visibility: **Private** (recommended)
5. **DO NOT** check any boxes (no README, .gitignore, license)
6. Click **"Create repository"**
7. **KEEP THIS PAGE OPEN** - you'll need it

### 5.3 Create Personal Access Token (for authentication)
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Note: `Prezinko Deployment`
4. Expiration: **90 days** (or longer)
5. Select scopes: **Check "repo"** (this checks all repo sub-items)
6. Scroll down, click **"Generate token"**
7. **COPY THE TOKEN** - you won't see it again!
8. Save it somewhere safe

---

## ✅ STEP 6: Push Code to GitHub

### 6.1 Initialize Git Repository

In PowerShell, go to project root:
```powershell
cd C:\Users\mr\Desktop\Attenentions
```

Initialize Git:
```powershell
git init
```

### 6.2 Add All Files

```powershell
git add .
```

### 6.3 Commit

```powershell
git commit -m "Initial commit - Prezinko Attendance System with logo"
```

### 6.4 Add Remote Repository

**Replace YOUR_USERNAME with your GitHub username:**
```powershell
git remote add origin https://github.com/YOUR_USERNAME/prezinko-attendance.git
```

### 6.5 Push to GitHub

```powershell
git branch -M main
git push -u origin main
```

**When prompted:**
- Username: Your GitHub username
- Password: **Paste your Personal Access Token** (not your password!)

**Verify:** Go to your GitHub repository page and refresh - you should see all your files!

---

## ✅ STEP 7: Deploy Backend to Render

### 7.1 Create Render Account
1. Go to: https://render.com/register
2. Click **"Sign up with GitHub"**
3. Authorize Render to access your GitHub
4. Complete profile setup

### 7.2 Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Click **"Connect account"** if needed
3. Find and click **"Connect"** next to `prezinko-attendance`

### 7.3 Configure Backend Service

Fill in these exact values:

```
Name: prezinko-backend
Region: Singapore (or closest to you)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

**Instance Type:** Select **"Free"**

### 7.4 Add Environment Variables

Click **"Advanced"** → Scroll to **"Environment Variables"**

Click **"Add Environment Variable"** for each:

**Variable 1:**
```
Key: MONGODB_URI
Value: [Paste your MongoDB connection string from Step 3.5]
```

**Variable 2:**
```
Key: JWT_SECRET
Value: [Generate a random 32+ character string]
```

To generate JWT_SECRET, run this in PowerShell:
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```
Copy the output and use it as JWT_SECRET value.

**Variable 3:**
```
Key: NODE_ENV
Value: production
```

**Variable 4:**
```
Key: PORT
Value: 5000
```

### 7.5 Create Service

1. Click **"Create Web Service"**
2. **WAIT 5-10 minutes** for deployment
3. Watch the logs - you'll see build progress
4. When you see **"Your service is live 🎉"** - it's ready!

### 7.6 Get Your Backend URL

1. At the top of the page, you'll see your URL:
   ```
   https://prezinko-backend-xxxx.onrender.com
   ```
2. **COPY THIS URL** and save it!

### 7.7 Test Backend

Open in browser:
```
https://prezinko-backend-xxxx.onrender.com/health
```

You should see:
```json
{"status":"OK","timestamp":"...","uptime":...}
```

✅ Backend is live!

---

## ✅ STEP 8: Deploy Frontend to Render

### 8.1 Create Production Environment File

In PowerShell:
```powershell
cd C:\Users\mr\Desktop\Attenentions\frontend
```

Create `.env.production` file:
```powershell
@"
VITE_API_URL=https://prezinko-backend-xxxx.onrender.com/api
"@ | Out-File -FilePath .env.production -Encoding utf8
```

**IMPORTANT:** Replace `xxxx` with your actual backend URL from Step 7.6!

### 8.2 Commit and Push

```powershell
cd C:\Users\mr\Desktop\Attenentions
git add .
git commit -m "Add production environment configuration"
git push
```

### 8.3 Create Static Site on Render

1. Go to Render Dashboard: https://dashboard.render.com
2. Click **"New +"** → **"Static Site"**
3. Find and click **"Connect"** next to `prezinko-attendance`

### 8.4 Configure Frontend

Fill in these exact values:

```
Name: prezinko-frontend
Branch: main
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

### 8.5 Add Environment Variable

Click **"Advanced"** → **"Environment Variables"**

Add:
```
Key: VITE_API_URL
Value: https://prezinko-backend-xxxx.onrender.com/api
```

(Use your actual backend URL!)

### 8.6 Create Static Site

1. Click **"Create Static Site"**
2. **WAIT 5-10 minutes** for deployment
3. Watch the build logs
4. When you see **"Your site is live 🎉"** - it's ready!

### 8.7 Get Your Frontend URL

Your app is now live at:
```
https://prezinko-frontend-xxxx.onrender.com
```

**COPY THIS URL!**

---

## ✅ STEP 9: Update Backend CORS

### 9.1 Add Frontend URL to Backend

1. Go to Render Dashboard
2. Click on **"prezinko-backend"** service
3. Click **"Environment"** tab (left sidebar)
4. Click **"Add Environment Variable"**

Add:
```
Key: FRONTEND_URL
Value: https://prezinko-frontend-xxxx.onrender.com
```

(Use your actual frontend URL!)

5. Click **"Save Changes"**
6. Backend will auto-redeploy (wait 2-3 minutes)

---

## 🎉 STEP 10: Test Your Live App!

### 10.1 Open Your App

Go to your frontend URL:
```
https://prezinko-frontend-xxxx.onrender.com
```

### 10.2 Login as Admin

```
Email: admin@company.com
Password: admin123
```

### 10.3 Test Features

- ✅ Dashboard loads with Prezinko logo
- ✅ Employee Management
- ✅ Leave Types Management
- ✅ Attendance Reports

### 10.4 Login as Employee

Logout and login as:
```
Email: employee@company.com
Password: employee123
```

Test:
- ✅ Punch In/Out
- ✅ Leave Application
- ✅ Attendance Calendar

---

## 📱 BONUS: Install as Mobile App

### On Android (Chrome):
1. Open your app URL
2. Tap menu (⋮)
3. Tap **"Add to Home Screen"**
4. Name: **"Prezinko"**
5. Tap **"Add"**

### On iPhone (Safari):
1. Open your app URL
2. Tap Share button
3. Tap **"Add to Home Screen"**
4. Name: **"Prezinko"**
5. Tap **"Add"**

The Prezinko logo will appear on your home screen!

---

## 🔒 IMPORTANT: Change Default Passwords!

### After Testing:

1. Login as admin
2. Go to **Employee Management**
3. Edit admin user
4. Change password to something secure
5. Update all employee passwords

---

## 🎊 Congratulations!

Your Prezinko Attendance System is now LIVE!

### What You've Accomplished:

✅ **Live Website** - Accessible worldwide
✅ **Cloud Database** - MongoDB Atlas
✅ **Secure HTTPS** - Automatic SSL
✅ **Mobile App** - PWA installable
✅ **Professional Branding** - Prezinko logo everywhere
✅ **Free Hosting** - $0/month

### Your URLs:

- **Frontend:** https://prezinko-frontend-xxxx.onrender.com
- **Backend:** https://prezinko-backend-xxxx.onrender.com
- **Database:** MongoDB Atlas

### Share with Your Team!

Send them the frontend URL and login credentials.

---

## 📊 Current Cost: $0/month

You're on free tier with:
- Render Free (sleeps after 15 min inactivity)
- MongoDB Atlas M0 (512MB storage)

### To Upgrade (Optional):

**For 24/7 uptime:**
- Render Starter: $7/month
- MongoDB M10: $9/month
- **Total: $16/month**

---

## 🆘 Troubleshooting

**Backend not connecting:**
- Check MongoDB connection string
- Verify IP whitelist: 0.0.0.0/0
- Check Render logs

**Frontend can't reach backend:**
- Verify VITE_API_URL
- Check CORS (FRONTEND_URL in backend)
- Test /health endpoint

**Build failed:**
- Check Render build logs
- Verify package.json exists
- Check node version compatibility

---

## 📞 Need Help?

- Render Docs: https://render.com/docs
- MongoDB Docs: https://docs.atlas.mongodb.com
- GitHub Docs: https://docs.github.com

---

**Made with ❤️ for Prezinko**
**Print. Gift. Delight.**

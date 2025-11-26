# Quick Deployment Checklist ✅

Use this checklist while following DEPLOY_MANUAL_GUIDE.md

## Before You Start
- [ ] GitHub account created
- [ ] Render account created  
- [ ] MongoDB Atlas account created
- [ ] Git installed on Windows

## Step 1: MongoDB Atlas (10 min)
- [ ] Cluster created (M0 Free)
- [ ] Database user created
- [ ] Password saved securely
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string copied and saved

## Step 2: GitHub (10 min)
- [ ] Repository created: `prezinko-attendance`
- [ ] Personal access token generated
- [ ] Code pushed to GitHub
- [ ] Repository visible on GitHub

## Step 3: Render Backend (15 min)
- [ ] Web service created
- [ ] Root directory set to: `backend`
- [ ] Environment variables added:
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] NODE_ENV=production
  - [ ] PORT=5000
- [ ] Service deployed successfully
- [ ] Backend URL copied
- [ ] Health check working: `/health`

## Step 4: Seed Database (5 min)
- [ ] Local .env created with MongoDB URI
- [ ] `node seed.js` completed
- [ ] `node seedLeaveTypes.js` completed
- [ ] Local .env deleted

## Step 5: Render Frontend (10 min)
- [ ] `.env.production` created with backend URL
- [ ] Changes committed and pushed
- [ ] Static site created
- [ ] Root directory set to: `frontend`
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `dist`
- [ ] Environment variable added: VITE_API_URL
- [ ] Site deployed successfully
- [ ] Frontend URL copied

## Step 6: Update CORS (2 min)
- [ ] FRONTEND_URL added to backend environment
- [ ] Backend redeployed

## Step 7: Testing (5 min)
- [ ] App opens in browser
- [ ] Admin login works
- [ ] Employee login works
- [ ] Punch in/out works
- [ ] Leave application works
- [ ] Logo displays correctly

## Step 8: Security (5 min)
- [ ] Admin password changed
- [ ] Employee passwords updated
- [ ] Demo credentials removed/updated

## Step 9: Mobile App (Optional)
- [ ] PWA installed on Android
- [ ] PWA installed on iPhone
- [ ] App icon shows Prezinko logo

## Final Checklist
- [ ] All features tested
- [ ] No errors in console
- [ ] Mobile responsive
- [ ] Logo appears everywhere
- [ ] URLs saved:
  - Backend: ___________________________
  - Frontend: ___________________________
  - MongoDB: ___________________________

## 🎉 Deployment Complete!

**Your app is live at:**
Frontend: `https://prezinko-frontend-xxxx.onrender.com`

**Share with your team!**

---

## Quick Reference

### Login Credentials (Change These!)
- Admin: admin@company.com / admin123
- Employee: employee@company.com / employee123

### Important URLs
- Render Dashboard: https://dashboard.render.com
- MongoDB Atlas: https://cloud.mongodb.com
- GitHub Repo: https://github.com/YOUR_USERNAME/prezinko-attendance

### Support
- Render Docs: https://render.com/docs
- MongoDB Docs: https://docs.atlas.mongodb.com
- Deployment Guide: DEPLOY_MANUAL_GUIDE.md

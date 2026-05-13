# Deployment Guide for Kenya Dating Website

## Option 1: Deploy to Render (Recommended - FREE)

### Steps:

1. **Push code to GitHub** ✅ (Already done!)

2. **Go to Render.com**
   - Visit https://render.com
   - Click "Sign up" and connect your GitHub account

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your `kenyandating` repository
   - Choose the main branch

4. **Configure Service**
   - **Name**: kenyandating
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Add Environment Variables**
   - Click "Environment"
   - Add these variables:
     ```
     PORT=5000
     JWT_SECRET=your-super-secret-key-12345
     NODE_ENV=production
     DATABASE_PATH=/app/data/dating.db
     ```

6. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Your site will be live at: `https://your-app-name.onrender.com`

---

## Option 2: Deploy to Railway (FREE with $5 credit)

### Steps:

1. **Go to Railway.app**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "GitHub Repo" 
   - Choose `kenyandating`

3. **Add Variables**
   - In Railway dashboard, add variables:
     ```
     PORT=5000
     JWT_SECRET=your-super-secret-key-12345
     NODE_ENV=production
     DATABASE_PATH=/app/data/dating.db
     ```

4. **Deploy**
   - Click "Deploy"
   - Your site will be live in minutes!

---

## Option 3: Deploy with Docker Locally

If you want to run it locally with Docker:

```bash
# Build the image
docker build -t kenyandating .

# Run the container
docker-compose up

# Visit: http://localhost:5000
```

---

## Option 4: Deploy to Heroku (Paid - $7/month)

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create kenyandating`
4. Push: `git push heroku main`

---

## Production Checklist

Before going live, update these:

1. **Change JWT_SECRET** in `.env`:
   ```
   JWT_SECRET=generate-a-random-long-string-here
   ```

2. **Use PostgreSQL** instead of SQLite for production:
   - Update database.js to use PostgreSQL
   - This is more reliable for production

3. **Enable HTTPS** - Most hosting services provide this automatically

4. **Add security headers** to Express:
   ```bash
   npm install helmet
   ```

5. **Add rate limiting** to prevent abuse:
   ```bash
   npm install express-rate-limit
   ```

---

## Your Website URL After Deployment

Once deployed, your website will be accessible at:
- **Render**: `https://your-app-name.onrender.com`
- **Railway**: `https://your-app-name.up.railway.app`

You can then share this URL with anyone to use your dating app!

---

## After Deployment

### Next Steps:
1. Test all features (register, login, profile, messaging)
2. Add real profile data
3. Share the URL with Kenyan singles
4. Monitor for bugs and user feedback
5. Plan future features

### Marketing:
- Share on WhatsApp, Facebook, Instagram
- Create landing page
- Start with friends and family
- Build community organically

---

## Questions?

Check the docs:
- Render: https://render.com/docs
- Railway: https://docs.railway.app
- Express: https://expressjs.com

Good luck! 🚀💕

# Deployment Guide

This guide provides step-by-step instructions for deploying the Zealthy EMR application.

## Prerequisites

- GitHub account
- Railway or Render account (for backend + PostgreSQL)
- Vercel account (for frontend)

## Backend Deployment (Railway)

Railway is recommended for its ease of use and free PostgreSQL database.

### Step 1: Create Railway Project

1. Go to [Railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account and select your repository
5. Select the `backend` directory as the root

### Step 2: Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically provision a PostgreSQL database

### Step 3: Configure Environment Variables

In your Railway backend service, add the following environment variables:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<generate-a-random-string>
PORT=3001
NODE_ENV=production
```

Note: `${{Postgres.DATABASE_URL}}` is automatically provided by Railway when you add PostgreSQL.

### Step 4: Configure Build & Start Commands

In Railway settings:
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npx prisma migrate deploy && npm run prisma:seed && npm start`

### Step 5: Deploy

1. Click "Deploy" in Railway
2. Wait for the deployment to complete
3. Note your backend URL (e.g., `https://your-app.railway.app`)

## Backend Deployment (Render) - Alternative

If you prefer Render:

### Step 1: Create Render Account

1. Go to [Render.com](https://render.com) and sign in
2. Click "New +" → "PostgreSQL"
3. Create a PostgreSQL database (free tier available)
4. Note the **External Database URL**

### Step 2: Create Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select the `backend` directory as root
4. Configure:
   - **Name**: zealthy-backend
   - **Environment**: Node
   - **Region**: Choose closest to you
   - **Branch**: main
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npx prisma migrate deploy && npm run prisma:seed && npm start`

### Step 3: Environment Variables

Add these environment variables in Render:

```env
DATABASE_URL=<your-postgres-external-url>
JWT_SECRET=<generate-a-random-string>
PORT=3001
NODE_ENV=production
```

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL (e.g., `https://zealthy-backend.onrender.com`)

## Frontend Deployment (Vercel)

### Step 1: Create Vercel Account

1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New..." → "Project"

### Step 2: Import Repository

1. Select your GitHub repository
2. Click "Import"

### Step 3: Configure Project

- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 4: Environment Variables

Add this environment variable:

```env
VITE_API_URL=<your-backend-url>
```

For example:
- Railway: `https://your-app.railway.app`
- Render: `https://zealthy-backend.onrender.com`

### Step 5: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be live at `https://your-app.vercel.app`

## Post-Deployment Verification

### Test Backend

Visit `https://your-backend-url/health` - should return:
```json
{
  "status": "OK",
  "timestamp": "2026-01-29T..."
}
```

### Test Frontend

1. Visit your Vercel URL
2. Try logging in with demo credentials:
   - Email: `mark@some-email-provider.net`
   - Password: `Password123!`
3. Verify dashboard loads with data
4. Test admin interface at `/admin`

## Troubleshooting

### Backend Issues

**Database Connection Failed**
- Verify DATABASE_URL is correct
- Check PostgreSQL instance is running
- Ensure IP whitelist includes Render/Railway IPs (usually not needed)

**Migrations Failed**
- Run migrations manually: `npx prisma migrate deploy`
- Check database permissions
- Verify Prisma schema is correct

**Seed Failed**
- Check if data already exists (seed clears existing data)
- Verify bcrypt is installed: `npm install bcryptjs`

### Frontend Issues

**API Calls Failing**
- Verify VITE_API_URL is set correctly
- Check CORS is enabled on backend
- Verify backend is accessible from browser

**Build Failed**
- Check all dependencies are in package.json
- Verify TypeScript has no errors
- Run `npm run build` locally first

**Routes Not Working (404 on refresh)**
- Verify `vercel.json` exists with rewrites configuration
- Check Vercel deployment settings

## Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Verify CORS is configured for your frontend domain only
- [ ] Enable HTTPS (automatic on Railway/Render/Vercel)
- [ ] Rotate database credentials if using default
- [ ] Set up database backups (Railway/Render provide automatic backups)
- [ ] Monitor application logs regularly

## Updating the Application

### Backend Updates

1. Push changes to GitHub
2. Railway/Render will auto-deploy
3. Monitor deployment logs
4. If database schema changed, migrations run automatically

### Frontend Updates

1. Push changes to GitHub
2. Vercel will auto-deploy
3. Build takes ~1-2 minutes
4. Changes are live immediately

## Custom Domain (Optional)

### Vercel Custom Domain

1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. SSL is automatic

### Railway/Render Custom Domain

1. Go to Settings → Domains
2. Add custom domain
3. Update DNS records
4. SSL is automatic

## Monitoring & Logs

### Railway
- View logs in the Railway dashboard
- Set up log drains for external monitoring
- Monitor resource usage

### Render
- View logs in Render dashboard
- Set up alerts for errors
- Monitor response times

### Vercel
- Analytics available in dashboard
- View deployment logs
- Monitor Web Vitals

## Cost Estimates

### Free Tier (Good for Testing/Demo)

- **Railway**: $5 free credit monthly
  - Backend: ~$5-10/month
  - PostgreSQL: Included
  
- **Render**: Free tier available
  - Backend: Free (sleeps after 15 min inactivity)
  - PostgreSQL: Free (expires after 90 days)

- **Vercel**: Free for personal projects
  - Unlimited deployments
  - 100GB bandwidth/month

### Production (Paid)

- Railway: ~$15-30/month (backend + DB)
- Render: ~$7-15/month (backend + DB)
- Vercel: Free (sufficient for most cases)

## Support

For deployment issues:
- Railway: https://railway.app/help
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs

## Next Steps

After successful deployment:

1. Test all features thoroughly
2. Share the live URLs with the team
3. Set up monitoring and alerts
4. Plan for scaling if needed
5. Regular security updates

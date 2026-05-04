# Doctor Evaluation System — Vercel Deployment Guide

## Step 1: Set up a free database (Neon — recommended)

1. Go to https://neon.tech and sign up for free
2. Create a new project → copy the **Connection String**
   (looks like: `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`)
3. In the Neon dashboard, open the **SQL Editor**
4. Paste and run the contents of `setup_db.sql` — this creates your tables and loads all 20 doctors

## Step 2: Deploy to Vercel

1. Go to https://vercel.com → Sign in
2. Click **Add New Project** → **Upload** → drag this folder (or the zip)
3. Before clicking Deploy, add this **Environment Variable**:
   - **Name:** `DATABASE_URL`
   - **Value:** your Neon connection string from Step 1
4. Click **Deploy** — done!

## Step 3: Use the app

- Visit your Vercel URL — you'll see the login page
- **Admin login:** `admin` / `admin123`
- **User login:** `user` / `user123`

## Pages

| URL | Page |
|-----|------|
| `/` or `/login.html` | Login |
| `/dashboard.html` | Doctor list |
| `/feedback.html` | Submit feedback |
| `/report.html?id=1` | Doctor report |

## Project structure

```
├── api/
│   ├── login.js            POST /api/login
│   ├── doctors.js          GET  /api/doctors
│   ├── feedback.js         POST /api/feedback
│   └── reports/[id].js     GET  /api/reports/:id
├── public/
│   ├── index.html          (login — served at /)
│   ├── login.html
│   ├── dashboard.html
│   ├── feedback.html
│   ├── report.html
│   ├── style.css
│   └── app.js
├── setup_db.sql            Run this on your database first
├── package.json
└── vercel.json
```

# Doctor Evaluation System — Vercel Deployment

## Steps to deploy

### 1. Set up a free PostgreSQL database

Use [Neon](https://neon.tech) (recommended — free tier, works great with Vercel):
1. Sign up at neon.tech
2. Create a new project
3. Copy the **connection string** (looks like `postgresql://user:pass@host/dbname?sslmode=require`)
4. Open the SQL editor and paste + run the contents of `setup_db.sql`

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"** → **"Upload"** (or connect your GitHub)
3. Upload this zip / drag the folder
4. In **Environment Variables**, add:
   - Name: `DATABASE_URL`
   - Value: your Neon connection string from step 1
5. Click **Deploy**

### 3. Open your site

- Homepage (Login): `https://your-app.vercel.app/login.html`
- Default credentials: `admin` / `admin123` or `user` / `user123`

## File Structure

```
├── api/
│   ├── doctors.js          GET  /api/doctors
│   ├── login.js            POST /api/login
│   ├── feedback.js         POST /api/feedback
│   └── reports/[id].js     GET  /api/reports/:id
├── public/
│   ├── login.html
│   ├── dashboard.html
│   ├── feedback.html
│   ├── report.html
│   ├── style.css
│   └── app.js
├── setup_db.sql
├── package.json
└── vercel.json
```

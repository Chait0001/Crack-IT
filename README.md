# Crack IT!

**AI-powered resume builder** — build resumes that land interviews. Create, edit, and export ATS-friendly resumes across multiple professional templates with real-time live preview, AI-generated content, and one-click PDF/DOCX export.

**Live demo:** [crack-it-pi.vercel.app](https://crack-it-pi.vercel.app/)

## Features

- **AI Bullet Writer & Summary Generator** — auto-generate and refine resume bullet points and professional summaries using LLM-based content generation (Groq/OpenAI API)
- **Real-time ATS Score & Job Match** — get instant feedback on how well your resume matches a target job description
- **Multiple Professional Templates** — choose from several polished resume layouts with live preview as you edit
- **One-click PDF & DOCX Export** — download a polished, ready-to-send resume in either format
- **Profile Photo Upload** — optional photo support, stored via Cloudinary
- **Secure Authentication** — email/password login with JWT, plus Google OAuth via Passport.js
- **Shareable Resume Link** — share a public link to your resume

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router, Zustand, React Hook Form, Axios, lucide-react

**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Passport.js (Google OAuth), Bcrypt.js

**AI:** OpenAI SDK pointed at the Groq API for fast, low-cost LLM inference

**File handling:** Multer (memory storage) + Cloudinary for image uploads, Puppeteer/docx for PDF/DOCX export

**Deployment:** Vercel (frontend as a static build, backend as serverless functions), MongoDB Atlas

## Project Structure

```
Crack-IT/
├── api/                  # Vercel serverless entry point
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
├── server/                  # Express backend
│   ├── config/               # DB connection, Passport strategy
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/             # AI, PDF, DOCX, ATS scoring services
│   └── package.json
├── vercel.json               # Monorepo build & routing config
└── package.json              # Root build script
```

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB instance)
- A Cloudinary account (free tier works)
- A Groq API key (or OpenAI API key)
- (Optional) Google OAuth credentials, if you want "Continue with Google" to work

### 1. Clone the repo

```bash
git clone https://github.com/Chait0001/Crack-IT.git
cd Crack-IT
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
```

Fill in `server/.env` with your own values:

```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
GOOGLE_CLIENT_ID=your_google_client_id        # optional
GOOGLE_CLIENT_SECRET=your_google_client_secret # optional
OPENAI_API_KEY=your_groq_or_openai_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
PORT=5001
```

Start the backend:

```bash
npm run dev
```

### 3. Set up the frontend

In a separate terminal:

```bash
cd client
npm install
npm run dev
```

The app will be running at `http://localhost:5173`, talking to the API at `http://localhost:5001`.

## Deployment

This project deploys as a single Vercel project: the React client builds as a static site, and the Express backend runs as Vercel serverless functions under `/api`. See `vercel.json` at the repo root for the build and routing configuration.

### Environment Variables (Vercel Dashboard)

All of the following must be set in **Project Settings → Environment Variables** for both **Production** and **Preview** environments:

| Variable | Example | Notes |
|---|---|---|
| `VITE_API_URL` | `/api` | **Baked in at build time by Vite.** Use `/api` (relative) since frontend and backend share the same Vercel domain. |
| `CLIENT_URL` | `https://crack-it-pi.vercel.app` | Used by the backend for CORS. Set to your production domain. |
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB Atlas connection string. |
| `JWT_SECRET` | (random string) | Secret for signing access tokens. |
| `JWT_REFRESH_SECRET` | (random string) | Secret for signing refresh tokens. |
| `OPENAI_API_KEY` | `gsk_...` or `sk-...` | Groq or OpenAI API key for AI features. |
| `CLOUDINARY_CLOUD_NAME` | `your_cloud_name` | For profile photo uploads. |
| `CLOUDINARY_API_KEY` | `123456789` | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | `your_secret` | Cloudinary API secret. |
| `GOOGLE_CLIENT_ID` | (optional) | For Google Sign-In. |
| `GOOGLE_CLIENT_SECRET` | (optional) | For Google Sign-In. |

> **Important:** Vite bakes `VITE_*` variables into the JavaScript bundle at build time — they are NOT read at runtime. If you change `VITE_API_URL` in the Vercel dashboard, you must **redeploy** for the change to take effect. Non-`VITE_` variables (like `MONGODB_URI`) are read at runtime by the serverless functions and take effect immediately.

If you're setting up Google Sign-In, make sure to register the correct Authorized redirect URIs in the Google Cloud Console for both your local and production callback URLs.

## Scripts

| Location | Command | Description |
|---|---|---|
| `client/` | `npm run dev` | Start the Vite dev server |
| `client/` | `npm run build` | Build the production frontend |
| `client/` | `npm run lint` | Run ESLint |
| `server/` | `npm run dev` | Start the backend with nodemon (auto-restart) |
| `server/` | `npm start` | Start the backend in production mode |

## Author

**Chaitanya Kumar**
[GitHub](https://github.com/Chait0001) · [LinkedIn](https://www.linkedin.com/in/chaitanya-kumar-923387308/) · [Portfolio](https://main-portfolio-green-eight.vercel.app/)

## License

This project currently has no license specified. Add a `LICENSE` file if you intend to open-source it under a specific license (e.g. MIT).

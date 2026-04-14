# Bharat-Setu 🇮🇳 🌉

**Bridge the gap between Talent and Opportunity.**

Bharat-Setu is an AI-driven, blockchain-verified ecosystem designed to connect passionate students with experienced alumni mentors. Our goal is to foster real-world skills, trust, and transparent collaboration through structured micro-projects.

## 🌟 Unique Selling Proposition (USP)
- **AI Matchmaking**: State-of-the-art NLP models (TF-IDF & Cosine Similarity) match students with alumni based on highly specific technical synergies, completely replacing traditional "cold outreach."
- **Blockchain Verification (Simulated)**: Mentor credentials are immutable. A zero-trust approach ensures students are only interacting with verified professionals.
- **Collaborative Sandbox**: Shift from "Mentorship as Advice" to "Mentorship as Work". Students apply for technical micro-projects posted by alumni, submit their "Proof of Work," and earn verified `Reputation` badges tied directly to their profiles. 

## 🏗️ Architecture & Technology Stack
Bharat-Setu relies on a modern, decoupled monorepo architecture. 

### Frontend (`/client`)
- **Framework**: React 18 & Vite
- **Routing**: React Router v6
- **Styling**: Native CSS implementation with glassmorphism and modern gradient design systems built for low latency.

### Backend (`/server`)
- **Core**: Node.js & Express.js
- **Database**: MongoDB (via `mongoose`)
- **Authentication**: JWT & `bcryptjs`
- **File Processing**: `multer` for Sandbox file submissions.
- **Communication**: `nodemailer` providing asynchronous acceptance alerts to students.

### AI Services (`/ai-services`)
- **Runtime**: Python 3
- **Libraries**: `scikit-learn`, `pandas`
- **Integration**: The Node.js server spawns instances of the Python script dynamically, passing stringified JSON via standard input, ensuring heavy computation is handled appropriately.

## 🚀 Deployment Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB connection URI
- (Optional) Python 3 installed locally if running outside Docker.

### Running Locally
1. Clone the repository. 
2. Set up your `.env` in `/server`.
   ```bash
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_super_secret_key
   PORT=5000
   ```
3. Run the backend:
   ```bash
   cd server
   npm install
   npm run dev
   ```
4. Run the frontend:
   ```bash
   cd client
   npm install
   npm run dev
   ```

### Deploying to Cloud (Production)

**Backend (Render, Railway, Fly.io)**
A root-level `Dockerfile` is provided. It automatically configures Node.js, Python3, standard pip dependencies, and kicks off the Express server. Simply connect your GitHub repository and build from the Dockerfile.
*Remember to map `MONGO_URI` and `JWT_SECRET` in your dashboard environment variables!*

**Frontend (Vercel, Netlify)**
Connect your repository and set the root directory to `client`. 
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
Setup an Environment Variable:
`VITE_API_URL` = `https://<YOUR-RENDER-URL>.onrender.com`

*A `vercel.json` is included to handle React single-page routing natively.*

---
*Built to empower the next generation of engineers.*

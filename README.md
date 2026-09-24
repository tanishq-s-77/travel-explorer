# 🌍 Travel Explorer — Full-Stack Web Application

A full-stack Travel Explorer application featuring a light, aesthetic **"Fresh Weather Vibes"** theme, 20 curated real-world destinations, live weather updates from **OpenWeatherMap**, photography from **Unsplash**, and user authentication and wishlist persistence powered by **Supabase**.

---

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v3.4, Framer Motion, Lucide React
- **Backend**: Node.js, Express, Axios, CORS, Dotenv
- **Database & Auth**: Supabase (PostgreSQL with Row Level Security, Supabase Auth)
- **External APIs**: OpenWeatherMap API (live weather), Unsplash API (high-res images)
- **State Management**: Pure React `useState` and `useContext` (no external state libraries)

---

## 📁 Project Structure

```
explorer-travel/
├── client/                     # React + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/         # DestinationCard, FilterBar, WeatherBadge, Skeletons
│   │   ├── context/            # AuthContext.jsx & WishlistContext.jsx
│   │   ├── pages/              # Home, Explore, Detail, Wishlist, Profile, Auth
│   │   ├── services/           # api.js (Express client) & supabase.js
│   │   ├── App.jsx             # React Router and Providers
│   │   └── index.css           # Tailwind design tokens & fresh weather vibes
│   ├── .env                    # Frontend environment variables
│   └── package.json
├── server/                     # Node.js + Express Backend
│   ├── data/                   # 20 Curated world destinations dataset
│   ├── middleware/             # Supabase JWT auth verification middleware
│   ├── routes/                 # /api/destinations & /api/wishlist
│   ├── services/               # OpenWeatherMap & Unsplash API callers + memory cache
│   ├── index.js                # Express app entry
│   ├── .env                    # Backend environment variables
│   └── package.json
├── supabase/
│   └── schema.sql              # Supabase database table definitions & RLS policies
├── .env.example                # Unified environment variable template
├── package.json                # Root package for running client & server
└── README.md
```

---

## 🔑 Environment Variables Setup

The application reads configuration from two `.env` files:

### 1. Backend (`server/.env`)
Create or edit `server/.env`:
```env
PORT=5000
CLIENT_URL=http://localhost:5173

# Supabase Credentials (from Supabase Dashboard > Project Settings > API)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenWeatherMap API Key (from https://openweathermap.org/api)
OPENWEATHER_API_KEY=your_openweathermap_api_key

# Unsplash API Access Key (from https://unsplash.com/developers)
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

### 2. Frontend (`client/.env`)
Create or edit `client/.env`:
```env
# Express API Endpoint
VITE_API_URL=http://localhost:5000/api

# Supabase Credentials (for browser authentication)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note**: Even before you paste your API keys, the application includes graceful fallback weather and curated photography so the site is immediately testable and never displays blank screens!

---

## 🗄️ Supabase Database Setup

1. Open your [Supabase Dashboard](https://supabase.com/dashboard) and navigate to the **SQL Editor**.
2. Open `supabase/schema.sql` from this repository and copy its content.
3. Paste and run the query in your Supabase SQL editor:
   - Creates the `wishlist` table referencing `auth.users(id)`.
   - Enables Row Level Security (RLS) with policies for user-specific viewing, inserting, and deleting.
   - Creates unique constraint to prevent duplicate saves.

---

## 🏃 Running the Application

### 1. Install dependencies (if not already installed)
```bash
# In the server folder:
cd server && npm install

# In the client folder:
cd ../client && npm install
```

### 2. Start the Backend Server (Port 5000)
```bash
cd server
npm run dev
```

### 3. Start the Frontend Client (Port 5173)
```bash
cd client
npm run dev
```

Or from the project root:
```bash
npm run dev:server   # In terminal 1
npm run dev:client   # In terminal 2
```

Open your browser at **`http://localhost:5173`**.

---

## 🌟 Core Features

- **Home Page**: Hero section with search teaser, live weather marquee, and curated trending highlights.
- **Explore 20 Catalog**: Multi-faceted filter by continent (Asia, Europe, Americas, Africa, Oceania), climate (Beach, Mountain, City, Cold), and budget ($, $$, $$$). Search strictly constrained to the 20 destinations.
- **Destination Details**: Comprehensive weather station metrics (temperature, humidity, wind speed, pressure, sunrise/sunset), curated highlights, best visiting seasons, and interactive wishlist toggle.
- **Supabase Authentication**: Email/password sign-in and sign-up with session persistence.
- **Protected Wishlist**: Personal saved destinations with live weather sync, removal capability, and cheerful confetti animation.
- **Profile Page**: User identity details, member since timestamp, and saved wishlist counters.

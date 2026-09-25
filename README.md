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

Running the Application

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

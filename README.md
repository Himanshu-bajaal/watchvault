# 🎬 WatchVault

A full-stack movie & book watchlist app — add titles you want to watch/read, mark them as completed, rate them out of 5 stars, and automatically pull in posters, release year, and plot info for movies via the OMDb API.

Built as a hands-on learning project to practice the MERN stack (MongoDB, Express, React, Node.js) with real-world features like filtering, third-party API integration, and RESTful API design.

---

## ✨ Features

- **Add movies or books** to your watchlist with a title and type
- **Auto-fetch movie details** — poster, release year, and plot are pulled automatically from the OMDb API when you add a movie
- **Mark items as watched/read**
- **Rate watched items** 1–5 stars
- **Filter your list** — view all items, only "want to watch," or only "watched"
- **Delete items** you no longer want tracked
- Fully responsive, dark-themed UI built with Tailwind CSS

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB with Mongoose

**External API**
- [OMDb API](https://www.omdbapi.com/) — for movie poster, year, and plot data

---

## 📂 Project Structure

```
watchvault/
├── backend/
│   ├── models/
│   │   └── Item.js          # Mongoose schema for watchlist items
│   ├── routes/
│   │   └── item.routes.js   # CRUD + filtering API routes
│   ├── server.js            # Express app entry point
│   └── .env                 # Environment variables (not committed)
│
└── frontend/
    ├── src/
    │   ├── App.jsx           # Main app component
    │   └── index.css         # Tailwind import
    └── vite.config.js
```

---

## 🚀 Getting Started (Run Locally)

### Prerequisites
- Node.js installed
- MongoDB running locally (or a MongoDB Atlas connection string)
- A free [OMDb API key](https://www.omdbapi.com/apikey.aspx)

### 1. Clone the repo
```bash
git clone https://github.com/your-username/watchvault.git
cd watchvault
```

### 2. Set up the backend
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/watchvault
OMDB_API_KEY=your_omdb_api_key_here
```

Start the backend:
```bash
node server.js
```
Backend runs at `http://localhost:5000`

### 3. Set up the frontend
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

---

## 📡 API Routes

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/items` | Create a new item (auto-fetches OMDb data for movies) |
| `GET` | `/api/items` | Get all items |
| `GET` | `/api/items?status=watched` | Get items filtered by status |
| `PUT` | `/api/items/:id` | Update an item (e.g. status, rating) |
| `DELETE` | `/api/items/:id` | Delete an item |

---

## 🧠 What I Learned Building This

- Structuring a REST API with Express (routes, controllers, Mongoose models)
- Connecting a React frontend to a Node/Express backend with Axios
- Managing state and side effects in React with `useState` and `useEffect`
- Calling a third-party API from the backend and handling failures gracefully
- Query parameters for filtering data at the database level
- Styling with Tailwind CSS utility classes

---

## 🔮 Possible Future Improvements

- User authentication so each user has their own private watchlist
- A written review/notes field for each item
- Search by title instead of just filtering by status
- Deploying live (Render for backend, Vercel for frontend)
- Splitting the frontend into reusable components

---

## 📄 License

This project is open source and available for anyone to learn from or build on.
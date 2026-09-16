# 🎬 WatchVault

A full-stack movie & book watchlist app with user authentication — sign up, log in, and keep your own private list of what you want to watch/read. Add titles, mark them as completed, rate them out of 5 stars, and automatically pull in posters, release year, and plot info for movies via the OMDb API.

Built as a hands-on learning project to practice the MERN stack (MongoDB, Express, React, Node.js) with real-world features like authentication, filtering, and third-party API integration.

---

## ✨ Features

- **User accounts** — sign up and log in; each user has their own private watchlist
- **Secure authentication** — passwords hashed with bcrypt, sessions handled via JWT stored in HTTP-only cookies
- **Protected routes** — both the API and the app itself require login to access watchlist data
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
- React Router — client-side routing (`/`, `/login`, `/signup`)
- Tailwind CSS
- Axios (with a shared instance configured for cookie-based requests)

**Backend**
- Node.js
- Express.js
- MongoDB with Mongoose
- bcryptjs — password hashing
- jsonwebtoken — JWT auth
- cookie-parser — reading HTTP-only auth cookies

**External API**
- [OMDb API](https://www.omdbapi.com/) — for movie poster, year, and plot data

---

## 📂 Project Structure

```
watchvault/
├── backend/
│   ├── models/
│   │   ├── Item.js            # Watchlist item schema (linked to a user)
│   │   └── User.js            # User schema (name, email, hashed password)
│   ├── routes/
│   │   ├── item.routes.js     # CRUD + filtering API routes (protected)
│   │   └── auth.routes.js     # Signup, login, logout, session check
│   ├── middlewares/
│   │   └── auth.middleware.js # Verifies JWT cookie, protects routes
│   ├── server.js              # Express app entry point
│   └── .env                   # Environment variables (not committed)
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js       # Pre-configured axios instance (cookies enabled)
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   └── Signup.jsx
    │   ├── App.jsx             # Routes, auth state, and the main watchlist view
    │   ├── main.jsx             # Wraps the app in React Router
    │   └── index.css            # Tailwind import
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
git clone https://github.com/Himanshu-bajaal/watchvault.git
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
JWT_SECRET=your_long_random_secret_here
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

### 4. Create an account
Visit `http://localhost:5173/signup` to create your first user, then log in.

---

## 📡 API Routes

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/signup` | Create a new account (password is hashed before storing) |
| `POST` | `/api/auth/login` | Log in — verifies credentials, sets a JWT as an HTTP-only cookie |
| `POST` | `/api/auth/logout` | Clears the auth cookie |
| `GET` | `/api/auth/me` | Returns the currently logged-in user, based on the auth cookie |

### Items *(all require a valid login cookie)*
| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/items` | Create a new item for the logged-in user (auto-fetches OMDb data for movies) |
| `GET` | `/api/items` | Get all items belonging to the logged-in user |
| `GET` | `/api/items?status=watched` | Get the logged-in user's items filtered by status |
| `PUT` | `/api/items/:id` | Update an item — only if it belongs to the logged-in user |
| `DELETE` | `/api/items/:id` | Delete an item — only if it belongs to the logged-in user |

---

## 🔐 How Authentication Works

1. On signup, the password is hashed with bcrypt (salt + hash) before being saved — the plain-text password is never stored.
2. On login, the submitted password is compared against the stored hash using `bcrypt.compare()`. If it matches, the server signs a JWT containing the user's ID and sends it back as an **HTTP-only cookie** — inaccessible to frontend JavaScript, which protects it from XSS-based theft.
3. Every request to a protected route passes through `auth.middleware.js`, which verifies the JWT's signature and expiry, then attaches the user's ID to the request (`req.userId`) for use in that route.
4. Every watchlist item is tagged with the `user` who owns it. Update and delete routes double-check ownership before making any change, so one user can never modify another user's data — even if they somehow guessed an item's ID.
5. On app load, the frontend calls `GET /api/auth/me` to check whether a valid session cookie already exists, so refreshing the page doesn't log the user out.

---

## 🧠 What I Learned Building This

- Structuring a REST API with Express (routes, controllers, Mongoose models)
- Password hashing and salting with bcrypt, and why hashing is one-way
- Issuing and verifying JWTs, and the difference between signing and encrypting
- HTTP-only cookies vs. localStorage for storing auth tokens, and the security tradeoffs
- Writing Express middleware to protect routes and attach request-scoped data
- Enforcing per-user data ownership at the database query level
- Client-side routing with React Router, including redirects and route guards
- Connecting a React frontend to a Node/Express backend with a shared, cookie-aware Axios instance
- Managing state and side effects in React with `useState` and `useEffect`
- Calling a third-party API from the backend and handling failures gracefully
- Query parameters for filtering data at the database level
- Styling with Tailwind CSS utility classes

---

## 🔮 Possible Future Improvements

- A written review/notes field for each item
- Search by title instead of just filtering by status
- Deploying live (Render for backend, Vercel for frontend)
- Splitting the frontend into reusable components
- Password reset / "forgot password" flow
- Loading skeletons instead of a plain "Loading..." state

---

## 📄 License

This project is open source and available for anyone to learn from or build on.
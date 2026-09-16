import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import api from './api/axios';

function App() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('movie');
  const [filter, setFilter] = useState('all');
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user, filter]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  const fetchItems = () => {
    const url = filter === 'all' ? '/items' : `/items?status=${filter}`;
    api.get(url)
      .then((res) => setItems(res.data))
      .catch((err) => console.error('Error fetching items:', err));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    api.post('/items', { title, type })
      .then(() => {
        setTitle('');
        fetchItems();
      })
      .catch((err) => console.error('Error adding item:', err));
  };

  const handleMarkWatched = (id) => {
    api.put(`/items/${id}`, { status: 'watched' })
      .then(() => fetchItems())
      .catch((err) => console.error('Error updating item:', err));
  };

  const handleRate = (id, rating) => {
    api.put(`/items/${id}`, { rating })
      .then(() => fetchItems())
      .catch((err) => console.error('Error rating item:', err));
  };

  const handleDelete = (id) => {
    api.delete(`/items/${id}`)
      .then(() => fetchItems())
      .catch((err) => console.error('Error deleting item:', err));
  };

  const handleLogout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    setItems([]);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLoginSuccess={setUser} />} />
      <Route
        path="/"
        element={user ? (
          <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold">WatchVault 🎬</h1>
              <button
                onClick={handleLogout}
                className="bg-gray-800 hover:bg-red-600 px-4 py-2 rounded transition"
              >
                Logout
              </button>
            </div>

            <form onSubmit={handleAddItem} className="flex gap-3 mb-6">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Movie or book title"
                className="flex-1 bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                required
              />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded px-4 py-2"
              >
                <option value="movie">Movie</option>
                <option value="book">Book</option>
              </select>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold transition"
              >
                Add
              </button>
            </form>

            <div className="flex gap-2 mb-8">
              {['all', 'want-to-watch', 'watched'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-sm capitalize transition ${filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                >
                  {f.replaceAll('-', ' ')}
                </button>
              ))}
            </div>

            <div className="grid gap-4">
              {items.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <p className="text-lg">
                    {filter === 'all'
                      ? "Your watchlist is empty — add your first movie or book above!"
                      : `No items in "${filter.replaceAll('-', ' ')}" yet.`}
                  </p>
                   </div>
                  ) : (
                     items.map((item) => (
                    <div key={item._id} className="bg-gray-800 p-4 rounded-lg shadow relative flex gap-4">
                      {item.poster && (
                        <img src={item.poster} alt={item.title} className="w-20 h-28 object-cover rounded" />
                      )}
                      <div className="flex-1">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
                          title="Delete"
                        >
                          ✕
                        </button>
                        <h2 className="text-xl font-semibold pr-6">{item.title}</h2>
                        <p className="text-sm text-gray-400 capitalize">
                          {item.type} — {item.status} {item.year && `(${item.year})`}
                        </p>
                        {item.plot && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.plot}</p>
                        )}
                        {item.status === 'want-to-watch' && (
                          <button
                            onClick={() => handleMarkWatched(item._id)}
                            className="mt-2 text-sm bg-green-600 hover:bg-green-700 px-3 py-1 rounded transition"
                          >
                            Mark as Watched
                          </button>
                        )}
                        {item.status === 'watched' && (
                          <div className="mt-2 flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => handleRate(item._id, star)}
                                className={`text-2xl ${item.rating >= star ? 'text-yellow-400' : 'text-gray-600'
                                  }`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
          </div>
        ) : (
          <Navigate to="/login" />
        )
        }
      />
    </Routes>
  );
}

export default App;
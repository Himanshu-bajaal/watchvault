import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('movie');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    axios.get('http://localhost:5000/api/items')
      .then((res) => setItems(res.data))
      .catch((err) => console.error('Error fetching items:', err));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/items', { title, type })
      .then(() => {
        setTitle('');
        fetchItems();
      })
      .catch((err) => console.error('Error adding item:', err));
  };

  const handleMarkWatched = (id) => {
    axios.put(`http://localhost:5000/api/items/${id}`, { status: 'watched' })
      .then(() => fetchItems())
      .catch((err) => console.error('Error updating item:', err));
  };

  const handleRate = (id, rating) => {
    axios.put(`http://localhost:5000/api/items/${id}`, { rating })
      .then(() => fetchItems())
      .catch((err) => console.error('Error rating item:', err));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/items/${id}`)
      .then(() => fetchItems())
      .catch((err) => console.error('Error deleting item:', err));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">WatchVault 🎬</h1>

      <form onSubmit={handleAddItem} className="flex gap-3 mb-8">
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

      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item._id} className="bg-gray-800 p-4 rounded-lg shadow relative">
            <button
              onClick={() => handleDelete(item._id)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
              title="Delete"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold pr-6">{item.title}</h2>
            <p className="text-sm text-gray-400 capitalize">{item.type} — {item.status}</p>

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
                    className={`text-2xl ${
                      item.rating >= star ? 'text-yellow-400' : 'text-gray-600'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
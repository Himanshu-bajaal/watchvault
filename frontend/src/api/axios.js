import axios from 'axios';

// pre-configured axios instance — baseURL means calls just use '/items' instead of the full URL every time.
// withCredentials is required for the auth cookie to be sent/received across ports (frontend <-> backend).
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

export default api;
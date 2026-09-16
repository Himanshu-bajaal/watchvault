const jwt = require('jsonwebtoken');

// Middleware — runs before a route's handler. Checks for a valid JWT cookie;
// if valid, attaches the user's ID to req so the route knows who's making the request.
const protect = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // throws if invalid/expired — caught below
        req.userId = decoded.id;

        next(); // token is valid — let the request continue to the actual route handler
    }
    catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};

module.exports = protect;
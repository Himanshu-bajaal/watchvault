const jwt = require('jsonwebtoken');

const protect = (req, res, next) =>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message: "Not authorized, no token"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;

        next();
    }
    catch(error){
        res.status(401).json({message: "Not authorized, token failed"});
    }
};

module.exports = protect;
const jwt = require('jsonwebtoken');

const protectRoute = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Přístup odepřen!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Neplatný token" });
    }
};

module.exports = protectRoute;
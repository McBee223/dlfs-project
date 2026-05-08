const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });

        db.query(
            `SELECT id FROM users WHERE id = ? UNION SELECT id FROM admins WHERE id = ?`,
            [decoded.id, decoded.id],
            (dbErr, results) => {
                if (dbErr || results.length === 0) {
                    return res.status(401).json({ message: "Account no longer exists" });
                }
                req.user = decoded;
                next();
            }
        );
    });
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Admins only' });
        }
        next();
    });
};

module.exports = { verifyToken, verifyAdmin };

const jwt = require('jsonwebtoken');

const auth = function (req, res, next) {
    let token = req.header('Authorization');
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length).trimLeft();
    } else if (!token) {
        token = req.header('x-auth-token');
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // JWT payload me user object hona chahiye
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};

const authResident = (req, res, next) => {
    auth(req, res, () => {
        if (req.user.role !== 'resident') {
            return res.status(403).json({ success: false, message: 'Resident access only' });
        }
        next();
    });
};

const authGuard = (req, res, next) => {
    auth(req, res, () => {
        if (req.user.role !== 'guard') {
            return res.status(403).json({ success: false, message: 'Guard access only' });
        }
        next();
    });
};

module.exports = { auth, authResident, authGuard }; 
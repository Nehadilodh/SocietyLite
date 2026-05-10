const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const { initSocket, getIo } = require('./utils/socket');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Setup Socket.io - CORRECT WAY
initSocket(server);
const io = getIo();

// Socket Auth Middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded.user;
        next();
    } catch (err) {
        next(new Error('Authentication error'));
    }
});

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id, 'User:', socket.user?.name);

    socket.on('join_flat', (flatNo) => {
        if (socket.user.role === 'resident' && socket.user.flatNo === flatNo) {
            socket.join(flatNo);
            console.log(`User ${socket.user.name} joined room: ${flatNo}`);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// General Middleware
app.use(cors());
app.use(express.json());

// Inject socket io into routes
app.use((req, res, next) => {
    req.io = getIo();
    next();
});

// Express API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/visitor', require('./routes/visitor'));
app.use('/api/public', require('./routes/public'));
app.use('/api/bill', require('./routes/bill'));
app.use('/api/complaint', require('./routes/complaint'));
app.use('/api/notification', require('./routes/notification'));
app.use('/api/sos', require('./routes/sos'));
app.use('/api/user', require('./routes/user'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const visitorRoutes = require('./routes/visitor')
const { initSocket, getIo } = require('./utils/socket');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Setup Socket.io
initSocket(server);

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

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


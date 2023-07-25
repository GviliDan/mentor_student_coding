const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const CodeBlock = require('./models/CodeBlock');
const codeBlockRoutes = require('./routes/codeBlockRoutes');
const app = express();
const server = http.createServer(app);
const channelName = 'myChannel';

require('dotenv').config();

// Set up middleware
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  // Allow WebSocket connections
  credentials: true,
  transports: ['websocket', 'polling'],
};
app.use(cors(corsOptions));
app.use(express.json());

const io = socketio(server, { cors: corsOptions });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Add routes
app.use('/api/codeBlocks', codeBlockRoutes);

const codeBlockRooms = {};

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('disconnect', () => {
    console.log(`socket: ${socket.id} disconnected`)
    Object.keys(codeBlockRooms).map(room => {
      codeBlockRooms[room] = codeBlockRooms[room].filter(socketId => socketId != socket.id)
    })
  });

  socket.on('joinCodeBlock', (data) => {
    const msg = JSON.parse(data);
    if (codeBlockRooms[msg.id] == null)
      codeBlockRooms[msg.id] = [];

    if (codeBlockRooms[msg.id].length == 0) {
      socket.emit('myRole', JSON.stringify({ role: 'mentor' }));
    } else {
      socket.emit('myRole', JSON.stringify({ role: 'student' }));
    }

    codeBlockRooms[msg.id].push(socket.id);
  });

  socket.on('codeChange', async (data) => {
    const message = JSON.parse(data);
    io.emit(message.room, message.text);

    // Update code in the database
    await CodeBlock.findByIdAndUpdate(message.room,
      { $set: { code: message.text } }
    )
  });
});

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
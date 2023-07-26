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
const allowedOrigins = ['https://mentor-student-coding-frontend.vercel.app', 'http://localhost:3000'];

// Set up middleware
const corsOptions = {
<<<<<<< HEAD
  origin: function (origin, callback) {
    // Check if the origin is in the allowed origins list or if it's not defined (e.g., a local request)
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
=======
  origin: 'mentor-student-coding-frontend.vercel.app',
>>>>>>> my-feature-branch
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
mongoose.connect('mongodb+srv://dang240:fPrxJ9PBmIm7OzOx@cluster0.2onz8rg.mongodb.net/', {
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
      console.log("this is the check1" + codeBlockRooms[msg.id])

    if (codeBlockRooms[msg.id].length == 0) {
      console.log("this is the check2" + codeBlockRooms[msg.id])
      socket.emit('myRole', JSON.stringify({ role: 'mentor' }));
    } else {
      console.log("this is the check3" + codeBlockRooms[msg.id])
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
const port = process.env.PORT || 8106;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
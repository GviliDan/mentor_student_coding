const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
require('dotenv').config();


// Set up middleware
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with the URL of your frontend application
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    // Allow WebSocket connections
    credentials: true,
    transports: ['websocket', 'polling'],
  };
  app.use(cors(corsOptions));
  app.use(express.json());

  // Add CORS middleware to handle Cross-Origin Resource Sharing
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Replace '*' with your frontend URL
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Manually created code blocks
const codeBlocks = [
  {
    title: "Async case",
    code: `
      // Add your asynchronous JavaScript code here
    `,
    solution: `
      // Add the solution for the Async case here
    `
  },
  {
    title: "Callback function",
    code: `
      // Add your callback function code here
    `,
    solution: `
      // Add the solution for the Callback function here
    `
  },
  {
    title: "Creating a loop",
    code: `
      // Add your callback function code here
    `,
    solution: `
      // Add the solution for the Callback function here
    `
  },
  {
    title: "Recursion",
    code: `
      // Add your callback function code here
    `,
    solution: `
      // Add the solution for the Callback function here
    `
  },
];

// Route to fetch code blocks
app.get('/api/codeblocks', (req, res) => {
  res.json(codeBlocks);
});
app.get('/api/codeblocks/:title', (req, res) => {
    const title = req.params.title;
    const codeBlock = codeBlocks.find((block) => block.title === title);
    if (!codeBlock) {
      return res.status(404).json({ message: 'Code block not found' });
    }
    res.json(codeBlock);
  });

  app.get('/', (req, res) => {
    res.send('Server is running.'); // You can customize the response message here
  });
  

// Your WebSocket logic and other routes will be implemented later.
io.on('connection', (socket) => {
    console.log('New WebSocket connection');
  
    // Handle incoming messages from the client
    socket.on('codeChange', (data) => {
      // Broadcast the code change to all connected clients
      socket.broadcast.emit('codeChange', data);
    });
  
    // Handle other events and messages as needed
    // ...
  });
  

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



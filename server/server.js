const mongoose = require('mongoose');
const express = require('express');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const mongoDB =
  'mongodb+srv://charlesdhayveed:charlesdhayveed1234@cluster0.yr6amq4.mongodb.net/chat-data-base?retryWrites=true&w=majority';

mongoose
  .connect(mongoDB)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const io = require('socket.io')(5000, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on('send-message', ({ recipients, text }) => {
    recipients.forEach((recipient) => {
      const newRecipients = recipients.filter((r) => r !== recipient);
      newRecipients.push(id);
      socket.broadcast.to(recipient).emit('receive-message', {
        recipients: newRecipients,
        sender: id,
        text,
      });
    });
  });
});

const app = express();

// Use user routes under the /api/users endpoint
app.use('/api/users', userRoutes);

// ...

// Start the server
app.listen(6000, () => {
  console.log('Server is running on port 6000');
});

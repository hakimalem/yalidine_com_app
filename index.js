const express = require('express');
const mongoose = require('mongoose');
const app = express();
const config = require('config');
const users = require('./routes/users');
const auth = require('./routes/auth');
const news = require('./routes/news');
const salles = require('./routes/salles');
const reservations = require('./routes/reservations');

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

mongoose
  .connect('mongodb://127.0.0.1:27017/yal')
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/news', news);
app.use('/api/salles', salles);
app.use('/api/reservations', reservations);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

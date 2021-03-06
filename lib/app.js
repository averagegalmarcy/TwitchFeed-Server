const express = require('express');
const app = express();
const morgan = require('morgan');
const auth = require('./routes/auth/auth');
const twitch = require('./routes/twitch/twitch'); 
const favorites = require('./routes/favorites/favorites'); 
const ratings = require('./routes/ratings/ratings');
const community = require('./routes/community/community'); 
const jwt = require('./jwt');

app.use(morgan('dev'));

app.use(express.json());

app.use(express.static('public'));

function checkAuth(req, res, next) {
  const token = req.get('Authorization');
  console.log('token\n\n', token); 
  if(!token) {
    res.status(401).json({ error: 'no authorization found' });
    return;
  }
  let payload = null;
  try {
    payload = jwt.verify(token); 
  }
  catch (err) {
    res.status(401).json({ error: 'invalid token' });
    return;
  }
  req.userId = payload.id;
  next(); 
}

app.use('/api/auth', auth);
app.use('/api/twitch', checkAuth, twitch);
app.use('/api/favorites', checkAuth, favorites);
app.use('/api/community', checkAuth, community);
app.use('/api/ratings', checkAuth, ratings);

module.exports = app;

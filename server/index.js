const express = require('express');
const bodyPaser = require('body-parser');
const session = require('express-session');
const massive = require('massive');
const axios = require('axios');

require('dotenv').config();
massive(process.env.CONNECTION_STRING).then(db => app.set('db', db));

const app = express();
app.use(bodyPaser.json());
app.use(session({
  secret: "mega hyper ultra secret",
  saveUninitialized: false,
  resave: false,
}));
app.use(express.static(`${__dirname}/../build`));

app.post('/login', (req, res) => {
  // Add code here
  const {userId} = req.body;
  const auth0Url = `https://${process.env.REACT_APP_AUTH_DOMAIN}/ap/v2/users/${userId}`;
  
axios.get(auth0Url, {
  headers: {
    authorization: 'Bearer ' + process.env.AUTH0_MANAGEMENT_ACCESS_TOKEN}
}).then (response => {
const user = response.data.user;
}).catch(erorr => {
  res.status(500).json ({ message: 'oh noes!!'})
})
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.send();
});

app.get('/user-data', (req, res) => {
  res.json({ user: req.session.user });
});

function checkLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
}

app.get('/secure-data', checkLoggedIn, (req, res) => {
  res.json({ someSecureData: 123 });
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});

const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/items', require('./routes/api/items'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

mongoose
    .connect('mongodb://' + process.env.MONGO_HOST + ':27017/' + process.env.MONGO_DB, {
        "user": process.env.MONGO_DB_USER,
        "pass": process.env.MONGO_DB_PASSWORD,
        "authSource": process.env.MONGO_DB,
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(error => console.log(error));

if (process.env.NODE_ENV === 'production') {
  console.log('Running Production');
  app.use(express.static('client/dist'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

app.get('/', (req, res) => {
  res.json({ success: true });
});

app.listen(process.env.SERVER_PORT, console.log(`Server Running`));

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express()

app.use('/congkhai', express.static(path.join(__dirname, './public')))

const userRouters = require('./routers/user.js');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
  let pathFile = path.join(__dirname, './page/home.html');
  res.sendFile(pathFile);
})

app.use('/user', userRouters);

app.listen(process.env.PORT, () => {
 
})
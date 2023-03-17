const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const UserModel = require('./models/user');
const auth = require('./middlewares/auth.js');
const userRouters = require('./routers/user.js');

mongoose.connect('mongodb+srv://damanhtuan24022000:damanhtuan24022000@cluster1.zxnza45.mongodb.net/my_database?retryWrites=true&w=majority');

const app = express();

app.use(cookieParser());

app.use('/congkhai', express.static(path.join(__dirname, './public')))

// CORS middleware
const allowCrossDomain = (req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  next();
};

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.use(allowCrossDomain);

app.use(express.json());

// app.get('/', (req, res) => {
//   let pathFile = path.join(__dirname, './page/home.html');
//   res.sendFile(pathFile);
// })

app.post('/register', async (req, res) => {
  const { email, telephone } = req.body;
  const checkUnique = await UserModel.checkUniqueUser(email, telephone);
  if (checkUnique) {
    return res.status(400).send(checkUnique);
  }
  req.body.password = await bcrypt.hash(req.body.password, 8);
  UserModel.create(req.body).then(() => {
    res.status(201).send({ message: "Tạo tài khoản thành công." })
  }).catch(error => {
    let errObject = {};
    for (key in error.errors) {
      errObject[key] = error.errors[key].message
    }
    res.status(400).send(errObject);
  })
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.findByCredentials(email, password);
    const token = await user.generateAuthToken()
    res.send({
      user: {
        id: user._id,
        name: user.name,
        telephone: user.telephone,
        email: user.email,
        date: user.date,
        gender: user.gender
      }, token
    });
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
});

app.use('/user', userRouters);

app.listen(process.env.PORT || 3000, () => {

});

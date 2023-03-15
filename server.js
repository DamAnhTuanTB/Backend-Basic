const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://damanhtuan24022000:damanhtuan24022000@cluster1.zxnza45.mongodb.net/my_database?retryWrites=true&w=majority');

app.use(cookieParser());

app.use('/congkhai', express.static(path.join(__dirname, './public')))

const userRouters = require('./routers/user.js');

const AccountModel = require('./models/account');

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

// app.get('/', (req, res) => {
//   let pathFile = path.join(__dirname, './page/home.html');
//   res.sendFile(pathFile);
// })

app.post('/login', (req, res, next) => {
  AccountModel.findOne({
    username: req.body.username,
    password: req.body.password
  }).then(data => {
    if (data) {
      return res.json({
        message: 'Thanh cong',
        token: jwt.sign({
          _id: data._id
        }, 'mk')
      });
    } else {
      return res.json('Sai ten dang nhap hoac mat khau');
    }
  }).catch(err => {
    res.status(500).json("Loi server")
  })
})

app.get('/private', (req, res, next) => {
  try {
    const token = req.cookies.token;
    const ketqua = jwt.verify(token, 'mk');
    if (ketqua) {
      AccountModel.findOne({
        _id: ketqua._id
      }).then(data => {
        res.data = data;
        next();
      }).catch(err => {
        res.status(500).json('Khong tim thay nguoi dung');
      })

    }
  } catch {
    return res.redirect('/');
  }
}, (req, res, next) => {
  return res.json(res.data);
})

app.use('/user', userRouters);

app.listen(process.env.PORT || 3000, () => {

})

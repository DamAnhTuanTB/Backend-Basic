const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const cors = require("cors");

const UserModel = require("./models/user");
const AddressModel = require("./models/address");

const userRouters = require("./routers/user.js");
const addressRouters = require("./routers/address");
const productRouters = require("./routers/product");
const brandRouters = require("./routers/brand");
const categoryRouters = require("./routers/category");
const blogRouters = require("./routers/blog");
const evaluateRouters = require("./routers/evaluate");
const cartRouters = require("./routers/cart");
const paymentRouters = require('./routers/payment');
const orderRouters = require('./routers/order');
const timelineRouters = require('./routers/timeline');

mongoose.connect(
  "mongodb+srv://damanhtuan24022000:damanhtuan24022000@cluster1.zxnza45.mongodb.net/my_database?retryWrites=true&w=majority"
);



const app = express();

app.use(cors());
app.use(cookieParser());

app.use("/congkhai", express.static(path.join(__dirname, "./public")));

// CORS middleware
// const allowCrossDomain = (req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// };

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// app.use(allowCrossDomain);

app.use(express.json());

// app.get('/', (req, res) => {
//   let pathFile = path.join(__dirname, './page/home.html');
//   res.sendFile(pathFile);
// })

app.post("/register", async (req, res) => {
  try {
    let { name, date, email, password, telephone, gender } = req.body;
    if (!name || !date || !email || !telephone || !gender || !password) {
      return res
        .status(400)
        .send({ message: "Vui lòng gửi đầy đủ thông tin." });
    }
    const checkUnique = await UserModel.checkUniqueUser(email, telephone);
    if (checkUnique) {
      return res.status(400).send(checkUnique);
    }
    req.body.password = await bcrypt.hash(req.body.password, 8);
    UserModel.create(req.body)
      .then(() => {
        res.status(201).send({ message: "Tạo tài khoản thành công." });
      })
      .catch((error) => {
        let errObject = {};
        for (key in error.errors) {
          errObject[key] = error.errors[key].message;
        }
      });
  } catch (error) {
    res.status(500).send({ message: "Lỗi server" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Vui lòng gửi đầy đủ thông tin." });
    }
    const user = await UserModel.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({
      user: {
        name: user.name,
      },
      token,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

app.use("/user", userRouters);

app.use("/address", addressRouters);

app.use("/product", productRouters);

app.use("/brand", brandRouters);

app.use("/category", categoryRouters);

app.use("/blog", blogRouters);

app.use("/evaluate", evaluateRouters);

app.use("/cart", cartRouters);

app.use('/payment', paymentRouters);

app.use('/order', orderRouters);

app.use('/timeline', timelineRouters);

app.listen(process.env.PORT || 3030, () => {});

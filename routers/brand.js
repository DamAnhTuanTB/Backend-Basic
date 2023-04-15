const express = require('express');
const auth = require('../middlewares/auth');

// const BrandModel = require('../models/brand');

const router = express.Router();

const brand = [
  {
    id: 1,
    image: "https://static.30shine.com/shop-admin/2023/01/03/30SD1L10-b2a8049d1917eff484ec1022f298d9d6_tn.jpg",
    name: "Nerman"
  },
  {
    id: 2,
    image: "https://static.30shine.com/shop-admin/2022/12/06/30S6GLDR-30shine.jpg",
    name: "Nóng cùng mùa bóng"
  },
  {
    id: 3,
    image: "https://static.30shine.com/shop-admin/2021/12/16/30SBZX2P-halio.png",
    name: "Halio"
  },
  {
    id: 4,
    image: "https://static.30shine.com/shop-admin/2021/12/15/30SGZUFA-124238908_865630887511037_1330239005867470293_n.png",
    name: "Simple"
  },
  {
    id: 5,
    image: "https://static.30shine.com/shop-admin/2021/11/12/30SA6CYE-logo_opla.png",
    name: "G.G.G"
  },
  {
    id: 6,
    image: "https://static.30shine.com/shop-admin/2021/11/12/30SA6CYE-logo_opla.png",
    name: "G.G.G"
  },
  {
    id: 7,
    image: "https://static.30shine.com/shop-admin/2023/01/03/30SD1L10-b2a8049d1917eff484ec1022f298d9d6_tn.jpg",
    name: "Nerman"
  },
  {
    id: 8,
    image: "https://static.30shine.com/shop-admin/2022/12/06/30S6GLDR-30shine.jpg",
    name: "Nóng cùng mùa bóng"
  },
  {
    id: 9,
    image: "https://static.30shine.com/shop-admin/2021/12/16/30SBZX2P-halio.png",
    name: "Halio"
  },
  {
    id: 10,
    image: "https://static.30shine.com/shop-admin/2021/12/15/30SGZUFA-124238908_865630887511037_1330239005867470293_n.png",
    name: "Simple"
  },
  {
    id: 11,
    image: "https://static.30shine.com/shop-admin/2021/11/12/30SA6CYE-logo_opla.png",
    name: "G.G.G"
  },
  {
    id: 12,
    image: "https://static.30shine.com/shop-admin/2021/11/12/30SA6CYE-logo_opla.png",
    name: "G.G.G"
  }
]
// router.use(auth);

router.get('/', (req, res) => {
  res.status(200).send({
    brand
  });
})


module.exports = router;
const express = require("express");

const auth = require("../middlewares/auth");

const router = express.Router();

const blogs = [
  {
    id: 1,
    image:
      "https://static.30shine.com/shop-admin/2023/04/14/30SWY5EV-cach-vuot-sap-toc-nam-undercut.jpg",
    title: "Cách vuốt sáp tóc nam Undercut với 2 kiểu đơn giản, “men lỳ” nhất!",
    time: "14/04/2023",
    category: "Tóc đẹp mỗi ngày",
    description:
      "Tóc Undercut là kiểu tóc ngắn với phần phần lớn tóc 2 bên đầu được cắt ngắn sát đầu trong khi tóc phần trên đỉnh đầu lại vẫn để dài. Với những bạn có mặt oval, vuông hay tròn đều có thể để được kiểu tóc này. Cùng tham khảo cách vuốt sáp tóc nam undercut đúng chuẩn salon từ 30Shine Shop qua bài viết dưới đây!",
  },
  {
    id: 2,
    image:
      "https://static.30shine.com/shop-admin/2023/04/14/30SLAHQW-mua-sap-vuot-toc-o-dau.jpg",
    title: "Mua sáp vuốt tóc ở đâu? Đừng bỏ qua 30Shine Shop nhé!",
    time: "14/04/2023",
    category: "Tóc đẹp mỗi ngày",
    description:
      "“Mua sáp vuốt tóc ở đâu” là câu hỏi mà nhiều bạn đặt ra cho mình khi mới bắt đầu sử dụng các sản phẩm tạo kiểu tóc. 30Shine Shop - Hệ thống phân phối sản phẩm sáp vuốt tóc uy tín chắc chắn sẽ là lựa chọn khiến bạn hài lòng. Cùng tìm hiểu những lý do mà bạn nên mua hàng tại 30Shine Shop qua bài dưới đây!",
  },
  {
    id: 3,
    image:
      "https://static.30shine.com/shop-admin/2023/04/12/30S8TFME-reuzel-green-pomade-review.jpg",
    title:
      "Review Reuzel Green Pomade: hiệu quả tạo kiểu, giữ nếp có như lời đồn",
    time: "12/04/2023",
    category: "Tóc đẹp mỗi ngày",
    description:
      "Là sản phẩm vuốt tóc thương hiệu Reuzel đình đám, Reuzel Green Pomade (tên đầy đủ là Reuzel Green Grease Medium Hold Pomade) nhận được “cơn mưa” lời khen về khả năng biến hóa phù hợp với mọi kiểu tóc. Vậy chất lượng thực sự của sản phẩm có “thần thánh” như các bài review Reuzel Green Pomade hay không? Hãy cùng 30Shine Shop đánh giá chân thực sản phẩm Reuzel Green Grease Medium Hold Pomade thông qua bài viết sau đây.",
  },
  {
    id: 4,
    image:
      "https://static.30shine.com/shop-admin/2023/04/12/30S8TFME-reuzel-green-pomade-review.jpg",
    title: "Review tóc xinh xắn mỗi ngày",
    time: "12/04/2023",
    category: "Tóc đẹp mỗi ngày",
    description:
      "Là sản phẩm vuốt tóc thương hiệu Reuzel đình đám, Reuzel Green Pomade (tên đầy đủ là Reuzel Green Grease Medium Hold Pomade) nhận được “cơn mưa” lời khen về khả năng biến hóa phù hợp với mọi kiểu tóc. Vậy chất lượng thực sự của sản phẩm có “thần thánh” như các bài review Reuzel Green Pomade hay không? Hãy cùng 30Shine Shop đánh giá chân thực sản phẩm Reuzel Green Grease Medium Hold Pomade thông qua bài viết sau đây.",
  },
  {
    id: 5,
    image:
      "https://static.30shine.com/shop-admin/2023/04/12/30S8TFME-reuzel-green-pomade-review.jpg",
    title: "Review sữa rửa mặt Labo",
    time: "11/04/2023",
    category: "Sữa rửa mặt",
    description: "Là sản phẩm sữa rửa mặt tốt nhất thị trường.",
  },
];

router.use(auth);

router.get("/", (req, res) => {
  res.status(200).send({
    data: blogs,
  });
});

router.get("/:id", (req, res) => {
  let id = Number(req.params.id);
  if (id >= 1 && id <= 5) {
    res.status(200).send({
      data: blogs[id - 1],
    });
  } else {
    res.status(500).send({
      message: "Lỗi server",
    });
  }
});

module.exports = router;

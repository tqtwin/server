const express = require('express');
const router = express.Router();
const {products} = require('../../data/product');
const {productModel} = require('../../models/product');
// const products = [
//     { id: 1, name: 'Product 1', price: 100 },
//     { id: 2, name: 'Product 2', price: 200 },
//     { id: 3, name: 'Product 3', price: 300 }
// ];
// const productDetails = [
//     { id: 1, iddt: 1, quantity: '3', avatar: 'avatar1.jpg' },
//     { id: 2, iddt: 2, name: '45', avatar: 'avatar2.jpg' },
//     { id: 3, iddt: 3, name: '1', avatar: 'avatar3.jpg' }
// ];

// Trang chủ hiển thị danh sách sản phẩm

  router.get('/list-item', async (req, res) => {
    products = await productModel.find()
    return res.status(200).send(products)

})
// Xem chi tiết sản phẩm
// router.get('/:id/details', function (req, res, next) {
//     const id = parseInt(req.params.id);
//     const productDetail = productDetails.find(detail => detail.iddt === id);
//     if (productDetail) {
//         res.render('detail', { productDetail: productDetail }); // Render trang detail.ejs với dữ liệu chi tiết sản phẩm
//     } else {
//         res.status(404).send('Chi tiết sản phẩm không được tìm thấy');
//     }
// });


    router.post('/add-list-item', (req, res) => {
      const item = req.body
      // listItem.push(item)
      const product = new productModel(item)
      product.save().then(() => {
          console.log('Item added successfully')
      })
      return res.status(201).send("Item added successfully")
  })

// // Chỉnh sửa sản phẩm
// router.get('/:id/edit', function (req, res, next) {
//     const id = parseInt(req.params.id);
//     const product = products.find(product => product.id === id);
//     if (product) {
//         res.render('edit', { product: product }); // Render trang edit.ejs với dữ liệu sản phẩm cần chỉnh sửa
//     } else {
//         res.status(404).send('Sản phẩm không được tìm thấy');
//     }
// });
// router.post('/update',function(req,res,next){
//     const update ={
//         id:req.body.id,
//         name:req.body.name,
//         price:req.body.price,
//     }
//     const classIndex = products.findIndex(
//         (products) => products.id === parseInt(update.id)
//       );

//       if (classIndex !== -1) {
//         products[classIndex] = update;
//         console.log("Lớp đã được cập nhật:", update);
//       } else {
//         console.log("Không tìm thấy lớp cần cập nhật");
//       }
//       res.redirect("/list-item");
// })
// // Thêm sản phẩm
// router.get('/add', function (req, res, next) {
//     res.render('add'); // Render trang add.ejs
// });
// // Cập nhật sản phẩm sau khi chỉnh sửa
// router.put('/:id/edit', function (req, res, next) {
//     const id = parseInt(req.params.id);
//     const index = products.findIndex(product => product.id === id);
//     if (index !== -1) {
//         products[index] = req.body;
//         res.redirect('/list-item'); // Chuyển hướng về trang danh sách sản phẩm sau khi cập nhật
//     } else {
//         res.status(404).send('Sản phẩm không được tìm thấy');
//     }
// });
// // Xóa sản phẩm
// router.get("/delete/:id", function (req, res, next) {
//     const id = req.params.id;
//     const classIndex = products.findIndex((product) => product.id === parseInt(id));

//     if (classIndex !== -1) {
//       const deletedClass = products[classIndex];
//       products.splice(classIndex, 1);
//       console.log("Lớp đã bị xóa:", deletedClass);
//     } else {
//       console.log("Không tìm thấy lớp cần xóa");
//     }

//     res.redirect("/list-item");
//   });

module.exports = router;


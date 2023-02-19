/** @format */

const express = require("express");
const router = express.Router();
const con = require("../Connection");

//Get ALL

/**
 * tạo Arr kết quả []
 * Lấy List đơn hàng
 * từ list đơn hàng quét mảng lấy object theo id đơn hàng
 * Arr kết quả push object
 * res.json(Arr)
 */

router.get("/", function (req, res) {
  const keyword = req.query.q;
  const sortColumn = req.query._sort || "DonHang.id";
  const sortOrder = req.query._order || "asc";
  const page = parseInt(req.query._page) || 1;
  const limit = parseInt(req.query._limit) || 1000;
  const offset = (page - 1) * limit;

  let sql = `select DonHang.*, user.Name as 'NguoiMua' , user.SoDienThoai, user.DiaChi, user.Email from DonHang join user on DonHang.idUser=user.ID`;
  if (keyword) {
    sql = `select DonHang.id as 'idOrder',users.sodienthoai as 'phoneNumber', DonHang.createdAt as 'createdAt',users.username ,users.gioHangTam,users.address,users.email,DonHang.totalPrice,DonHang.isPay from DonHang 
  join users on users.id=DonHang.iduser WHERE id LIKE '%${keyword}%' or iduser  LIKE '%${keyword}% or createdAt  LIKE '%${keyword}% or totalPrice  LIKE '%${keyword}% or isPay  LIKE '%${keyword}%'`;
  }
  if (req.query.username) {
    sql = `select DonHang.id as 'idOrder',users.sodienthoai as 'phoneNumber', DonHang.createdAt as 'createdAt',users.username ,users.gioHangTam,users.address,users.email,DonHang.totalPrice,DonHang.isPay from DonHang 
    join users on users.id=DonHang.iduser where iduser = ${req.query.username} `;
  }
  sql += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT ${offset}, ${limit}`;
  con.query(sql, function (err, results) {
    if (err) {
      return res.send(err.code);
    }

    res.json(results);
  });
});

// get order by id
router.get("/:id", function (req, res) {
  let order = {};
  let idOrder = 0;
  let sql = `SELECT Donhang.id as 'id', user.name as 'UserName', user.Email, user.SoDienThoai, user.DiaChi, user.ID as 'UserID', Donhang.NgayTao as 'NgayTao', Donhang.TongTien, DonHang.TrangThai FROM DonHang JOIN User on DonHang.idUser = User.ID WHERE DonHang.id=${req.params.id}`;
  con.query(sql, (err, results) => {
    if (err) {
      return res.send(err.code);
    }
    if (results.length > 0) {
      idOrder += results[0].id;
      order = {
        id: results[0].id,
        UserID: results[0].UserID,
        UserName: results[0].UserName,
        Email: results[0].Email,
        SoDienThoai: results[0].SoDienThoai,
        DiaChi: results[0].DiaChi,

        NgayTao: results[0].NgayTao,
        TongTien: parseInt(results[0].TongTien),
        TrangThai: results[0].TrangThai,
        details: [],
      };

      let sqlGetDetailOrder = `SELECT sanpham.id,sanpham.TenSanPham,sanpham.Price,SanPham.HinhAnh, chitietdonhang.soLuong from chitietdonhang join SanPham on SanPham.id=chitietdonhang.idSP WHERE chitietdonhang.trangthai=0 and chitietdonhang.idDH = ${req.params.id}`;
      con.query(sqlGetDetailOrder, (err, results) => {
        if (err) {
          return res.send(err);
        }
        order.details = results;
        res.json(order);
      });
    } else {
      res.send({ Error: "No order found" });
    }
  });
});

//Get by idUser
router.get("/User/:id", function (req, res) {
  let order = {};
  let idOrder = 0;
  // let sql = `select DonHang.id as 'idOrder',user.sodienthoai as 'phoneNumber', DonHang.NgayTao as 'createdAt',user.name ,user.DiaChi, user.Email, DonHang.TongTien, DonHang.TrangThai from DonHang
  // join users on users.id=DonHang.iduser WHERE DonHang.ID = ${req.params.id} `;
  let sql = `SELECT DonHang.id as 'id', idUser, TongTien, NgayTao, TrangThai FROM DonHang WHERE idUser = ${req.params.id}`;
  con.query(sql, function (err, results) {
    if (err) {
      return res.send(err.code);
    }

    res.json(results);
  });
});

//Delete by id
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const sql = `delete from DonHang where id = ${id}`;
  con.query(sql, (err, rs) => {
    if (err) {
      return res.send(err);
    }
    res.json(rs);
  });
});

//Create
router.post("/", function (req, res) {
  const order = {
    idUser: req.body.idUser,
    totalPrice: req.body.totalPrice,
    ArrayProduct: req.body.ArrayProduct,
  };
  console.log(order);
  // Trang thai DonHang : 1 ĐÃ THANH TOÁN
  //                      0 CHƯA THANH TOÁN
  let sql = `INSERT INTO donhang( idUser, NgayTao, TongTien, TrangThai) VALUES ('${order.idUser}',now(),${order.totalPrice},0)`;
  con.query(sql, function (err, ketQua) {
    if (err) {
      return res.send(err);
    }
    //Xóa các chi tiết đơn hàng có mã idDH = Mã idUser (vì cài làm giỏ hàng tạm theo mã user và đặt trạng thái = 1)
    let sqlClear = `delete from chitietdonhang where idDH = ${order.idUser} `;
    con.query(sqlClear, (err, r) => {
      if (err) {
        return res.send(err);
      }
      if (order.ArrayProduct) {
        order.ArrayProduct.forEach(function (product) {
          let sqlInsertDetailOrder = `INSERT INTO chitietdonhang(idDH, idSP, soLuong, trangThai) VALUES (${ketQua.insertId},${product.ID},${product.soLuong},0)`;
          console.log(sqlInsertDetailOrder);
          con.query(sqlInsertDetailOrder, (err, results) => {
            if (err) {
              return res.send(err.code);
            }
          });
        });
      }
    });
  });
});

module.exports = router;

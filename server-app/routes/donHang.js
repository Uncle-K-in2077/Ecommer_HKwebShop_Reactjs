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
router.get("/", (req, res) => {
  let ListOrder = [];
  let jsonList = "";
  const keyword = req.query.q;
  const sortColumn = req.query._sort || "ngaytao";
  const sortOrder = req.query._order || "asc";
  const page = parseInt(req.query._page) || 1;
  const limit = parseInt(req.query._limit) || 100;
  const offset = (page - 1) * limit;

  let sql = `select * from DonHang`;
  if (keyword) {
    sql = `select * from DonHang where id like '%${keyword}%' `;
  }
  sql += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT ${offset}, ${limit}`;

  con.query(sql, (err, results) => {
    if (err) {
      return res.send(err.code);
    }

    if (results) {
      results.forEach((item) => {
        // order là đơn hàng chuẩn bị add vào mảng listorder
        let order = {};

        let sql = `SELECT * FROM DonHang WHERE ID='${item.ID}'`;
        con.query(sql, (err, results) => {
          // resule là đơn hàng theo item.id
          if (err) {
            return res.send(err.code);
          }

          if (results) {
            order = {
              ID: results[0].ID,
              idUser: results[0].idUser,
              NgayTao: results[0].NgayTao,
              TongTien: parseInt(results[0].TongTien),
              TrangThai: results[0].TrangThai,
              ArrayProduct: [],
            };

            console.log("đơn hàng: ", order);

            // đi lấy chi tiết đơn hàng gắn vào order
            let sqlGetDetailOrder = `SELECT * FROM chitietdonhang WHERE idDH='${order.ID}'`;
            con.query(sqlGetDetailOrder, (err, results) => {
              if (err) {
                return res.send(err);
              }
              order.ArrayProduct = results;
              console.log("mảng detail order: ", order.ArrayProduct);
              console.log("đơn hàng obj hoàn chỉnh", order);
              ListOrder.push(order);
              console.log("kết quả: ", ListOrder);
              jsonList = JSON.stringify(ListOrder);
              console.log("asd", jsonList);
              ListOrder = JSON.parse(jsonList);
              console.log("ádasdsadasd", ListOrder);
            });
          }
        });
      });
    }
  });
  res.json(jsonList);
});

router.get("/:id", function (req, res) {
  let order = {};
  let idDH = 0;
  let sql = `SELECT * FROM DonHang WHERE ID='${req.params.id}'`;
  con.query(sql, (err, results) => {
    if (err) {
      return res.send(err.code);
    }
    if (results) {
      idDH = results[0].ID;
      order = {
        ID: results[0].ID,
        idUser: results[0].idUser,
        NgayTao: results[0].NgayTao,
        TongTien: parseInt(results[0].TongTien),
        TrangThai: results[0].TrangThai,
        ChiTietDonHang: [],
      };

      let sqlGetDetailOrder = `SELECT idSP,soLuong,sanpham.TenSanPham,sanpham.HinhAnh,sanpham.Price,sanpham.Mota,sanpham.TrangThai FROM chitietdonhang
join sanpham on sanpham.id=chitietdonhang.idSP
WHERE idDH = '${order.ID}'`;
      con.query(sqlGetDetailOrder, (err, results) => {
        if (err) {
          return res.send(err);
        }
        order.ChiTietDonHang = results;
        res.json(order);
      });
    }
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
router.post("/", (req, res) => {
  const newDH = {
    id: req.body.id,
    idUser: req.body.idUser,
    TongTien: req.body.TongTien,
    NgayTao: req.body.NgayTao,
    TrangThai: req.body.TrangThai,
  };
  let sql = `insert into DonHang (id, idUser, TongTien, NgayTao, TrangThai) values (
        '${newDH.id}', '${newDH.idUser}', '${newDH.TongTien}', '${newDH.NgayTao}', '${newDH.TrangThai}')`;
});

/* 

*/
module.exports = router;

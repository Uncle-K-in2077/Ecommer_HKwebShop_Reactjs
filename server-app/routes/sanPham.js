/** @format */

const express = require("express");
const router = express.Router();
const con = require("../Connection");

//Get ALL
router.get("/", (req, res) => {
  const keyword = req.query.q;

  const sortColumn = req.query._sort || "id";
  const sortOrder = req.query._order || "desc";
  const page = parseInt(req.query._page) || 1;
  const limit = parseInt(req.query._limit) || 100;
  const offset = (page - 1) * limit;

  let sql = `select SanPham.*,LoaiSanPham.TenLoaiSP from SanPham join LoaiSanPham on LoaiSanPham.id = SanPham.idLSP where SanPham.TrangThai = 1`;

  if (keyword) {
    sql = `select * from SanPham where id like '%${keyword}%' `;
  }
  if (req.query._idLSP) {
    sql = `select sanpham.*,LoaiSanPham.id as 'idLSP',LoaiSanPham.TenLoaiSP as 'TenLoaiSP' from sanpham join LoaiSanPham on LoaiSanPham.id=sanPham.idLSP where idLSP = ${req.query._idLSP}`;
  }

  sql += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT ${offset}, ${limit}`;
  con.query(sql, (err, rs) => {
    if (err) {
      return res.send(err);
    }
    res.json(rs);
  });
});

//Get by id
router.get("/:id", (req, res) => {
  const id = req.params.id;

  let sql = `select * from SanPham where id = ${id} `;

  con.query(sql, (err, rs) => {
    if (err) {
      return res.send(err);
    }
    res.json(rs[0]);
  });
});

//Delete
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  let sql = `Delete FROM sanpham where id = ${id} `;
  con.query(sql, (err, rs) => {
    if (err) {
      return res.send(err);
    }
    res.json(rs);
  });
});

//them moi
router.post("/", (req, res) => {
  const newSP = {
    TenSanPham: req.body.TenSanPham,
    HinhAnh: req.body.HinhAnh,
    Price: req.body.Price,
    Mota: req.body.Mota,
    idLSP: req.body.idLSP,
  };
  let sql = `INSERT INTO sanpham ( TenSanPham, HinhAnh, Price, Mota, idLSP, TrangThai) VALUES ('${newSP.TenSanPham}', '${newSP.HinhAnh}', '${newSP.Price}', '${newSP.Mota}', ${newSP.idLSP}, 1)`;
  con.query(sql, (err, rs) => {
    if (err) {
      return res.send(err);
      // console.log(newSP);
    }
    res.json(rs);
    console.log(newSP);
  });
});

//Update Trang Thai (Xóa)
router.put("/remove/:id", (req, res) => {
  const id = req.params.id;
  let sql = `UPDATE SanPham set TrangThai = 0 where id = ${id}`;
  con.query(sql, (err, rs) => {
    if (err) {
      return res.send(err);
    }
    res.json(rs);
  });
});

//Update
router.put("/:id", (req, res) => {
  const newProduct = req.body.product;
  let sql = `UPDATE sanpham SET TenSanPham='${newProduct.TenSanPham}',HinhAnh='${newProduct.HinhAnh}',Price=${newProduct.Price},Mota='${newProduct.Mota}',idLSP=${newProduct.idLSP},TrangThai=${newProduct.TrangThai} WHERE ID=${newProduct.ID}`;
  con.query(sql, (err, rs) => {
    if (err) {
      return res.send(err);
    }
    res.json(rs);
  });
});

module.exports = router;

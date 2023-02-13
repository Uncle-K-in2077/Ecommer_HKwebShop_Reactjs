/** @format */

const express = require("express");
const router = express.Router();
const con = require("../Connection");

//Get ALL
router.get("/", (req, res) => {
  const keyword = req.query.q;

  const sortColumn = req.query._sort || "id";
  const sortOrder = req.query._order || "asc";
  const page = parseInt(req.query._page) || 1;
  const limit = parseInt(req.query._limit) || 10;
  const offset = (page - 1) * limit;

  let sql = `select * from SanPham `;

  if (keyword) {
    sql = `select * from SanPham where id like '%${keyword}%' `;
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

  let sql = `select * from SanPham where id = '${id}' `;

  con.query(sql, (err, rs) => {
    if (err) {
      return res.send(err);
    }
    res.json(rs);
  });
});

//Delete
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  let sql = `Delete sanpham where id = '${id}' `;
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
    id: req.body.id,
    TenSanPham: req.body.TenSanPham,
    HinhAnh: req.body.HinhAnh,
    Price: req.body.Price,
    Mota: req.body.Mota,
    idLSP: req.body.idLSP,
    TrangThai: req.body.TrangThai,
  };
  let sql = `INSERT INTO sanpham (ID, TenSanPham, HinhAnh, Price, Mota, idLSP, TrangThai) 
    VALUES (
    '${newSP.id}', 
    '${newSP.TenSanPham}' 
    '${newSP.HinhAnh}', 
    '${newSP.Price}', 
    '${newSP.Mota}', 
    '${newSP.idLSP}', 
    '${newSP.TrangThai}')`;
  con.query(sql, (err, rs) => {
    if (err) {
      return res.send(err);
    }
    res.json(rs);
  });
});

//Update
router.put("/:id", (req, res) => {
  const id = req.params.id;
  let sql = `UPDATE SanPham set 
    TenSanPham='${req.body.TenSanPham}',  
    HinhAnh='${req.body.HinhAnh}', 
    Price='${req.body.Price}', 
    Mota='${req.body.Mota}', 
    idLSP='${req.body.idLSP}', 
    TrangThai='${req.body.TrangThai}' 
    Where id = '${id}'`;
  con.query(sql, (err, rs) => {
    if (err) {
      return res.send(err);
    }
    res.json(rs);
  });
});

module.exports = router;

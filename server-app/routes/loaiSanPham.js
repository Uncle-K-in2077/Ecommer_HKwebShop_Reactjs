/** @format */

const express = require("express");
const router = express.Router();
const con = require("../Connection");

//Get all
router.get("/", (req, res) => {
  const keyword = req.query.q;

  const sortColumn = req.query._sort || "id";
  const sortOrder = req.query._order || "asc";
  const page = parseInt(req.query._page) || 1;
  const limit = parseInt(req.query._limit) || 10;
  const offset = (page - 1) * limit;

  let sql = `select * from loaiSanPham `;

  if (keyword) {
    sql = `select * from loaiSanPham where id like '%${keyword}%' `;
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

  let sql = `select * from loaiSanPham where id = '${id}' `;
  con.query(sql, function (err, rs) {
    if (err) {
      return res.send(err);
    }
    res.json(rs[0]);
  });
});

//Delete by id
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  let sql = `delete loaiSanPham where id = '${id}' `;
  con.query(sql, (err, rs) => {
    if (err) {
      return res.send(err);
    }
    res.json(rs);
  });
});

//Them moi
router.post("/", (req, res) => {
  const newDM = {
    TenLoaiSP: req.body.TenLoaiSP,
  };
  let sql = `INSERT INTO LoaiSanPham( TenLoaiSP, TrangThai) VALUES ('${newDM.TenLoaiSP}', 1)`;
  con.query(sql, (err, rs) => {
    if (err) {
      return res.send(err);
    }
    res.json(rs);
    console.log(sql);
  });
});

//Update
router.put("/:id", (req, res) => {
  const newDM = req.body.cate;
  let sql = `update loaisanpham set TenLoaiSP = '${newDM.TenLoaiSP}', trangThai= 1 WHERE id = ${newDM.id}`;
  con.query(sql, (err, rs) => {
    if (err) {
      return res.send(err);
    }
    res.json(rs);
    console.log(sql);
  });
});

module.exports = router;

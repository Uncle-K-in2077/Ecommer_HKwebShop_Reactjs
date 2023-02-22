/** @format */

const express = require("express");
const router = express.Router();
const con = require("../Connection");

//port+4000+/nhanvien
router.get("/", (req, res) => {
  const keyword = req.query.q;

  const sortColumn = req.query._sort || "id";
  const sortOrder = req.query._order || "asc";
  const page = parseInt(req.query._page) || 1;
  const limit = parseInt(req.query._limit) || 10;
  const offset = (page - 1) * limit;

  let sql = `select * from nhanvien `;

  if (keyword) {
    sql = `select * from nhanvien where id like '%${keyword}%' `;
  }

  sql += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT ${offset}, ${limit}`;
  con.query(sql, (err, rs) => {
    if (err) {
      return res.send(err);
    }
    res.json(rs);
  });
});

// Get theo id
router.get("/:id", (req, res) => {
  const id = req.params.id;

  let sql = `select * from nhanvien where id = ${id} `;

  con.query(sql, (err, rs) => {
    if (err) {
      return res.send(err);
    }
    res.json(rs[0]);
  });
});

//Delete theo id
router.delete("/:id", (req, res) => {
  let sql = ` delete nhanvien where id = '${id}'`;

  con.query(sql, (err, rs) => {
    if (err) {
      return res.send(err);
    }
    res.json(rs);
  });
});

//Thêm mới
router.post("/", (req, res) => {
  const item = {
    name: req.body.name,
    soDienThoai: req.body.soDienThoai,
    diaChi: req.body.diaChi,
    ngaySinh: req.body.ngaySinh,
    luong: req.body.luong,
    gioiTinh: req.body.gioiTinh,
    ngayVaoLam: req.body.ngayVaoLam,
    ghiChu: req.body.ghiChu,
  };
  let sql = `insert into NhanVien (id, Name, SoDienThoai, DiaChi, NgaySinh, Luong, GioiTin, NgayVaoLam, GhiChu, TrangThai) VALUES (
    '', '${item.name}', '${item.soDienThoai}', '${item.diaChi}', '${item.ngaySinh}', '${item.luong}', '${item.gioiTinh}', '${item.ngayVaoLam}', '${item.ghiChu}', 1
  )`;
  con.query(sql, (err, rs) => {
    if (err) {
      return res.send(err);
    }
    res.json(rs);
  });
});

//Update
router.put("/:id", (req, res) => {
  let sql = `update NhanVien set name='${req.body.name}', soDienThoai='${req.body.soDienThoai}', diachi='${req.body.diaChi}', ngaysinh='${req.body.ngaySinh}', 
  luong='${req.body.luong}', gioitinh='${req.body.gioiTinh}', ngayvaolam='${req.body.ngayVaoLam}', ghichu='${req.body.ghiChu}', trangthai='${req.body.trangthai}'
    where id='${req.params.id}'`;
  con.query(sql, (err, rs) => {
    if (err) {
      return res.send(err);
    }
    res.json(rs);
  });
});

module.exports = router;

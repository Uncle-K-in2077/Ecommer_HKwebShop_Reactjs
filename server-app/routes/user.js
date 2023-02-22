/** @format */

const express = require("express");
const router = express.Router();
const con = require("../Connection");

//port+4000+/user
router.get("/", (req, res) => {
  const keyword = req.query.q;

  const sortColumn = req.query._sort || "id";
  const sortOrder = req.query._order || "asc";
  const page = parseInt(req.query._page) || 1;
  const limit = parseInt(req.query._limit) || 10;
  const offset = (page - 1) * limit;

  let sql = `select * from user `;

  if (keyword) {
    sql = `select * from user where id like '%${keyword}%' `;
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

  let sql = `select * from user where id = ${id}  `;

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

  let sql = `delete user where id = '${id}' `;

  con.query(sql, (err, rs) => {
    if (err) {
      return res.send(err);
    }
    res.json(rs);
  });
});

//theem moi
router.post("/", (req, res) => {
  const newUser = {
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    soDienThoai: req.body.soDienThoai,
    diaChi: req.body.diaChi,
    gioiTinh: req.body.gioiTinh,
    trangThai: req.body.trangThai,
    ngaySinh: req.body.ngaySinh,
    role: req.body.role,
  };
  let sql = `INSERT INTO user (ID, Name, Email, Password, SoDienThoai, DiaChi, TrangThai, role) VALUES(
        '${newUser.id}',
        '${newUser.name}',
        '${newUser.email}',
        '${newUser.password}',
        '${newUser.soDienThoai}',
        '${newUser.diaChi}',
        
        '${newUser.trangThai}',
         
        '${newUser.role}'
        ) `;
  con.query(sql, (err, rs) => {
    if (err) {
      return res.send(err);
    }
    res.json(rs);
  });
});

//Update
router.put("/:id", (req, res) => {
  const newUser = req.body.user;

  let sql = `UPDATE user SET Name='${newUser.Name}',Email='${newUser.Email}',Password='${newUser.Password}',SoDienThoai='${newUser.SoDienThoai}',DiaChi='${newUser.DiaChi}',TrangThai=${newUser.TrangThai},role=${newUser.role} WHERE ID = ${newUser.ID}`;
  con.query(sql, (err, rs) => {
    if (err) {
      return res.send(err);
    }
    res.json(rs);
  });
});

module.exports = router;

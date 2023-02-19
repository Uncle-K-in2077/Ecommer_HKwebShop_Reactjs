/** @format */

const express = require("express");
const router = express.Router();
const con = require("../Connection");

router.get("/:userid", function (req, res) {
  let sql = `SELECT sanpham.* , chitietdonhang.soLuong FROM chitietdonhang join sanpham on chitietdonhang.idSP=sanpham.ID join user on user.ID=chitietdonhang.idDH where user.ID= ${req.params.userid} and chitietdonhang.trangthai = 1`;
  con.query(sql, function (err, results) {
    if (err) {
      return res.send(err);
    }
    res.json(results);
  });
});

router.put("/:userid", (req, res) => {
  let userid = req.params.userid;
  let gioHang = req.body.gioHang;

  let sqlXoaChiTietCu = `delete from chitietdonhang where idDH=${userid} `;

  con.query(sqlXoaChiTietCu, (err, results) => {
    if (err) {
      return res.status(401).json(err);
    }
    if (gioHang && gioHang.length > 0) {
      let sqlSetDetail = `insert into chitietdonhang values`;
      gioHang.forEach((item) => {
        sqlSetDetail += `(${userid}, ${item.ID},${item.soLuong},1),`;
      });
      con.query(sqlSetDetail.slice(0, sqlSetDetail.length - 1), (err, rs) => {
        if (err) {
          return res.send(err);
        }
      });
    }
  });
});

module.exports = router;

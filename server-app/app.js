/** @format */

const express = require("express");
const bodyParser = require("body-parser");
const app = express(); // main
const port = 4000;
const con = require("./Connection");
const cors = require("cors");
const nodemailer = require("nodemailer");


//Ngăn lỗi server
require("express-async-errors");
// set up cho app ("app")
app.use(bodyParser.json());
app.use(cors());

//import router
// const nhanvienRouter = require("./routes/nhanvien");
const userRouter = require("./routes/user");
const LoaiSanPhamRouter = require("./routes/loaiSanPham");
const SanPhamRouter = require("./routes/sanPham");
const DonHangRouter = require("./routes/donHang");
const gioHangTamRouter = require("./routes/gioHangTam");

// port 4000

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  let sql = `SELECT * FROM user WHERE Email = '${username}' and Password = '${password}'`;
  con.query(sql, (err, results) => {
    if (err) {
      return res.status(401).json({ error: "Incorrect username or password" });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: "Incorrect username or password" });
    }
    res.json(results[0]);
  });
});

//Register page
app.post("/register", (req, res) => {
  const { name, email, phoneNumber, adress, password } = req.body;
  let sql = `INSERT INTO user ( Name, Password, Email, SoDienThoai, DiaChi, TrangThai, role) VALUES ('${name}', '${password}', '${email}', '${phoneNumber}', '${adress}', 1, 1 )`;
  con.query(sql, (err, results) => {
    if (err) {
      return res.status(401).json({ error: "Email already taken" });
    }
    if (results.affectedRows === 0) {
      return res.status(401).json({ error: "Something wrong with the server" });
    }

    let sqlgetuser = `select * from user where id = ${results.insertId}`;
    con.query(sqlgetuser, (err, rs) => {
      if (err) {
        return res.status(401).json({ error: "Email already taken" });
      }
      if (rs.affectedRows === 0) {
        return res
          .status(401)
          .json({ error: "Something wrong with the server" });
      }
      res.json(rs[0]);
    });
  });
});

//Update Trạng thái cho đơn hàng (Admin role)
app.put("/UpdateStatus/:id", cors(), (req, res) => {
  let TrangThai = req.body.TrangThai;
  let sql = `UPDATE DonHang SET TrangThai = ${TrangThai} WHERE ID = ${req.params.id}`;
  console.log("Update like : ", sql);
  con.query(sql, (err, results) => {
    if (err) {
      return res.send(err);
    }
    res.json(results);
  });
});

//Node Mailer



// app.use("/nhanvien", cors(), nhanvienRouter);
app.use("/user", cors(), userRouter);
app.use("/loaisanpham", cors(), LoaiSanPhamRouter);
app.use("/sanpham", cors(), SanPhamRouter);
app.use("/donhang", cors(), DonHangRouter);
app.use("/giohangtam", cors(), gioHangTamRouter);

app.listen(port, function () {
  console.log(
    "Your app running on port " + port + "...🌊...🌊...🌊...🌊...🌊...🌊"
  );
});

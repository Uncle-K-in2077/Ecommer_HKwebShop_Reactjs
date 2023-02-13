/** @format */

const express = require("express");
const bodyParser = require("body-parser");
const app = express(); // main
const port = 4000;
const con = require("./Connection");
const cors = require("cors");
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
// port 4000

//Login page
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  let sql = `SELECT * FROM user WHERE Email = '${username}' and Password = '${password}'`;
  console.log(sql);
  con.query(sql, (err, results) => {
    if (err) {
      return res.status(401).json({ error: "Incorrect username or password" });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: "Incorrect username or password" });
    }
    res.json({ message: "Login successful" });
  });
});

//Register page
app.post("/register", (req, res) => {
  const { name, email, phoneNumber, adress, password } = req.body;
  let sql = `INSERT INTO user ( Name, Password, Email, SoDienThoai, DiaChi, TrangThai, role) 
            VALUES ('${name}', '${password}', '${email}', '${phoneNumber}', '${adress}', 1, 1 )`;
  console.log(sql);
  con.query(sql, (err, results) => {
    if (err) {
      return res.status(401).json({ error: "Email already taken" });
    }
    if (results.affectedRows === 0) {
      return res.status(401).json({ error: "Something wrong with the server" });
    }
    res.json({ error: "Register Success" });
  });
});

// app.use("/nhanvien", cors(), nhanvienRouter);
app.use("/user", cors(), userRouter);
app.use("/loaisanpham", cors(), LoaiSanPhamRouter);
app.use("/sanpham", cors(), SanPhamRouter);
app.use("/donhang", cors(), DonHangRouter);

app.listen(port, function () {
  console.log("Your app running on port " + port);
});

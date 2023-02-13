/** @format */

const mysql = require("mysql2");

var con = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "hkwebshop",
});

module.exports = con;

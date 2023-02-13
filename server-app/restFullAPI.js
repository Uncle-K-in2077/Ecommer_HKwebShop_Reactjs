/** @format */

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const items = [];

// Route handler cho phương thức GET tất cả các mục
app.get("/items", (req, res) => {
  res.json(items);
});

// Route handler cho phương thức GET một mục cụ thể
app.get("/items/:id", (req, res) => {
  const item = items.find((item) => item.id === parseInt(req.params.id));
  if (!item) return res.status(404).send("Không tìm thấy mục với ID đã cho.");
  res.json(item);
});

// Route handler cho phương thức POST
app.post("/items", (req, res) => {
  const item = {
    id: items.length + 1,
    name: req.body.name,
  };
  items.push(item);
  res.json(item);
});

// Route handler cho phương thức PUT
app.put("/items/:id", (req, res) => {
  const item = items.find((item) => item.id === parseInt(req.params.id));
  if (!item) return res.status(404).send("Không tìm thấy mục với ID đã cho.");
  item.name = req.body.name;
  res.json(item);
});

// Route handler cho phương thức DELETE
app.delete("/items/:id", (req, res) => {
  const itemIndex = items.findIndex(
    (item) => item.id === parseInt(req.params.id)
  );
  if (itemIndex === -1)
    return res.status(404).send("Không tìm thấy mục với ID đã cho.");
  const item = items.splice(itemIndex, 1);
  res.json(item);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server đang chạy trên cổng ${port}`);
});

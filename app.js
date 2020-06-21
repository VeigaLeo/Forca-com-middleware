const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const port = 3000;

app.use("/css", express.static(__dirname + "/src/public/assets"));
app.use("/js", express.static(__dirname + "/src/controller"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/public/index.html");
});
require("./src/routes/index")(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
module.exports = app;

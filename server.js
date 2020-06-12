import express from "express";
import path from "path";
import ejs from "ejs";

const server = express();
const port = 3333;

const __dirname = path.resolve();

server.use(express.static(path.join(__dirname, "src")));
server.set("views", path.join(__dirname, "src"));
server.engine("html", ejs.renderFile);
server.set("view engine", "html");

server.use("/", (req, res) => {
  res.render("public/index.html");
});

server.listen(port, () => console.log(`Server running at port: ${port}`));

const bodyParser = require("body-parser");

const express = require("express");

const db = require("./util/db");

const app = express();

const port = 2500;

const authRoutes = require("./router/auth");
const mainRoutes = require("./router/main");

app.use(express.json());

const main = async () => {
  try {
    await db.connectToDB();
    console.log("seccussful connected to exerciser database");
  } catch (err) {
    console.log("connecting failed", err);
  }
};
main();

app.use(bodyParser({ extended: false }));

app.use("/auth", authRoutes);
app.use("/user", mainRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.listen(port, () => {
  console.log(`th Exerciser Server Running at port http://${port}`);
});

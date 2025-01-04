const express = require("express");

const router = express.Router();

const { db } = require("../util/db");
const { complexHash } = require("../util/hashTools");

const usersCollection = db.collection("users");

router.use("/signup", async (req, res) => {
  const user = req.body.user;
  if (await usersCollection.findOne({ email: user.email })) {
    return res.json({ message: "user already exists 😡😡😡" });
  }
  usersCollection.insertOne(user);
  res.json({ message: "user created successfully 😃😃😃" });
});

router.post("/check-user", async (req, res) => {
  const { email, password } = req.body;
  const encryptedPassword = complexHash(password);
  const user = await usersCollection.findOne({
    email,
    password: encryptedPassword,
  });
  if (user) {
    return res.json({ isExisted: true });
  }
  res.json({ isExisted: false });
});

router.post("/get-user", async (req, res) => {
  const { email } = req.body;
  const user = await usersCollection.findOne({ email });
  return res.json(user);
});

module.exports = router;

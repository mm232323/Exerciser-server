const express = require("express");

const router = express.Router();

const { db } = require("../util/db");

const usersCollection = db.collection("users");

router.post("/set-personals", async (req, res) => {
  const { gender, phone, jobTitle, userEmail } = req.body;
  await usersCollection.updateOne(
    { email: userEmail },
    { $set: { gender, phone, jobTitle } }
  );
  res.json({ message: "user personals sent successfully" });
});

router.post("/set-avatar", (req, res) => {
  const { email, avatar } = req.body;
  usersCollection.updateOne({ email }, { $set: { avatar } });
  res.json({ message: "avatar sent successfully" });
});

router.post("/create-deck", (req, res) => {
  const email = req.body.email;
  const deck = req.body.deck;
  usersCollection.updateOne({ email }, { $push: { decks: deck } });
  res.json({ message: "deck created successfully" });
});

router.post("/create-card", async (req, res) => {
  const email = req.body.email;
  const card = req.body.card;
  const user = await usersCollection.findOne({ email });
  user.decks = user.decks.map((deck) => {
    if (deck.name === card.deck) {
      deck.cards.push(card);
    }
    return deck;
  });
  usersCollection.deleteOne({ email });
  usersCollection.insertOne(user);
  res.json({ message: "card created successfully" });
});

router.post("/delete-deck", (req, res) => {
  const email = req.body.email;
  const card = req.body.deckName;
  usersCollection.updateOne({ email }, { $pull: { decks: { name: card } } });
  res.json({ message: "card deleted successfully" });
});

module.exports = router;

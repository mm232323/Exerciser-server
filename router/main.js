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

router.post("/get-deck", async (req, res) => {
  const email = req.body.email;
  const deckName = req.body.deckName;
  const deck = (await usersCollection.findOne({ email })).decks.filter(
    (deck) => deck.name == deckName
  )[0];
  res.json({ deck });
});

router.post("/set-tests", async (req, res) => {
  const { email, tests, state, deck } = req.body;
  const user = await usersCollection.findOne({ email });
  user.progress = { state, deck, tests };
  usersCollection.deleteOne({ email });
  usersCollection.insertOne(user);
  res.json({ message: "progress updated successfully!" });
});

router.post("/set-answer", async (req, res) => {
  const { testIdx, answer, email } = req.body;
  const user = await usersCollection.findOne({ email });
  user.progress.tests = user.progress.tests.map((test, idx) =>
    idx == testIdx
      ? {
          name: test.name,
          properties: test.properties,
          answer,
          correctAnswer: test.correctAnswer,
        }
      : test
  );
  usersCollection.deleteOne({ email });
  usersCollection.insertOne(user);
  res.json({ message: "answer setted successfully!" });
});

router.post("/set-practiced", async (req, res) => {
  const { deck, language, maxScore, score, finalScore, tests, email } =
    req.body;
  usersCollection.updateOne(
    { email },
    {
      $push: {
        practiced: {
          deck,
          language,
          maxScore,
          score,
          finalScore,
          tests,
          state: "active",
        },
      },
      $set: {
        progress: { state: "off", deck: "", tests: [] },
      },
    }
  );
  res.json({ message: "practice setted successfully" });
});

router.post("/de-activate-practice", async (req, res) => {
  const email = req.body.email;
  const user = usersCollection.findOne({ email });
  user.practiced[user.practiced.length - 1] = {
    ...user.practiced,
    state: "off",
  };
  usersCollection.deleteOne({ email });
  usersCollection.insertOne(user);
  res.json({ message: "the practice de activated successfully" });
});

module.exports = router;

import express from "express";

const gameRoute = express.Router();

gameRoute.get("/:gameid", (req, res) => {
  const gameid = req.params["gameid"];
  res.status(200);
  res.send(`You are in game ${gameid}!`);
});

export default gameRoute;

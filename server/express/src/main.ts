import express from "express";
import gameRoute from "./gameRoute";

const app = express();
const port = 5385;

app.get("/", (req, res) => res.send("Hello World!"));
app.use("/game", gameRoute);

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

"use strict";

const express = require("express");
const roomRouter = require("./controller/room-controller");
const choreRouter = require("./controller/chore-controller");

const loggerFactory = require("./component/LoggerFactory");
loggerFactory.setLevel("INFO")

const loggingMiddleware = require("./middleware/logging-middleware");

const app = express();

//

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggingMiddleware);

app.use("/rooms", roomRouter);
app.use("/chores", choreRouter);

app.listen(3000, () => {
  console.log("Express server listening on port 3000.")
});

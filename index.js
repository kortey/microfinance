const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./models");

const usersRouter = require("./app/routes/usersroute");
const { registerRouter } = require("./app/routes/registerroute");
const { loginRouter } = require("./app/routes/loginroute");
const userErrorMiddleware = require("./app/middlewares/usererror");
const meRouter = require("./app/routes/meroute");
const { clientRouter } = require("./app/routes/clientsRoute");
const loanRouter = require("./app/routes/loanroutes");
const paymentRouter = require("./app/routes/paymentroutes");
dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// //main api for the app
app.use("/api/v1", usersRouter);
app.use("/api/v1", registerRouter);
app.use("/api/v1", loginRouter);
app.use("/api/v1", meRouter);

//creating clients
app.use("/api/v1", clientRouter);

//loans
app.use("/api/v1", loanRouter);

//payments
app.use("/api/v1", paymentRouter);

app.use(userErrorMiddleware);

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  try {
    await db.sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});

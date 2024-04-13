const bodyParser = require("body-parser");
const express = require("express");
const apiRoutes = require("./routes");

const sequelize = require("./utils/databaseConnection");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1", apiRoutes);

const port = process.env.PORT || 8080;

sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

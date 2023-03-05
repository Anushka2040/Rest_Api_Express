import express from "express";
var cookieParser = require("cookie-parser");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use("/api/pets", require("./routes/petRouters"));
app.use("/api/store", require("./routes/storeRouters"));
app.use("/api/user", require("./routes/userRouters"));

app.listen(PORT, () => {
  console.log("Server is running on port.");
});

const express = require("express");
const cors = require("cors");
const app = express();
const salesRoutes = require("./routes/sales");
const { getDatabase } = require("./config/database");

app.use(cors()); 
app.use(express.json());
app.use(salesRoutes);

(async () => {
  try {
    await getDatabase();
    console.log("Server is connecting to the database...");
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
})();

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

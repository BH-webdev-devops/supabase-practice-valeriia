import express, { Request, Response, Application } from "express";
import "dotenv/config";
import userrouter from "./route/userrouter";
import pool from "./db/database";

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userrouter);

app.get("/", (req: Request, res: Response): any => {
  return res.send(`Welcome to our node and postgres API`);
});

const startServer = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Database connected successfully");
    client.release(); // Release the client back to the pool

    app.use("/api", userrouter);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.log("❌ Failed to connect to the database", err);
  }
};
startServer();

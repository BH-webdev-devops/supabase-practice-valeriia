import pool from "./db/database";

async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    console.log("✅ Database connected successfully");
    client.release(); // Release the client back to the pool
  } catch (error) {
    console.error("❌ Failed to connect to the database", error);
  } finally {
    await pool.end(); // Close the pool if not used in the app's lifecycle
  }
}

testDatabaseConnection();

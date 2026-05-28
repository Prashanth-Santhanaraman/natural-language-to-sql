const express = require("express");
const mysql = require("mysql2/promise");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Allow cross-origin requests (e.g. from Live Server on port 5500)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
};

// Get database metadata
async function getDBMetadata() {
  const connection = await mysql.createConnection(dbConfig);

  const [rows] = await connection.execute(
    `
    SELECT 
      table_name,
      column_name,
      data_type,
      column_key
    FROM information_schema.columns
    WHERE table_schema = ?
    ORDER BY table_name, ordinal_position
    `,
    [dbConfig.database]
  );

  await connection.end();
  return rows;
}


// Generate SQL using Gemini
async function generateSQL(question, metadata) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
  });

  const prompt = `
Convert the user question into MySQL SQL query.

Database metadata:
${JSON.stringify(metadata, null, 2)}

Rules:
- Return only SQL query
- Use only SELECT queries
- Do not use INSERT, UPDATE, DELETE, DROP, ALTER
- Use only available tables and columns
- Do not explain anything

Question: ${question}
`;

  const result = await model.generateContent(prompt);

  let sql = result.response.text().trim();

  sql = sql.replace(/```sql/g, "").replace(/```/g, "").trim();

  return sql;
}

// Safety check
function isSafeSQL(sql) {
  const lowerSQL = sql.toLowerCase();

  const blockedWords = [
    "insert",
    "update",
    "delete",
    "drop",
    "alter",
    "truncate",
    "create",
  ];

  return lowerSQL.startsWith("select") &&
    !blockedWords.some((word) => lowerSQL.includes(word));
}

// API route
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    const metadata = await getDBMetadata();

    const sql = await generateSQL(question, metadata);

    if (!isSafeSQL(sql)) {
      return res.status(400).json({
        error: "Unsafe SQL query blocked",
        sql,
      });
    }

    const connection = await mysql.createConnection(dbConfig);

    const [result] = await connection.execute(sql);

    await connection.end();

    res.json({
      question,
      sql,
      result,
    });
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong",
      details: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
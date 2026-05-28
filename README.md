# ⚽ NLP → SQL · Premier League Query Engine

> Ask questions about Premier League football in **plain English** — powered by **Gemini AI** and a MySQL database covering **25 years** of match data (2000–2025).

---

## 🖥️ Demo

Type a natural language question like:

```
Which team won the most matches at home ?
How many matches have Arsenal won in total ?
```

The app converts it to SQL using **Gemini 2.5 Flash Lite**, runs it against the database, and displays the results in a sortable, filterable table — instantly.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI-Powered** | Uses Google Gemini AI to convert natural language to SQL |
| 🔒 **Safe Queries** | Only `SELECT` statements are allowed — all write operations are blocked |
| 🗃️ **Dynamic Schema** | Reads live DB metadata so the AI always knows your table structure |
| 🎨 **Premium UI** | Dark-mode glassmorphism interface with real-time results |
| 📊 **Sortable Table** | Click any column header to sort results ascending/descending |
| 🔍 **Live Filter** | Instantly filter returned rows by any value |
| 📋 **Copy SQL** | One-click copy of the generated SQL query |
| 🕒 **Query History** | Last 10 queries saved for quick re-runs |
| ⚡ **Auto-resize Input** | Textarea grows with your question; `Enter` submits |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Node.js + Express |
| **AI Model** | Google Gemini 2.5 Flash Lite (`@google/generative-ai`) |
| **Database** | MySQL (`mysql2/promise`) |
| **Frontend** | Vanilla HTML, CSS, JavaScript |
| **Fonts** | Inter + JetBrains Mono (Google Fonts) |
| **Environment** | `dotenv` |

---

## 📁 Project Structure

```
NLP to SQL/
├── index.html       # Frontend UI (served statically by Express)
├── Server.js        # Express backend — AI + DB logic
├── .env             # Environment variables (not committed)
├── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A running **MySQL** server
- A **Google Gemini API key** → [Get one here](https://aistudio.google.com/app/apikey)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/nlp-to-sql-premier-league.git
cd nlp-to-sql-premier-league
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
MYSQL_HOST=localhost
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=PremierLeague
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Import the dataset

Download the dataset from Kaggle (see [Dataset Credits](#-dataset-credits) below) and import it into your MySQL database:

```bash
mysql -u your_user -p PremierLeague < premier_league.sql
```

### 5. Start the server

```bash
# Using nodemon (recommended for development)
npx nodemon Server.js

# Or standard node
node Server.js
```

### 6. Open the app

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## ⚙️ How It Works

```
User types a question
        ↓
Express receives POST /ask
        ↓
Reads live DB schema from information_schema
        ↓
Sends question + schema to Gemini AI
        ↓
Gemini returns a SQL SELECT query
        ↓
Safety check (blocks INSERT / UPDATE / DELETE / DROP etc.)
        ↓
Executes query on MySQL
        ↓
Returns { question, sql, result } as JSON
        ↓
Frontend renders sortable results table
```

---

## 🔐 Safety

The server enforces the following before executing any query:

- ✅ Must start with `SELECT`
- ❌ Blocks: `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`, `CREATE`

This ensures the AI can never modify or destroy your data.

---

## 📦 Dependencies

```json
{
  "express": "^4.x",
  "mysql2": "^3.x",
  "@google/generative-ai": "^0.x",
  "dotenv": "^16.x"
}
```

---

## 📊 Dataset Credits

The Premier League match data (2000–2025) used in this project was sourced from Kaggle:

**[English Premier League (EPL) Match Data 2000–2025](https://www.kaggle.com/datasets/marcohuiii/english-premier-league-epl-match-data-2000-2025)**
by **marcohuiii** on Kaggle.

> **License:** This dataset is for **educational and non-commercial use only**.
> Raw data originally sourced from [football-data.co.uk](https://www.football-data.co.uk).
> Please credit the source if you use or share this dataset.

---

## 🤖 AI Credits

This project uses the **[Google Gemini API](https://ai.google.dev/)** (model: `gemini-2.5-flash-lite`) for natural language to SQL conversion.

---

## 📄 License

This project is intended for **educational and non-commercial use** in accordance with the dataset license.

---

## 🙌 Contributing

Pull requests are welcome! If you have ideas for new features (e.g., chart visualizations, multi-database support, query explanations), feel free to open an issue.

---

<p align="center">
  Made with ❤️ using Node.js · Gemini AI · MySQL
</p>

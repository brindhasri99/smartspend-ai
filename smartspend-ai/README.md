# SmartSpend AI

SmartSpend AI is a modern MERN stack personal finance dashboard designed to help users manage expenses, track income, monitor spending habits, and gain financial insights using AI-powered tools.

The platform combines expense management, receipt OCR scanning, CSV imports, analytics dashboards, and AI-assisted transaction entry into a clean and responsive user experience.

---

## 💰 Features

### 🔐 Authentication & Security
- User registration and login
- JWT-based authentication
- Protected routes and secure API access
- Persistent user sessions

### 📊 Expense Management
- Add, edit, and delete transactions
- Track income and expenses
- Categorize spending records
- Transaction filtering and search

### 📥 Smart Imports
- CSV transaction import support
- Receipt OCR scanning using OCR
- AI-assisted expense creation from natural language

### 📈 Analytics Dashboard
- Spending summaries and visual charts
- Category-wise expense analysis
- Financial insights and trends
- Responsive dashboard UI

### 🎨 User Experience
- Fully responsive design
- Clean and modern UI
- Reusable React components
- Organized frontend and backend architecture

---

## 🛠️ Tech Stack

### Frontend
- React
- Tailwind CSS
- Axios
- React Router
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Gemini API

---

## 🗂️ Project Structure

```text
smartspend-ai/
├── client/                  # React frontend
├── server/                  # Express backend
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB
- npm

### Installation

```bash

git clone https://github.com/brindhasri99/smartspend-ai.git
cd smartspend-ai
npm run install-all
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GEMINI_API_KEY=
```

---

## ▶️ How to Run

Start frontend and backend together:

```bash
npm run dev
```

Run backend only:

```bash
npm run server
```

Run frontend only:

```bash
npm run client
```

Frontend:
`http://localhost:3000`

Backend:
`http://localhost:5000`

---

## 📌 Available Scripts

```bash
npm run dev
npm run server
npm run client
npm run install-all
```

---

## 🔮 Future Improvements

- Budget planning system
- Recurring transaction support
- AI spending predictions
- PDF report exports
- Bank API integration
- Multi-currency support
- Advanced analytics dashboard

---

## 👨‍💻 Author

brindha ssri  Rajasekhar

---

## 📄 License

This project is built for learning, portfolio, and MERN stack practice purposes.
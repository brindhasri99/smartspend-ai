# SmartSpend AI

SmartSpend AI is a MERN fintech dashboard for persistent personal finance tracking. It includes JWT authentication, user-specific MongoDB storage, transaction CRUD, CSV import, OCR receipt scanning, AI-assisted transaction entry, analytics, budget signals, and a premium responsive React interface.

## Highlights

- Secure signup, login, logout, protected routes, and session refresh with JWT
- MongoDB persistence for every user's income, expenses, budgets, and profile preferences
- Premium SaaS dashboard with dark/light mode, glass panels, responsive sidebar, skeleton states, and toast notifications
- Transaction ledger with add, edit, delete, search, type/category filters, and CSV export
- Analytics powered by Recharts: income vs expense, category split, weekly spending, and savings trend
- AI features: natural language transaction capture, category guessing, insights, budget usage, and overspending alerts
- Browser OCR receipt scanner using Tesseract.js
- Express MVC-style backend with protected REST routes, validation, pagination/filtering, and centralized error handling

## Tech Stack

- Frontend: React.js, Tailwind CSS, Axios, Recharts, React Icons, Tesseract.js
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT and bcryptjs
- AI: Gemini API with local rule-based fallback

## Folder Structure

```text
smartspend-ai/
  client/
    src/
      api/          Axios client and auth interceptor
      components/   Dashboard, chart, form, and UI building blocks
      context/      Auth and toast providers
      pages/        App routes
      utils/        Formatting, CSV, receipt parsing helpers
  server/
    config/         MongoDB connection
    controllers/    Auth, expense, and AI route logic
    middleware/     JWT protection
    models/         User and transaction schemas
    routes/         REST API routes
    utils/          AI/category parsing helpers
```

## Run Locally

```bash
npm run install-all
cp .env.example .env
npm run dev
```

Frontend: `http://localhost:3000`
Backend: `http://localhost:5000`

## Environment

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smartspend_ai
JWT_SECRET=change_this_for_local_project
GEMINI_API_KEY=
```

`GEMINI_API_KEY` is optional. Without it, SmartSpend AI still parses common expense sentences with local rules.

## API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/me`
- `GET /api/expenses`
- `POST /api/expenses`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`
- `POST /api/expenses/import`
- `GET /api/expenses/summary`
- `POST /api/ai/create`
- `POST /api/ai/parse`
- `GET /api/ai/insights`

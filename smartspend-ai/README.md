# SmartSpend AI

SmartSpend AI is a MERN stack personal finance dashboard that helps users track income, expenses, savings, and spending patterns. It includes authentication, MongoDB-backed transaction storage, CSV import, receipt OCR, AI-assisted expense entry, and visual analytics.

## Features

- User registration, login, logout, and protected routes with JWT
- MongoDB persistence for user-specific transactions and profile data
- Add, edit, delete, search, and filter income or expense records
- CSV import for bank or transaction data
- Receipt scanning with OCR support
- AI-assisted transaction entry from natural language text
- Spending insights, budget signals, and category analysis
- Responsive React dashboard with charts and reusable UI components
- Centralized Axios client for frontend API requests
- Organized Express backend using routes, controllers, models, middleware, and utilities

## Tech Stack

**Frontend**

- React
- React Router
- Axios
- Tailwind CSS
- Recharts
- React Icons
- Tesseract.js

**Backend**

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Gemini API integration

## Project Structure

```text
smartspend-ai/
  client/
    public/
    src/
      api/          Shared Axios client
      assets/       Images and static frontend assets
      components/   Reusable UI components
      context/      React providers
      hooks/        Reusable React hooks
      layouts/      Route shells and app layouts
      pages/        Route-level screens
      services/     Frontend business/data services
      styles/       Global styles and Tailwind layers
      utils/        Formatting, CSV, and receipt helpers
      App.jsx
      main.jsx
  server/
    config/         Database and runtime configuration
    controllers/    Request handlers
    middleware/     Express middleware
    models/         Mongoose schemas
    routes/         REST route definitions
    services/       Backend business integrations
    utils/          Shared backend helpers
    validations/    Request validation schemas
    server.js
```

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd smartspend-ai
```

### 2. Install Dependencies

Install backend and frontend dependencies:

```bash
npm run install-all
```

### 3. Configure Environment Variables

Create backend and frontend environment files:

```bash
cp .env.example .env
cp client/.env.example client/.env
```

Backend `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smartspend_ai
JWT_SECRET=change_this_for_local_project
GEMINI_API_KEY=
```

Frontend `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

`GEMINI_API_KEY` is optional. The app can still use local parsing fallback logic without it.

### 4. Run the App

Start frontend and backend together:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:5000
```

## Available Scripts

```bash
npm run dev          # Run backend and frontend together
npm run server       # Run Express backend with nodemon
npm start            # Run Express backend with node
npm run client       # Run React frontend
npm run install-all  # Install root and client dependencies
```

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/me`

### Expenses

- `GET /api/expenses`
- `POST /api/expenses`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`
- `POST /api/expenses/import`
- `GET /api/expenses/summary`

### AI

- `POST /api/ai/create`
- `POST /api/ai/parse`
- `GET /api/ai/insights`

## Future Features

- Monthly and yearly budget planning
- Recurring transaction support
- Advanced spending predictions using AI
- Export reports as PDF
- Email reminders for budget limits and upcoming bills
- Multi-currency support
- Dark/light theme persistence improvements
- Admin dashboard for managing users and system analytics
- Better receipt parsing with merchant, tax, and item-level extraction
- Goal tracking for savings, debt payoff, and investments
- Bank API integration for automatic transaction syncing
- Unit and integration test coverage for frontend and backend
- Docker setup for easier local development and deployment
- Deployment guides for Render, Vercel, Railway, or AWS

## Scalability Notes

- Keep route handlers thin by moving reusable business logic into `server/services`.
- Add request schemas in `server/validations` before controllers grow more complex.
- Keep shared frontend API calls in `client/src/api` or `client/src/services` instead of calling Axios directly from pages.
- Add feature folders only when a domain becomes large enough to justify grouping page, component, hook, and service files together.
- Add tests around authentication, transaction CRUD, CSV import, and AI parsing before expanding production use.

## License

This project is intended for learning, portfolio, and internship-level MERN development practice.

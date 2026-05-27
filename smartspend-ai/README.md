# SmartSpend AI

SmartSpend AI is a MERN personal finance dashboard with JWT authentication, MongoDB-backed transaction storage, CSV import, receipt OCR, AI-assisted transaction entry, and analytics.

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

## Setup

Install dependencies from the project root:

```bash
npm run install-all
```

Create environment files:

```bash
cp .env.example .env
cp client/.env.example client/.env
```

Update `.env` with your MongoDB URI, JWT secret, and optional Gemini API key.

## Run Locally

Start backend and frontend together:

```bash
npm run dev
```

Run each side separately:

```bash
npm run server
npm run client
```

Frontend: `http://localhost:3000`

Backend: `http://localhost:5000`

## Environment Files

Backend variables live in `.env` at the project root:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smartspend_ai
JWT_SECRET=change_this_for_local_project
GEMINI_API_KEY=
```

Frontend variables live in `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Useful Scripts

```bash
npm run dev          # Run API and React app together
npm run server       # Run Express API with nodemon
npm start            # Run Express API with node
npm run client       # Run React app
npm run install-all  # Install root and client dependencies
```

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

## Scalability Notes

- Keep route handlers thin by moving reusable business logic into `server/services`.
- Add request schemas in `server/validations` before controllers grow more complex.
- Keep shared frontend API calls in `client/src/api` or `client/src/services` instead of calling Axios directly from pages.
- Add feature folders only when a domain becomes large enough to justify grouping page, component, hook, and service files together.

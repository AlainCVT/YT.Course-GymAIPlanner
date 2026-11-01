# GymAI Planner

GymAI Planner is a full-stack web application that creates personalized workout plans with AI. Users sign in with Neon Auth, complete a fitness profile, and receive a training program tailored to their goals, experience, schedule, available equipment, preferred split, and injuries or limitations.

## Features

- Neon Auth sign-in and account management
- Guided onboarding questionnaire
- AI-generated training plans through OpenRouter
- Support for bulk, cut, recomposition, strength, and endurance goals
- Plans adapted to experience level, weekly frequency, session length, equipment, and preferred split
- Exercise sets, reps, rest periods, RPE, notes, alternatives, and progression guidance
- Profile updates and plan versioning
- PostgreSQL persistence through Prisma and Neon

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, React Router, Tailwind CSS
- **Backend:** Node.js, Express 5, TypeScript
- **Authentication:** Neon Auth
- **Database:** PostgreSQL with Prisma 7 and the PostgreSQL driver adapter
- **AI:** OpenRouter through the OpenAI SDK
- **Package manager:** pnpm workspaces

## Project Structure

```text
.
├── src/                 # React frontend
│   ├── components/      # Shared UI and layout components
│   ├── contexts/        # Authentication state
│   ├── pages/           # Home, auth, onboarding, profile, and account views
│   └── lib/             # Browser-side API and auth clients
├── server/              # Express API
│   ├── prisma/          # Prisma schema and migrations
│   └── src/
│       ├── routes/      # Profile and training-plan endpoints
│       ├── lib/         # Prisma and AI clients
│       └── validators/  # Request validation
└── public/              # Static frontend assets
```

## Prerequisites

- Node.js 20 or newer
- pnpm 10 or newer
- A PostgreSQL database, such as a Neon project
- A Neon Auth project
- An OpenRouter API key and an available model

## Getting Started

1. Install dependencies from the repository root:

```bash
pnpm install
```

2. Create `server/.env`:

```dotenv
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
OPEN_ROUTER_API_KEY="your-openrouter-api-key"
OPEN_ROUTER_AI_MODEL="your-openrouter-model"
PORT=3001
BASE_URL="http://localhost:3001"
```

`DATABASE_URL`, `OPEN_ROUTER_API_KEY`, and `OPEN_ROUTER_AI_MODEL` are required. `PORT` defaults to `3001`, and `BASE_URL` is used as the OpenRouter HTTP referer.

3. Create the frontend environment file `.env` in the repository root:

```dotenv
VITE_API_URL="http://localhost:3001"
VITE_NEON_AUTH_URL="your-neon-auth-url"
```

4. Apply the database migrations and generate the Prisma client:

```bash
cd server
pnpm exec prisma migrate dev
pnpm exec prisma generate
cd ..
```

5. Start the frontend and API in separate terminals:

```bash
pnpm dev
```

```bash
pnpm --filter server dev:server
```

The frontend is served by Vite, usually at `http://localhost:5173`, and the API runs on `http://localhost:3001`.

## Available Scripts

From the repository root:

| Command                           | Description                           |
| --------------------------------- | ------------------------------------- |
| `pnpm dev`                        | Start the Vite development server     |
| `pnpm build`                      | Type-check and build the frontend     |
| `pnpm lint`                       | Run ESLint                            |
| `pnpm preview`                    | Preview the production frontend build |
| `pnpm --filter server dev:server` | Start the Express API with watch mode |

From `server/`:

| Command                        | Description                             |
| ------------------------------ | --------------------------------------- |
| `pnpm exec prisma migrate dev` | Create and apply development migrations |
| `pnpm exec prisma generate`    | Generate the Prisma client              |

## API Endpoints

The Express API is mounted under `/api`:

| Method | Endpoint                        | Description                               |
| ------ | ------------------------------- | ----------------------------------------- |
| `POST` | `/api/profile`                  | Create or update a user's fitness profile |
| `POST` | `/api/plan/generate`            | Generate and store a new AI training plan |
| `GET`  | `/api/plan/current?userId=<id>` | Fetch the user's latest training plan     |

## User Flow

1. The user signs in with Neon Auth.
2. The onboarding form collects training preferences and limitations.
3. The API stores the profile in PostgreSQL.
4. The server sends the profile to the configured OpenRouter model.
5. The generated JSON plan is normalized and saved with a version number.
6. The profile page displays the latest plan.

## Notes

- Do not commit `.env` files or API keys. They are ignored by Git.
- AI-generated training plans are informational and should be reviewed by a qualified professional, especially when injuries or medical conditions are involved.
- The server currently enables CORS globally for development convenience; configure it more restrictively before deploying to production.

## Credits

[PERN Full Course 2026 | React, NodeJS, Express, PostgreSQL...](https://www.youtube.com/watch?v=upo7BBbomoQ)

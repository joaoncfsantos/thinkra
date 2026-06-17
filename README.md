# Gap and Gain - Speech-to-Text Journal

A speech-to-text application that helps you record daily **gains** (what you accomplished today) and set **goals** for the next day. Record your thoughts out loud and let AI transcribe and structure them automatically.

## How It Works

- **Frontend** (`client/`) — React + Vite app. Handles authentication and all journal entry CRUD directly against Supabase.
- **Backend** (`server/`) — Express API used only for audio transcription: it receives a recording, transcribes it with OpenAI Whisper, and uses GPT to extract goals and gains.

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query
- **Backend:** Node.js, Express 5, TypeScript (run via `tsx`)
- **Auth & Database:** Supabase
- **AI:** OpenAI Whisper (transcription) + GPT (goal/gain extraction)

## Prerequisites

- Node.js (v18 or higher)
- An OpenAI API key
- A Supabase project (URL + keys)

## Setup

1. Clone the repository

   ```bash
   git clone https://github.com/joaoncfsantos/gap-and-gain.git
   cd gap-and-gain
   ```

2. Install dependencies for both client and server

   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Set up the database

   In your Supabase project, create a `daily_entries` table with the following columns and enable Row-Level Security (policies should restrict each user to their own rows via `auth.uid() = user_id`):

   | Column | Type | Notes |
   |--------|------|-------|
   | `id` | `uuid` | primary key, default `gen_random_uuid()` |
   | `user_id` | `uuid` | foreign key → `auth.users.id` |
   | `date` | `date` | |
   | `goals` | `text[]` | default `'{}'` |
   | `gains` | `text[]` | default `'{}'` |
   | `created_at` | `timestamptz` | default `now()` |
   | `updated_at` | `timestamptz` | nullable |

4. Configure environment variables

   **Server** — create `server/.env`:

   ```bash
   cd server
   cp .env.example .env
   ```

   ```env
   OPENAI_API_KEY=your_openai_api_key
   PORT=3000
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   # CORS_ORIGIN=http://localhost:5173
   ```

   **Client** — create `client/.env.local`:

   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_or_publishable_key
   VITE_API_URL=http://localhost:3000
   ```

5. Run the application

   ```bash
   # Terminal 1 - Start the server (auto-reloads on changes)
   cd server
   npm run dev

   # Terminal 2 - Start the client
   cd client
   npm run dev
   ```

6. Open your browser to `http://localhost:5173`

## Environment Variables

### Server (`server/.env`)

- `OPENAI_API_KEY` — Your OpenAI API key (required for transcription)
- `PORT` — Server port (default: `3000`)
- `VITE_SUPABASE_URL` — Your Supabase project URL (required)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key, used to verify user tokens (required)
- `CORS_ORIGIN` — Allowed origin for CORS (defaults to `http://localhost:5173`)

### Client (`client/.env.local`)

- `VITE_SUPABASE_URL` — Your Supabase project URL (required)
- `VITE_SUPABASE_ANON_KEY` — Supabase anon / publishable key (required)
- `VITE_API_URL` — Base URL of the backend server (e.g. `http://localhost:3000`)

## Available Scripts

### Server (`server/`)

- `npm run dev` — Start the server with auto-reload (`tsx watch`)
- `npm start` — Start the server without watching

### Client (`client/`)

- `npm run dev` — Start the Vite dev server
- `npm run build` — Type-check and build for production
- `npm run preview` — Preview the production build
- `npm run lint` — Run ESLint

## Security Note

⚠️ **Never commit your `.env` files!** They contain sensitive API keys. The `SUPABASE_SERVICE_ROLE_KEY` in particular bypasses Row-Level Security and must be kept secret and server-side only.

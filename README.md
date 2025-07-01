# Penny

A minimal expense tracker that helps you manage and monitor your personal spending with a clean, modern interface.

## Features

- User authentication with Kinde
- Add, view, and delete expenses
- Total spending summary
- Responsive, minimal UI with Tailwind CSS and shadcn/ui
- Type-safe API and validation with Zod and Drizzle
- PostgreSQL database schema and migrations managed with Drizzle ORM

## Tech Stack

- **Backend**: Bun, Hono, Drizzle ORM, Neon (PostgreSQL), Zod, Kinde Auth
- **Frontend**: React, Vite, TanStack Router, TanStack React Query, Tailwind CSS, shadcn/ui components
- **Database**: Neon (serverless Postgres)
- **Validation**: Zod

## Getting Started

### Prerequisites

- Bun v1.1.18 or newer
- Node.js (for some tooling, optional)
- PostgreSQL database (Neon recommended)
- Kinde account for authentication

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/ashish0kumar/penny.git
    cd penny
    ```

2. **Install dependencies**

    ```bash
    bun install
    cd frontend
    bun install
    cd ..
    ```

3. **Set up environment variables**

    Copy `.env.example` to `.env` and fill in your Neon and Kinde credentials.

    ```bash
    cp .env.example .env
    ```

4. **Run database migrations**

    ```bash
    bun migrate.ts
    ```

### Running the App

Start the backend and frontend in separate terminals:

**Backend:**

```bash
bun dev
```

**Frontend:**

```bash
cd frontend
bun run dev
```

The backend will run on `http://localhost:3000`
The frontend will run on `http://localhost:5173`

### Building for Production

**Frontend:**

```bash
cd frontend
bun run build
```

Build output is in `frontend/dist/`

**Backend:** <br>
Deploy your Bun server to a platform such as Fly.io or Railway.

## Customization

- **UI**: Built with shadcn/ui and Tailwind CSS for easy customization.
- **API**: Extend routes in `server/routes/`.
- **Database Schema**: Edit in `server/db/schema/expenses.ts` and run migrations.

## License

[MIT License](LICENSE)
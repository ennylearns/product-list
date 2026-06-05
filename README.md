# Product Catalog Platform

A lightweight e-commerce catalog that enables small businesses to showcase products online and receive orders through WhatsApp.

## Prerequisites
- Node.js 20+
- npm

## Local Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Database configuration**
   You need a Vercel Postgres database to run this project.
   - Configure your `.env.local` with the real Vercel Postgres credentials:
     ```env
     POSTGRES_URL="postgres://default:YOUR_PASSWORD@ep-YOUR-HOST.us-east-1.postgres.vercel-storage.com:5432/verceldb"
     ```

3. **Run database migrations**
   ```bash
   npx drizzle-kit push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

This project uses Vitest for testing. The tests automatically load environment variables from `.env.local`.

```bash
npx vitest run
```

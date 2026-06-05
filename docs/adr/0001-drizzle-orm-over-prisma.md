# Use Drizzle ORM over Prisma

We chose Drizzle ORM for the database layer instead of Prisma. The app deploys to Vercel with Vercel Postgres, and Drizzle's lightweight runtime (no query engine binary) gives faster serverless cold starts. It has first-class support for the `@vercel/postgres` driver, and its SQL-like TypeScript API is a natural fit for a small CRUD catalog app. Prisma would work, but the engine overhead and need for Prisma Accelerate on edge functions tipped the decision.

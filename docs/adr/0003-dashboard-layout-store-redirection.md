---
status: accepted
---
# Dashboard Layout Store Redirection

When users sign up, they must create a Store before accessing the dashboard. We decided to enforce this redirection at the Dashboard Layout component (`app/(dashboard)/layout.tsx`) rather than in Next.js Middleware (`middleware.ts`).

This avoids the complexity of querying the database in the edge runtime and manually syncing a `hasStore` flag within the JWT session token, opting instead for a simple server-side database check on dashboard page loads.

# Auth.js v5 with Credentials provider over custom auth

We chose Auth.js v5 (`next-auth@5`) with the Credentials provider for email/password authentication instead of building a custom auth layer with Server Actions + jose.

Custom auth would have been simpler for a credentials-only flow — fewer dependencies, no adapter abstractions, and direct control over session management. However, Auth.js v5 gives us `auth()` as a universal session accessor across Server Components, Server Actions, and Route Handlers, plus a well-tested JWT implementation. If we add OAuth providers later (Google, etc.), Auth.js already handles that without rearchitecting. The trade-off is ~30KB of dependencies and an abstraction layer we don't fully need today, in exchange for a standardized auth surface and future flexibility.

JWT strategy (stateless sessions, no sessions table) was chosen because the app has a single role model with no session revocation requirements.

bcryptjs (pure JS) was chosen over native bcrypt to avoid node-gyp issues on Windows and Vercel serverless.

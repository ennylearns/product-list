# Domain Modules for Server Actions

Server actions in `src/lib/actions` must act purely as HTTP/Framework adapters (handling forms, Next.js cache invalidation, and redirects) and must not contain inline business logic, authentication resolution, or database queries. We extract business capabilities into deep domain modules (like `SellerCatalog`) that internally handle authentication boundaries and database operations via factory methods like `.fromSession()`. 

We made this decision to decouple our core domain logic from Next.js server action boilerplate, avoiding repetitive auth/store-ownership checks across every action and greatly increasing the locality and testability of our domain code.

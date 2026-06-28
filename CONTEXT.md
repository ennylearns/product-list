# Product Catalog Platform

A lightweight e-commerce catalog that enables small businesses to showcase products online and receive orders through WhatsApp.

## Language

**User**:
An authentication identity — someone who has signed up with email and password.
_Avoid_: Account, member

**Store**:
A business entity owned by a User, with its own public storefront URL, product catalog, and WhatsApp contact number. Each User owns exactly one Store.
_Avoid_: Shop, business profile, business

**Seller**:
A User in the context of managing their Store — listing products, updating settings.
_Avoid_: Vendor, merchant, admin

**Customer**:
A visitor browsing a public storefront. Customers are anonymous and unauthenticated.
_Avoid_: Buyer, shopper

**Storefront**:
The public page for a Store, accessible at `domain.com/{username}`. Requires no authentication to view.
_Avoid_: Shop page, store page

**Username**:
A Store's unique, URL-safe identifier. Lowercase alphanumeric and hyphens only, 3–40 characters. Used as the storefront path segment.
_Avoid_: Slug, handle

**Product**:
An item listed for sale within a Store. Has a name, price (in minor units of the Store's currency, e.g., kobo or cents), optional description, stock status, and up to 5 media items (images or videos).
_Avoid_: Item, listing

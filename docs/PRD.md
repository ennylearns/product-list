# Product Requirements Document (PRD)

## Product Name

(Product name to be decided)

---

# 1. Overview

A lightweight e-commerce catalog platform that enables small businesses to showcase products online and receive orders directly through WhatsApp.

The platform is not a marketplace. Each business has its own storefront where customers can browse products and initiate purchases via WhatsApp.

---

# 2. Problem Statement

Many small businesses sell primarily through WhatsApp and social media but struggle to organize and present their products professionally.

Existing solutions are often too complex, expensive, or require payment integrations that these businesses do not need.

---

# 3. Goals

* Enable businesses to easily list and manage products.
* Give each business a shareable storefront.
* Allow customers to order products through WhatsApp.
* Keep the platform extremely simple and mobile-friendly.

---

# 4. Target Users

### Sellers

* Fashion vendors
* Shoe sellers
* Perfume vendors
* Food businesses
* Cosmetics sellers
* Electronics shops
* Small retailers

### Buyers

Customers visiting shared store links from WhatsApp, Instagram, Facebook, TikTok, or other channels.

---

# 5. Tech Stack

### Frontend

* Next.js

### Authentication

* NextAuth

### Database

* Vercel Postgres

### Image Storage

* Vercel Blob

### WhatsApp Integration

* OpenWA

### Deployment

* Vercel

---

# 6. Core Features

## 6.1 Authentication

Users can:

* Sign up
* Sign in
* Sign out

Supported providers:

* Email and password

---

## 6.2 Business Profile

Each user owns one store.

Fields:

* Business name
* Username (unique)
* WhatsApp number
* Business description

Example:

```
domain.com/fatimafashion
```

---

## 6.3 Product Management

Users can:

* Create products
* Edit products
* Delete products
* View all products

---

### Product Fields

#### Name

Text

Examples:

* Air Force 1
* Ankara Gown

---

#### Description

Long text

---

#### Price

Numeric value

Examples:

* ₦15,000
* ₦250,000

---

#### Images

Maximum:

* 5 images per product

Stored in:

* Vercel Blob

---

#### In Stock

Boolean toggle

Values:

* true
* false

When false:

* Product remains visible.
* Product card displays "Out of Stock".
* Ordering is disabled.

---

#### Created At

Timestamp

---

#### Updated At

Timestamp

---

# 7. Storefront

Public pages require no authentication.

Customers can:

* Browse products.
* Open product details.
* View multiple product images.
* See price.
* See stock status.

---

# 8. Product Detail Page

Displays:

* Product images
* Product name
* Description
* Price
* Stock status

If product is in stock:

Show:

```
Order on WhatsApp
```

If product is out of stock:

Show:

```
Out of Stock
```

---

# 9. WhatsApp Ordering

Integration uses OpenWA.

When a customer clicks:

```
Order on WhatsApp
```

A WhatsApp message is generated and sent to the seller.

Message format:

```
[PRODUCT IMAGE]
Hello, I am interested in this product.

Product:
Blue Ankara Gown

Price:
₦15,000

Store:
Fatima Fashion

Product Link:
https://domain.com/fatimafashion/products/123
```

The seller receives the message directly on WhatsApp.

---

# 10. Dashboard

Authenticated users have access to:

## Overview Page

Shows:

* Total products
* Products in stock
* Products out of stock

---

## Products Page

Displays:

* Product image
* Product name
* Price
* Stock status

Actions:

* Edit
* Delete

---

## Settings Page

Manage:

* Business name
* Username
* WhatsApp number
* Description
* Logo

---

# 11. Non-Goals (Version 1)

The MVP will not include:

* Payments
* Shopping cart
* Inventory quantities
* Categories
* Reviews
* Ratings
* Coupons
* Shipping calculations
* Delivery tracking
* Analytics
* Marketplace features
* Multiple stores per user
* Multi-user teams
* AI-generated descriptions

---

# 12. Success Metrics

* Users can create an account in under 2 minutes.
* Users can add a product in under 1 minute.
* Businesses can share their store link immediately.
* Customers can order products with one tap.
* Product management is simple enough for non-technical users.

---

# 13. Future Features

Version 2 may include:

* Product categories
* Search
* Analytics dashboard
* AI-generated descriptions
* Custom domains
* Inventory quantities
* Product variants
* Social media integrations
* Bulk product upload
* Multi-admin stores
* Payment support
* Delivery integrations
* Theme customization

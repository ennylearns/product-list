## Problem Statement

The platform currently hardcodes Nigerian Naira (NGN) for all store prices. Sellers who operate in different regions or wish to price their items in US Dollars (USD) are unable to select an alternative currency, forcing their storefronts to display the incorrect currency symbol.

## Solution

Allow Sellers to select their Store's currency during initial setup, with the ability to modify it later in their Store Settings. The selected currency dictates how prices are formatted (currency symbol, localization) on both the Seller Dashboard and the public Storefront. We are introducing support for `NGN` and `USD`.

## User Stories

1. As a Seller setting up my store for the first time, I want to select my preferred currency (NGN or USD), so that my storefront displays prices in the currency my customers expect.
2. As a Seller, I want to see a currency dropdown in my Store Settings, so that I can change my store's currency if my business needs change.
3. As a Seller changing my currency in Store Settings, I want to see a warning explaining that my existing prices will not be automatically converted, so that I am aware I need to manually update them.
4. As a Seller viewing my products dashboard, I want to see my product prices formatted with my store's selected currency symbol, so that I know exactly what is being displayed to customers.
5. As a Customer browsing a public storefront, I want to see the product prices formatted in the store's selected currency, so that I understand the cost of the items.

## Implementation Decisions

- **Database**: Add a `currency` column (`text`, not null, default `'NGN'`) to the `stores` table schema.
- **Domain Logic**: `SellerCatalog` will be modified to expose the `currency` property upon instantiation alongside `storeId`.
- **ADR 0005**: We will *not* automatically convert prices when the currency changes. Product prices are stored as integers (minor units like kobo or cents). Changing the currency simply changes the interpretation of these minor units. 
- **Server Actions**: `getProducts`, `setupStore`, and `updateStore` will be modified to read/write the `currency` value.
- **UI Components**: `Intl.NumberFormat` will be used dynamically with the Store's currency code across the Dashboard and Storefront to handle localization and comma formatting automatically.

## Testing Decisions

We will test this feature primarily at the **Integration Seam** using Vitest, specifically targeting the `SellerCatalog` domain module.
- We will write integration tests that create a Store with a specific currency, create products, and verify that the `SellerCatalog` retrieves the correct currency and that prices are correctly preserved as minor unit integers.
- We will test the Zod schemas (`storeSchema`) to ensure the `currency` enum (`NGN`, `USD`) correctly rejects invalid currencies.
- Good tests will focus on the public interface of `SellerCatalog` (external behavior) and not the internal SQL queries.

## Out of Scope

- Live currency conversion or automated exchange rate updates.
- Support for currencies other than NGN and USD.
- Allowing individual products within the same Store to have different currencies.

## Further Notes

If additional currencies are needed in the future, the `currency` enum in `storeSchema` and UI dropdowns can easily be expanded.

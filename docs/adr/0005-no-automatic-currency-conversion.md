# No Automatic Currency Conversion

When a Store changes its selected currency, we do not perform automatic conversion of existing product prices.

We chose this approach because maintaining live exchange rates and handling conversion logic is complex, error-prone, and can result in unwanted precision loss or unexpected pricing. Instead, product prices remain as their original integer values and are simply interpreted as the minor units (e.g., kobo, cents) of the newly selected currency. Sellers are warned about this behavior and are expected to manually update their product prices if they change their Store's currency.

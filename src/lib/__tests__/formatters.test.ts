import { describe, it, expect } from 'vitest';
import { formatPrice } from '../formatters';

describe('formatPrice', () => {
  it('formats NGN currency correctly', () => {
    // 100000 cents = 1000 NGN
    expect(formatPrice(100000, 'NGN')).toBe('₦1,000.00');
  });

  it('formats USD currency correctly', () => {
    // 100000 cents = 1000 USD
    expect(formatPrice(100000, 'USD')).toBe('$1,000.00');
  });
});

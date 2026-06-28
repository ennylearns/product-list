export function formatPrice(amountInCents: number, currency: string = 'NGN'): string {
  const locale = currency === 'NGN' ? 'en-NG' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amountInCents / 100);
}

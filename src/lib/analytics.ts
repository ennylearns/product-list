import { sendGAEvent } from '@next/third-parties/google';

/**
 * Canonical GA4 event names used across the platform.
 * Use these constants to prevent typos in event tracking.
 */
export const GA_EVENTS = {
  SIGN_UP: 'sign_up',
  STORE_CREATED: 'store_created',
  PRODUCT_ADDED: 'product_added',
  WHATSAPP_ORDER_CLICK: 'whatsapp_order_click',
} as const;

export type GAEventName = (typeof GA_EVENTS)[keyof typeof GA_EVENTS];

/** Parameter types for each event */
export type GAEventParams = {
  sign_up: { method: string };
  store_created: undefined;
  product_added: { has_images: boolean; has_description: boolean };
  whatsapp_order_click: {
    store_name: string;
    product_name: string;
    price: number;
    in_stock: boolean;
  };
};

/**
 * Type-safe wrapper around `sendGAEvent` from `@next/third-parties/google`.
 * Centralises all analytics calls so event names and parameters are consistent.
 */
export function trackEvent<T extends GAEventName>(
  name: T,
  params?: GAEventParams[T],
): void {
  sendGAEvent('event', name, params);
}

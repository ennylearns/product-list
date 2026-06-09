'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackEvent, GA_EVENTS, type GAEventName } from '@/src/lib/analytics';

/** Set of valid event names for fast lookup */
const VALID_EVENTS = new Set<string>(Object.values(GA_EVENTS));

/**
 * Reads `?event=` (and optional params) from the URL on mount,
 * fires the corresponding GA4 event, then strips the analytics
 * query params from the URL bar to prevent re-firing on refresh.
 *
 * Mounted once in the root layout.
 */
export function AnalyticsEventEmitter() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const eventName = searchParams.get('event');
    if (!eventName || !VALID_EVENTS.has(eventName)) return;

    const params = buildParams(eventName as GAEventName, searchParams);
    trackEvent(eventName as GAEventName, params as any);

    // Remove analytics params from URL without triggering navigation
    const url = new URL(window.location.href);
    url.searchParams.delete('event');
    url.searchParams.delete('has_images');
    url.searchParams.delete('has_description');
    window.history.replaceState({}, '', url.pathname + url.search);
  }, [searchParams]);

  return null;
}

function buildParams(
  event: GAEventName,
  searchParams: URLSearchParams,
): Record<string, unknown> | undefined {
  switch (event) {
    case GA_EVENTS.SIGN_UP:
      return { method: 'credentials' };
    case GA_EVENTS.PRODUCT_ADDED:
      return {
        has_images: searchParams.get('has_images') === 'true',
        has_description: searchParams.get('has_description') === 'true',
      };
    case GA_EVENTS.STORE_CREATED:
    case GA_EVENTS.WHATSAPP_ORDER_CLICK:
    default:
      return undefined;
  }
}

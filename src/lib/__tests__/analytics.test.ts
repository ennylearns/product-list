import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @next/third-parties/google
vi.mock('@next/third-parties/google', () => ({
  sendGAEvent: vi.fn(),
}));

import { trackEvent, GA_EVENTS } from '../analytics';
import { sendGAEvent } from '@next/third-parties/google';

describe('Analytics utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GA_EVENTS', () => {
    it('should define all expected event names', () => {
      expect(GA_EVENTS.SIGN_UP).toBe('sign_up');
      expect(GA_EVENTS.STORE_CREATED).toBe('store_created');
      expect(GA_EVENTS.PRODUCT_ADDED).toBe('product_added');
      expect(GA_EVENTS.WHATSAPP_ORDER_CLICK).toBe('whatsapp_order_click');
    });
  });

  describe('trackEvent', () => {
    it('should delegate to sendGAEvent with correct arguments', () => {
      trackEvent(GA_EVENTS.SIGN_UP, { method: 'credentials' });

      expect(sendGAEvent).toHaveBeenCalledWith('event', 'sign_up', { method: 'credentials' });
    });

    it('should pass empty params when none provided', () => {
      trackEvent(GA_EVENTS.STORE_CREATED);

      expect(sendGAEvent).toHaveBeenCalledWith('event', 'store_created', undefined);
    });

    it('should pass product_added event with boolean params', () => {
      trackEvent(GA_EVENTS.PRODUCT_ADDED, { has_images: true, has_description: false });

      expect(sendGAEvent).toHaveBeenCalledWith('event', 'product_added', {
        has_images: true,
        has_description: false,
      });
    });

    it('should pass whatsapp_order_click event with all params', () => {
      trackEvent(GA_EVENTS.WHATSAPP_ORDER_CLICK, {
        store_name: 'Test Store',
        product_name: 'Cool Sneaker',
        price: 15050,
        in_stock: true,
      });

      expect(sendGAEvent).toHaveBeenCalledWith('event', 'whatsapp_order_click', {
        store_name: 'Test Store',
        product_name: 'Cool Sneaker',
        price: 15050,
        in_stock: true,
      });
    });
  });
});

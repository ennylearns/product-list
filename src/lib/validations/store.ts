import { z } from 'zod';

export const storeSchema = z.object({
  name: z.string().min(1, 'Store name is required').max(100, 'Store name is too long'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
  whatsappNumber: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, 'WhatsApp number must be in valid international E.164 format (e.g., +234...)'),
  description: z.string().max(500, 'Description is too long').optional().nullable(),
});

export type StoreInput = z.infer<typeof storeSchema>;

import * as z from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required.').trim(),
  description: z.string().trim().optional(),
  price: z.coerce.number().positive('Price must be a positive number.'),
});

export type ProductFormState =
  | {
      errors?: {
        name?: string[];
        description?: string[];
        price?: string[];
      };
      message?: string;
    }
  | undefined;

import * as z from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required.').trim(),
  description: z.string().trim().optional(),
  price: z.coerce.number().positive('Price must be a positive number.'),
  images: z.array(z.string().url()).max(5, 'You can upload a maximum of 5 images.').optional(),
});

export type ProductFormState =
  | {
      errors?: {
        name?: string[];
        description?: string[];
        price?: string[];
        images?: string[];
      };
      message?: string;
    }
  | undefined;

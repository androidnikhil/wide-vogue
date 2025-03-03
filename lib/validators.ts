import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
  .string()
  .refine(
    (val) => /^\d+(\.\d{2})?₹/.test(formatNumberWithDecimal(Number(val))),
    "Price must have exactly two decimal place"
  );

export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be have at least 3 characters").max(255),
  slug: z.string().min(3, "Slug must be have at least 3 characters").max(255),
  category: z
    .string()
    .min(3, "Category must be have at least 3 characters")
    .max(255),
  brand: z.string().min(3, "Brand must be have at least 3 characters").max(255),
  description: z
    .string()
    .min(3, "Description must be have at least 3 characters"),
  stock: z.coerce.number().int().min(0, "Stock must be a positive number"),
  images: z.array(
    z.string().url().min(1, "Product should have at least 1 image")
  ),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

export const signInFormSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})
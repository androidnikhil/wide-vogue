import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
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
    z.string().min(1, "Product should have at least 1 image")
  ),
  sizes: z.array(z.string()).default([]),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
  originalPrice: currency,
  discountPercent: z.coerce.number().int().min(0).max(100).default(0),
  isReturnable: z.boolean().default(false),
  returnWindowDays: z.coerce.number().int().min(0).default(0),
  returnPolicyText: z.string().nullable().optional(),
});

// Schema for updating products
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, 'Id is required').optional(),
});

export const signInFormSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Schema for signing up a user
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Cart Schemas
export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  qty: z.number().int().positive('Quantity must be at least 1'),
  image: z.string().min(1, 'Image is required'),
  price: currency,
  size: z.string().optional(),
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  couponCode: z.string().optional().nullable(),
  discountPrice: currency.optional().nullable(),
  giftCardCode: z.string().optional().nullable(),
  giftCardAmount: currency.optional().nullable(),
  isGiftWrapped: z.boolean().optional(),
  pointsToRedeem: z.number().int().min(0).optional().nullable(),
  sessionCartId: z.string().min(1, 'Session cart id is required'),
  userId: z.string().optional().nullable(),
});

// Schema for shipping address (SPAM PROTECTED)
export const shippingAddressSchema = z.object({
  fullName: z.string()
    .min(3, 'Full name must be at least 3 characters')
    .max(50, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain alphabets and spaces'),
  streetAddress: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(255, 'Address is too long')
    .regex(/^[^<>{}]+$/, 'Address contains invalid characters (no HTML tags)'),
  city: z.string()
    .min(3, 'City must be at least 3 characters')
    .max(50, 'City name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'City can only contain alphabets'),
  state: z.string()
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'State can only contain alphabets'),
  postalCode: z.string()
    .length(6, 'Postal code must be exactly 6 digits')
    .regex(/^\d+$/, 'Postal code can only contain numbers'),
  contactNumber: z.string()
    .length(10, 'Contact number must be exactly 10 digits')
    .regex(/^[6-9]\d{9}$/, 'Must be a valid Indian mobile number'),
  country: z.string()
    .min(2, 'Country must be at least 2 characters')
    .max(50, 'Country name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Country can only contain alphabets'),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  guestEmail: z.string().email('Invalid email address').optional().nullable(),
})

// Schema for payment method
export const paymentMethodSchema = z.object({
  type: z.string().min(1, 'Payment method is required'),
}).refine((data) => PAYMENT_METHODS.includes(data.type), {
  path: ['type'],
  message: 'Invalid payment method',
})

// Schema for inserting order
export const insertOrderSchema = z.object({
  userId: z.string().optional().nullable(),
  guestEmail: z.string().optional().nullable(),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  couponCode: z.string().optional().nullable(),
  discountPrice: currency.optional().nullable(),
  giftCardCode: z.string().optional().nullable(),
  giftCardAmount: currency.optional().nullable(),
  pointsEarned: z.number().int().min(0).default(0),
  pointsRedeemed: z.number().int().min(0).default(0),
  isGiftWrapped: z.boolean().optional(),
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: 'Invalid payment method',
  }),
  shippingAddress: shippingAddressSchema,
});

// Schema for inserting an order item
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number(),
});

// Schema for the PayPal paymentResult
export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

// Schema for updating the user profile
export const updateProfileSchema = z.object({
  name: z.string().min(3, 'Name must be at leaast 3 characters'),
  email: z.string().min(3, 'Email must be at leaast 3 characters'),
});

// Schema to update users
export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, 'ID is required'),
  role: z.string().min(1, 'Role is required'),
});

// Schema to insert reviews
export const insertReviewSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  productId: z.string().min(1, 'Product is required'),
  userId: z.string().min(1, 'User is required'),
  rating: z.coerce
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
});

// Schema for generating a Gift Card
export const insertGiftCardSchema = z.object({
  initialValue: currency,
  expiresAt: z.date().optional().nullable(),
});
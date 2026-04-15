import { strict } from 'assert/strict';
import { z } from 'zod';
const TN_STATES = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba",
  "Kairouan", "Kasserine", "Kébili", "Kef", "Mahdia", "Manouba", "Médenine",
  "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse",
  "Tataouine", "Tozeur", "Tunis", "Zaghouan",
];
export const CartItemSchema = z.object({
  id: z.number().int().positive(),
  variationId: z.number().int().positive().optional(),
  quantity: z.number().int().min(1, "Minimum 1 article").max(20, "Maximum 20 articles par ligne"),
}).strict();
export const CartItemsSchema = z.array(CartItemSchema).min(1, "Votre panier est vide");
export const CheckoutFormSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email format"),

  first_name: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50)
    .regex(/^[a-zA-Z\s'-]+$/, "Invalid first name"),

  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50)
    .regex(/^[a-zA-Z\s'-]+$/, "Invalid last name"),

  phone: z
    .string()
    .trim()
    .regex(/^\+216[0-9]{8}$/, "Phone must be +216XXXXXXXX"),

  address_1: z
    .string()
    .trim()
    .min(5)
    .max(200),

  address_2: z
    .string()
    .trim()
    .max(200)
    .optional(),

  city: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Z\s'-]+$/),

  state: z
    .string()
    .refine((val) => TN_STATES.includes(val), {
      message: `Invalid state`
    }),

  postcode: z
    .string()
    .trim()
    .regex(/^[0-9]{4,5}$/)
    .optional(),

  payment_method: z
    .string()
    .refine((val) => ["cod", "clictopay", "pay_sur_place"].includes(val)),

  notes: z
    .string()
    .trim()
    .max(500)
    .optional(),

  coupon: z
    .string()
    .trim()
    .toUpperCase()
    .max(20)
    .regex(/^[A-Z0-9]*$/)
    .nullable() // Allows null
    .optional() // Allows undefined
    .or(z.literal("")), // Allows ""
  items: CartItemsSchema,
}).strict();

export const PromoCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .max(20)
    .regex(/^[A-Z0-9]+$/),
}).strict();

export const CouponSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .max(20)
    .regex(/^[A-Z0-9]+$/),
}).strict();
export const CustomerInfoSchema = z.object({
  id: z.number().int().positive(),

  first_name: z.string().trim().max(50).optional(),
  last_name: z.string().trim().max(50).optional(),

  email: z.string().trim().toLowerCase().email().optional(),

  phone: z.string().trim().regex(/^\+216[0-9]{8}$/).optional(),

  address_1: z.string().trim().max(200).optional(),

  city: z.string().trim().max(50).optional(),
}).strict();


export type CheckoutForm = z.infer<typeof CheckoutFormSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
export type PromoCode = z.infer<typeof PromoCodeSchema>;
export type Coupon = z.infer<typeof CouponSchema>;
export type CustomerInfo = z.infer<typeof CustomerInfoSchema>;
export function validate<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      data: null,
      errors: result.error.flatten(),
    };
  }

  return {
    success: true,
    data: result.data,
    errors: null,
  };
}
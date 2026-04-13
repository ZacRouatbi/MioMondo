/**
 * FIXED: Cart WooCommerce Utilities
 * 
 * DROP LOCATION: lib/wc-cart-utils.ts
 * 
 * SECURITY FIXES:
 * ✓ Server-side cart validation
 * ✓ Price recalculation from WooCommerce
 * ✓ Inventory verification
 * ✓ Coupon validation
 */

const WC_URL = process.env.WC_URL!;
const WC_KEY = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;

const wcAuth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");

export interface CartItemForValidation {
  id: number;
  variationId?: number;
  quantity: number;
}

export interface ValidatedCartItem extends CartItemForValidation {
  price: number;
  regularPrice: number;
  salePrice: number | null;
  name: string;
  sku: string;
  stock_status: "instock" | "outofstock" | "onbackorder";
}

export interface CartValidationResult {
  valid: boolean;
  items: ValidatedCartItem[];
  subtotal: number;
  errors: string[];
}

/**
 * Fetch and validate cart items from WooCommerce
 * Ensures items exist, are in stock, and get current prices
 */
export async function validateCartItems(
  items: CartItemForValidation[]
): Promise<CartValidationResult> {
  const errors: string[] = [];
  const validatedItems: ValidatedCartItem[] = [];
  let subtotal = 0;

  try {
    // Fetch all product IDs in parallel
    const productIds = [...new Set(items.map(i => i.id))];
    
    if (productIds.length === 0) {
      return {
        valid: false,
        items: [],
        subtotal: 0,
        errors: ["Cart is empty"],
      };
    }

    // Fetch products from WooCommerce
    const includeParam = productIds.map(id => `include[]=${id}`).join("&");
    const productsResponse = await fetch(
      `${WC_URL}/wp-json/wc/v3/products?${includeParam}&per_page=${productIds.length}`,
      {
        headers: { Authorization: `Basic ${wcAuth}` },
        next: { revalidate: 0 },
      }
    );

    if (!productsResponse.ok) {
      return {
        valid: false,
        items: [],
        subtotal: 0,
        errors: ["Failed to fetch product information from WooCommerce"],
      };
    }

    const products = await productsResponse.json() as any[];
    const productMap = new Map(products.map(p => [p.id, p]));

    // Validate each cart item
    for (const item of items) {
      const product = productMap.get(item.id);

      if (!product) {
        errors.push(`Product ${item.id} not found`);
        continue;
      }

      // Check if item is in stock
      if (product.stock_status !== "instock") {
        errors.push(`Product "${product.name}" is out of stock`);
        continue;
      }

      // Validate quantity
      if (item.quantity <= 0 || item.quantity > 1000) {
        errors.push(`Invalid quantity for product "${product.name}"`);
        continue;
      }

      // Get price (use sale price if available)
      const price = parseFloat(product.sale_price || product.price || "0");
      if (isNaN(price) || price <= 0) {
        errors.push(`Invalid price for product "${product.name}"`);
        continue;
      }

      const regularPrice = parseFloat(product.regular_price || product.price || "0");
      const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;

      validatedItems.push({
        id: item.id,
        variationId: item.variationId,
        quantity: item.quantity,
        price,
        regularPrice,
        salePrice,
        name: product.name,
        sku: product.sku,
        stock_status: product.stock_status,
      });

      subtotal += price * item.quantity;
    }

    return {
      valid: errors.length === 0,
      items: validatedItems,
      subtotal,
      errors,
    };
  } catch (error) {
    console.error("[validateCartItems]", error);
    return {
      valid: false,
      items: [],
      subtotal: 0,
      errors: ["Error validating cart items"],
    };
  }
}

/**
 * Validate coupon code before adding to order
 */
export async function validateCoupon(code: string) {
  try {
    if (!code || code.length > 20) {
      return { valid: false, message: "Invalid coupon code" };
    }

    const response = await fetch(
      `${WC_URL}/wp-json/wc/v3/coupons?code=${encodeURIComponent(code.trim())}`,
      {
        headers: { Authorization: `Basic ${wcAuth}` },
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      return { valid: false, message: "Invalid coupon code" };
    }

    const coupons = await response.json() as any[];

    if (!Array.isArray(coupons) || coupons.length === 0) {
      return { valid: false, message: "Invalid coupon code" };
    }

    const coupon = coupons[0];

    // Check if coupon is expired
    if (coupon.date_expires && new Date(coupon.date_expires) < new Date()) {
      return { valid: false, message: "This coupon has expired" };
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return { valid: false, message: "This coupon has reached its usage limit" };
    }

    // Only allow percent discounts for now
    if (coupon.discount_type !== "percent") {
      return {
        valid: false,
        message: "This coupon type is not supported online",
      };
    }

    return {
      valid: true,
      code: coupon.code,
      discount_type: coupon.discount_type,
      amount: parseFloat(coupon.amount),
    };
  } catch (error) {
    console.error("[validateCoupon]", error);
    return { valid: false, message: "Error validating coupon" };
  }
}

/**
 * Calculate order totals with shipping
 */
export function calculateOrderTotals(
  subtotal: number,
  discountPercent: number = 0,
  FREE_SHIPPING_THRESHOLD: number = 300,
  SHIPPING_RATE: number = 15
) {
  const discount = Math.round((subtotal * discountPercent) / 100);
  const afterDiscount = subtotal - discount;
  const shipping = afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE;
  const total = afterDiscount + shipping;

  return {
    subtotal,
    discount,
    shipping,
    total,
    afterDiscount,
  };
}

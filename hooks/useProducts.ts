import type { Product } from "@/types/product";
import type { CartItem } from "@/types/cart";
export function productToCartItem(
  product: Product,
  quantity = 1,
  variant?: string,
  variationId?: number
): CartItem {
  return {
    id: product.id,
    variationId,
    name: product.name,
    slug: product.slug,
    category: product.categories?.[0]?.name ?? "",
    price: parseFloat(product.price) || 0,
    regularPrice: parseFloat(product.regular_price) || 0,
    salePrice: product.sale_price ? parseFloat(product.sale_price) : null,
    onSale: product.on_sale,
    quantity,
    image: product.image,   // already string | null — no transform needed
    variant,
    sku: product.sku,
  };
}

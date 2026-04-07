export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  price_html: string;
  stock_status: "instock" | "outofstock" | "onbackorder";
  sku: string;
  image: string | null; 
  categories: { id: number; name: string; slug: string }[];
  short_description: string;
  on_sale: boolean;
  featured: boolean;
}
export interface CategoryImage {
  src: string;
  alt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number; // parent category ID (0 if no parent)
  count?: number; // Number of products in category
  description?: string;
  image: CategoryImage | null;
}

// This helps your API route understand what WP is sending back
 export type WCRawProduct = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  price_html: string;
  on_sale: boolean;
  featured: boolean;
  short_description: string;
  stock_status: "instock" | "outofstock" | "onbackorder";
  images: { id: number; src: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
};
export interface Props {
  product: Product;
  inCart?: boolean;
  onAddToCart?: () => void;
  variant?: "default" | "light";
}
export type SortOption =
  | "menu_order"
  | "popularity"
  | "date"
  | "price"
  | "price-desc";

export interface ProductFilters {
  /** selected category IDs — includes subcategory IDs automatically */
  categoryIds: number[];
  minPrice?: number;
  maxPrice?: number;
  onSaleOnly: boolean;
  inStockOnly: boolean;
  sortBy: SortOption;
  search: string;
}

export interface CategoryNode extends Category {
  children: CategoryNode[];
}
export interface GetProductsParams {
  category?: string;   // single WC category ID
  per_page?: number;
  page?: number;
  orderby?: string;
  order?: "asc" | "desc";
  on_sale?: boolean;
  stock_status?: string;
  min_price?: string;
  max_price?: string;
  search?: string;
}
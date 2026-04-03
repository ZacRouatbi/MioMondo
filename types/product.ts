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
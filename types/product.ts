export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  images: { src: string; alt: string }[];
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
export interface WooCommerceCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: string;
  image: {
    id: number;
    date_created: string;
    src: string;
    name: string;
    alt: string;
  } | null;
  menu_order: number;
  count: number;
}
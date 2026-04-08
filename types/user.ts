 export interface UserDropdownProps {
  user: { email: string; name?: string };
  onLogout: () => void;
}
export interface CustomerInfo {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  billing?: {
    phone?: string;
    address_1?: string;
    city?: string;
  };
}

export interface Order {
  id: number;
  number: string;
  status: string;
  date_created: string;
  total: string;
  currency: string;
  line_items: Array<{
    product_id: number;
    name: string;
    quantity: number;
    price: string;
  }>;
}

export interface WishlistItem {
  product_id: number;
  name: string;
  price: string;
  image: string;
}


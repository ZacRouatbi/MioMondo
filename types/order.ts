interface Order {
  id: number;
  number: string;
  status: string;
  date_created: string;
  total: string;
  line_items: { name: string; image?: { src: string }; quantity: number }[];
}
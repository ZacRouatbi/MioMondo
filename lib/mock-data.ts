import { Product, Category } from "@/types/product";

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Home Decor",            slug: "home-decor",            count: 48, image: { src: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=500&q=80", alt: "Home Decor" } },
  { id: 2, name: "Kitchen Essentials",    slug: "kitchen-essentials",    count: 32, image: { src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80", alt: "Kitchen" } },
  { id: 3, name: "Lifestyle Accessories", slug: "lifestyle-accessories", count: 27, image: { src: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=500&q=80", alt: "Lifestyle" } },
  { id: 4, name: "Gifts",                 slug: "gifts",                 count: 19, image: { src: "https://plus.unsplash.com/premium_photo-1670371134797-35dacfaf9dd4?q=80&w=702&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Gifts" } },
];

export const MOCK_BESTSELLERS: Product[] = [
  { id: 1, name: "Ceramic Vase",    slug: "ceramic-vase",    price: "49",  regular_price: "49",  sale_price: "",   on_sale: false, featured: true,  categories: [{ id:1, name:"Home Decor", slug:"home-decor" }], short_description: "", images: [{ src: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&q=80", alt: "Ceramic Vase" }] },
  { id: 2, name: "Scented Candle",  slug: "scented-candle",  price: "21",  regular_price: "21",  sale_price: "",   on_sale: false, featured: true,  categories: [{ id:3, name:"Lifestyle", slug:"lifestyle" }],  short_description: "", images: [{ src: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=600&q=80", alt: "Scented Candle" }] },
  { id: 3, name: "Marbled Dame",    slug: "marbled-dame",    price: "36",  regular_price: "45",  sale_price: "36", on_sale: true,  featured: true,  categories: [{ id:1, name:"Home Decor", slug:"home-decor" }], short_description: "", images: [{ src: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80", alt: "Marbled Dame" }] },
  { id: 4, name: "Marble Stand",    slug: "marble-stand",    price: "32",  regular_price: "32",  sale_price: "",   on_sale: false, featured: true,  categories: [{ id:2, name:"Kitchen",    slug:"kitchen" }],    short_description: "", images: [{ src: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=600&q=80", alt: "Marble Stand" }] },
  { id: 5, name: "Linen Cushion",   slug: "linen-cushion",   price: "45",  regular_price: "45",  sale_price: "",   on_sale: false, featured: false, categories: [{ id:1, name:"Home Decor", slug:"home-decor" }], short_description: "", images: [{ src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80", alt: "Linen Cushion" }] },
  { id: 6, name: "Copper Lantern",  slug: "copper-lantern",  price: "78",  regular_price: "95",  sale_price: "78", on_sale: true,  featured: false, categories: [{ id:1, name:"Home Decor", slug:"home-decor" }], short_description: "", images: [{ src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80", alt: "Copper Lantern" }] },
  { id: 7, name: "Jasmine Candle",  slug: "jasmine-candle",  price: "28",  regular_price: "28",  sale_price: "",   on_sale: false, featured: false, categories: [{ id:3, name:"Lifestyle", slug:"lifestyle" }],  short_description: "", images: [{ src: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80", alt: "Jasmine Candle" }] },
  { id: 8, name: "Wicker Basket",   slug: "wicker-basket",   price: "55",  regular_price: "55",  sale_price: "",   on_sale: false, featured: false, categories: [{ id:1, name:"Home Decor", slug:"home-decor" }], short_description: "", images: [{ src: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80", alt: "Wicker Basket" }] },
];

export const MOCK_NEW_ARRIVALS: Product[] = MOCK_BESTSELLERS.slice(4);

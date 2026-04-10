# MioMondo - Headless E-Commerce Platform 🛍️

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.1-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.4-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind%20CSS-4-38b2ac?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, performant e-commerce platform built with **Next.js 16 + React 19** frontend and **WordPress + WooCommerce** headless backend. Deployed on **Vercel** and **OVH**.

---

## 🎯 Project Overview

MioMondo is a full-stack e-commerce solution that separates concerns between a headless CMS backend and a performant React frontend. The architecture ensures:

- **Secure API**: All sensitive credentials and operations handled server-side
- **Performance**: Server-side rendering, incremental static regeneration, and optimized caching
- **Scalability**: Headless architecture allows independent frontend/backend scaling
- **Modern Stack**: Latest versions of Next.js, React, and TypeScript

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│          Frontend: Next.js 16 (Vercel)                  │
│  • React 19 Components                                  │
│  • TanStack Query for data fetching                     │
│  • Framer Motion for animations                         │
│  • Tailwind CSS 4 for styling                           │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTPS
                   ↓
┌─────────────────────────────────────────────────────────┐
│     Next.js API Routes (Vercel Functions)               │
│  • WooCommerce REST API proxy                           │
│  • Authentication & session management                  │
│  • Order & cart processing                              │
│  • Payment gateway integration                          │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTPS
                   ↓
┌─────────────────────────────────────────────────────────┐
│   Backend: WordPress + WooCommerce (OVH Web Hosting)    │
│  • MySQL Database                                       │
│  • REST API (v3)                                        │
│  • Payment plugins (Konnect, COD)                       │
│  • WooCommerce ecosystem                                │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 🛒 E-Commerce Core
- ✅ **Product Catalog** - Browse products with filtering & search
- ✅ **Shopping Cart** - Persistent cart with localStorage & real-time updates
- ✅ **Checkout** - Multi-step checkout with shipping & billing
- ✅ **Order Management** - View order history and status tracking
- ✅ **Wishlist** - Save favorite products for later
- ✅ **Promo Codes** - Apply discount codes at checkout

### 👤 User Management
- ✅ **Authentication** - Sign up, login, logout with secure tokens
- ✅ **Account Dashboard** - Manage profile, orders, and wishlist
- ✅ **Password Management** - Change password with validation
- ✅ **Order History** - Track all past orders and details

### 💳 Payment Integration
- ✅ **Konnect** - Direct payment gateway integration
- ✅ **Cash on Delivery (COD)** - Traditional payment method
- ✅ **Secure Processing** - Server-side payment handling

### 🎨 Frontend Excellence
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Dark/Light Support** - Beautiful theme switching
- ✅ **Animations** - Smooth transitions with Framer Motion
- ✅ **Loading States** - Skeleton screens for better UX
- ✅ **Error Handling** - Graceful error states with feedback

### 🚀 Performance
- ✅ **Server-Side Rendering** - Better SEO and faster initial load
- ✅ **Static Generation** - ISR for frequently accessed pages
- ✅ **Query Caching** - TanStack Query for optimal data fetching
- ✅ **Image Optimization** - Next.js Image component usage
- ✅ **Code Splitting** - Automatic route-based splitting

### 🔒 Security
- ✅ **Secure API Keys** - Environment variables for credentials
- ✅ **Server-Side Proxies** - Never expose backend URLs to client
- ✅ **CORS Headers** - Properly configured cross-origin requests
- ✅ **Session Tokens** - Secure cookie-based authentication
- ✅ **PCI Compliance** - No raw card data handling

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.2.1 | React framework with SSR/SSG |
| **React** | 19.2.4 | UI components & state management |
| **TypeScript** | 5 | Type safety |
| **Tailwind CSS** | 4 | Utility-first styling |
| **TanStack Query** | 5.96.2 | Server state management |
| **Framer Motion** | 12.38.0 | Animation library |
| **Embla Carousel** | 8.6.0 | Carousel component |
| **Lucide React** | Latest | Icon library |

### Backend
| Technology | Purpose |
|-----------|---------|
| **WordPress** | Headless CMS |
| **WooCommerce** | E-commerce platform |
| **MySQL** | Database |
| **PHP** | Backend logic |

### Infrastructure
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting & functions |
| **OVH Web Hosting** | WordPress backend |
| **MySQL (OVH)** | Database hosting |

---

## 📦 Project Structure

```
MioMondo/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── cart/                # Cart operations
│   │   ├── checkout/            # Order placement
│   │   ├── products/            # Product endpoints
│   │   └── account/             # User account operations
│   ├── (shop)/                  # Shop layout
│   │   └── products/            # Product pages
│   ├── cart/                    # Cart page
│   ├── checkout/                # Checkout flow
│   ├── account/                 # Account dashboard
│   ├── collections/             # Category pages
│   ├── about/                   # About page
│   ├── page.tsx                # Homepage
│   ├── layout.tsx              # Root layout
│   └── providers.tsx           # React providers
│
├── components/                   # Reusable components
│   ├── layout/                  # Header, footer, navbar
│   ├── product/                 # Product display
│   ├── shop/                    # Shop filters, grid
│   ├── checkout/                # Checkout components
│   ├── account/                 # Account components
│   ├── cart/                    # Cart context & components
│   └── ui/                      # Shared UI elements
│
├── hooks/                        # Custom React hooks
│   ├── useProducts.ts          # Product data fetching
│   ├── useCart.ts              # Cart state management
│   ├── useAuth.ts              # Authentication
│   ├── useAccount.ts           # Account operations
│   └── ...                     # Other hooks
│
├── types/                        # TypeScript types
│   ├── product.ts              # Product types
│   ├── cart.ts                 # Cart types
│   ├── user.ts                 # User types
│   ├── order.ts                # Order types
│   └── ...                     # Other types
│
├── public/                       # Static assets
│   └── images/                 # Product images
│
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm/yarn
- **Git** for version control
- WooCommerce backend with REST API enabled
- Environment variables configured

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/MioMondo.git
cd MioMondo

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Configure your environment variables:
# NEXT_PUBLIC_WC_URL=https://your-woocommerce-site.com
# WC_KEY=your-rest-api-key
# WC_SECRET=your-rest-api-secret
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start

# Or deploy directly to Vercel
vercel deploy --prod
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root:

```env
# WooCommerce API Configuration
WC_URL=https://your-woocommerce-site.com
WC_KEY=your_rest_api_consumer_key
WC_SECRET=your_rest_api_consumer_secret

# Frontend (if needed)
NEXT_PUBLIC_SITE_URL=https://miomondo.com
```

---

## 📚 API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/[slug]` - Get single product
- `GET /api/products/search` - Search products
- `GET /api/bestsellers` - Get bestselling products
- `GET /api/categories` - Get categories

### Cart & Checkout
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Create order from cart
- `DELETE /api/cart` - Cancel order
- `POST /api/cart/promo` - Apply promo code
- `POST /api/checkout/place-order` - Place order

### Account
- `GET /api/account/informations` - Get user info
- `PUT /api/account/informations` - Update user info
- `GET /api/account/orders` - Get user orders
- `GET /api/account/wishlist` - Get wishlist
- `DELETE /api/account/wishlist` - Remove from wishlist
- `POST /api/account/password` - Change password

---

## 🎨 Design System

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| **Jet (Dark)** | `#1a1a1a` | Primary text, buttons |
| **Snow (White)** | `#fafafa` | Backgrounds, cards |
| **Lavender** | `#e6e6fa` | Borders, light backgrounds |
| **Gold** | `#ffca68` | Accents, highlights |

### Typography
- **Display Font**: Playfair Display (headings)
- **Body Font**: System stack (clean, modern)
- **Weights**: 400 (regular), 500 (medium), 700 (bold)

---

## 🧪 Development Practices

### Code Organization
- ✅ Type-safe components with TypeScript
- ✅ Server-side data fetching in API routes
- ✅ Custom hooks for reusable logic
- ✅ Atomic component structure
- ✅ Clear separation of concerns

### Performance Optimization
- ✅ Image optimization with next/image
- ✅ Code splitting by route
- ✅ CSS-in-JS with Tailwind (optimized)
- ✅ Query caching with TanStack Query
- ✅ Lazy loading for components

### Security Best Practices
- ✅ Environment variables for secrets
- ✅ Server-side API proxying
- ✅ HTTPS only communication
- ✅ CORS configuration
- ✅ Input validation & sanitization

---

## 📝 Customization

### Adding New Products
1. Add products via WooCommerce admin
2. Products auto-sync via REST API
3. Images must be attached to products

### Customizing Styles
```tsx
// Edit tailwind.config.ts for design tokens
// Edit COLOR_PALETTE.md for reference
// Components use Tailwind classes (no CSS files)
```

### Extending Functionality
1. Create new hooks in `/hooks`
2. Add API routes in `/app/api`
3. Build components in `/components`
4. Update types in `/types`

---

## 🐛 Troubleshooting

### Issues

**Cart items disappearing**
- Ensure localStorage is enabled
- Check browser console for errors
- Clear cache and reload

**Products not loading**
- Verify WooCommerce REST API is accessible
- Check environment variables
- Test API endpoint directly

**Payment failures**
- Verify Konnect/gateway credentials
- Check order validation
- Review server logs

---

## 📄 License

This project is licensed under the **MIT License** - see LICENSE file for details.

---

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support & Contact

For questions or support:
- 📧 Email: support@miomondo.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/MioMondo/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/MioMondo/discussions)

---

## 🙏 Acknowledgments

- **WooCommerce** for e-commerce platform
- **Next.js** for powerful React framework
- **Tailwind CSS** for utility-first styling
- **TanStack Query** for data management
- **Vercel** for hosting & deployment

---

<div align="center">

**Made with ❤️ by the Brandbox Agency**

[⬆ Back to Top](#miomondo---headless-e-commerce-platform-)

</div>

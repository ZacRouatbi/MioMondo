# Headless WordPress + Next.js Ecommerce Setup

## Overview

This project implements a **headless WordPress + WooCommerce backend** on OVH with a **Next.js frontend** deployed on Vercel.  
The frontend fetches all dynamic data via **server-side API routes**, keeping all sensitive credentials secure.

---

## Architecture

- **Backend:** WordPress + WooCommerce (PHP) on OVH Web Hosting
- **Database:** MySQL (OVH)
- **Frontend:** Next.js (React + Node.js) on Vercel
- **Data Fetching:** WordPress REST API or GraphQL via Next.js API Routes
- **Security:** API keys stored in `.env` files; all sensitive requests handled server-side

---

## Features

- Headless architecture for full UI flexibility
- Secure fetching of products, orders, and user data
- WooCommerce checkout integration via server-side proxy
- Optional caching / incremental static regeneration (ISR) for speed
- Fully deployable on OVH + Vercel infrastructure

---


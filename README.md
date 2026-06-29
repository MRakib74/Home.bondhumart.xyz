# BondhuOS Command Center (Admin Dashboard)

## 📌 Project Overview
This is the central command center (admin dashboard) for the **Bondhumart** e-commerce platform. It is designed to run alongside the `bondhumart-frontend` storefront. While the frontend handles customer orders, this command center is responsible for dynamically managing all aspects of the business.

## 🏗 Architecture & Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database ORM:** Prisma
- **Database Engine:** PostgreSQL (Shared with `bondhumart-frontend`)
- **Port:** Runs on **`3001`** (to avoid conflicts with the frontend running on `3000`).

## ⚙️ Core Modules (src/app/)
1. **Ads & Analytics (`/ads`)**: Track advertising performance.
2. **AI Training (`/ai-training`)**: Train the AI models for customer interactions.
3. **Broadcast & Logs (`/broadcast`, `/broadcast-logs`)**: Manage WhatsApp/SMS broadcast campaigns and view logs.
4. **Chat (`/chat`)**: AI Chat logs and customer conversations.
5. **Courier Management (`/courier`)**: Handle courier bookings (Steadfast, Pathao, RedX).
6. **Customer Management (`/customers`)**: View customer data, dynamic columns, and lifetime value.
7. **Order Management (`/orders`)**: Process, confirm, and track orders.
8. **Invoice Builder (`/invoice-builder`)**: Generate invoices for orders.
9. **Website Management (`/website-management`)**: Manage categories, products, landing pages, and storefront design dynamically.
10. **Knowledge Base (`/knowledge`)**: Manage KB articles.
11. **Settings (`/settings`)**: Global store configurations.

## 🗄️ Database & Prisma Schema
This project uses a PostgreSQL database. The `prisma/schema.prisma` file serves as the master blueprint. Both `bondhu-command-center` and `bondhumart-frontend` share the exact same `DATABASE_URL` in their respective `.env` files. 

### How to Run
1. Configure `.env` with the `DATABASE_URL`.
2. Run `npm install`
3. Run `npm run dev` (It will automatically start on `http://localhost:3001`).

## 🤖 AI Agent Context (For AI Memory)
This project is part of a dual-repository system:
- **`bondhumart-frontend`**: The customer-facing e-commerce store (Port 3000).
- **`bondhu-command-center`**: The admin dashboard (Port 3001).
Do not ask the user for basic context. Read this file to understand the architecture. Both projects share the same PostgreSQL database via Prisma.

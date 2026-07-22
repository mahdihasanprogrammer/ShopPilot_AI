# 🛍️ ShopPilot AI

ShopPilot AI is a full-stack, AI-powered e-commerce platform that transforms traditional online shopping into a conversational experience. Powered by **Gemini 3.5 Flash**, users can chat with an AI assistant to discover products, receive personalized recommendations, generate AI-powered product summaries, and complete purchases seamlessly.

---

## 🔗 Live Demo

- 🌐 Live Site: https://shoppilot-web-two.vercel.app
- 💻  Repository(Client, Server): https://github.com/mahdihasanprogrammer/...


## ✨ Features

### 🤖 AI-Powered Experience
- 💬 Real-time AI Chat Assistant with SSE streaming
- 🧠 Personalized Product Recommendations (LangChain + Gemini, based on order history, cart, and browsing behavior)
- 📝 AI Product Summaries — auto-generated buying guides for each product
- 🎯 Context-Aware Product Chat — automatically loads product context when opened from a product detail page
- 🌐 English & Bengali Language Support
- 💡 AI-Generated Follow-up Suggestions — 2–3 clickable prompts after each reply

### 🛒 E-Commerce
- Product Search, Category Filter & Sorting
- Paginated Product Catalog with skeleton loading states
- Product Details with Image Gallery, Specs Table & Related Products
- Persistent MongoDB-backed Shopping Cart with drawer UI
- Secure Stripe Checkout with instant order creation
- Customer Reviews

### 👤 Authentication & Dashboard
- Better Auth (Email/Password & Google OAuth) on the client, with session tokens verified against MongoDB on the Express server
- User Dashboard — order history, profile management, recommendations panel
- Admin Dashboard — revenue and category Recharts, manage products (add/edit/delete), manage orders, update order status

### 🎨 UI/UX
- Light & Dark Theme with system preference detection and localStorage persistence
- Animated Sun/Moon theme toggle (desktop & mobile), FOUC-free
- Custom branded scrollbars in both themes
- Skeleton Loading States
- Toast Notifications (Sonner)
- Smooth 250ms CSS theme transitions without layout shift

---

## 🏗️ Tech Stack

### Frontend (`/client`)
| Layer       | Technology                        |
| ----------- | --------------------------------- |
| Framework   | Next.js 16 (App Router)           |
| Language    | TypeScript 5                      |
| Styling     | Tailwind CSS v4 + Vanilla CSS     |
| Auth Client | Better Auth v1                    |
| Payments    | Stripe.js + React Stripe.js       |
| Charts      | Recharts                          |
| Icons       | React Icons                       |
| Toasts      | Sonner                            |
| DB (Auth)   | MongoDB (via Better Auth adapter) |

### Backend (`/server`)
| Layer     | Technology                                                                          |
| --------- | ----------------------------------------------------------------------------------- |
| Runtime   | Node.js                                                                             |
| Framework | Express.js v4                                                                       |
| Language  | TypeScript 5                                                                        |
| Database  | MongoDB (native driver)                                                             |
| Auth      | Session token validation against MongoDB (custom middleware, separate from Next.js) |
| AI        | LangChain (`@langchain/google-genai`) + Gemini 3.5 Flash                            |
| Payments  | Stripe SDK v15                                                                      |

---

## 📁 Folder Structure

```text
ShopPilot_AI/
├── client/                        # Next.js frontend (App Router)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/          # Public routes (no auth required)
│   │   │   │   ├── page.tsx       # Home page
│   │   │   │   ├── products/      # Catalog + [id] product detail
│   │   │   │   ├── about/
│   │   │   │   ├── contact/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (protected)/       # Auth-gated routes
│   │   │   │   ├── checkout/
│   │   │   │   └── dashboard/
│   │   │   │       ├── admin/     # Revenue, products, orders management
│   │   │   │       ├── user/      # Order history, profile
│   │   │   │       └── items/
│   │   │   ├── api/               # Next.js API routes (Better Auth endpoints)
│   │   │   ├── globals.css        # Design tokens, dark mode vars, scrollbars
│   │   │   └── layout.tsx         # Root layout (ThemeProvider, FOUC script)
│   │   ├── components/
│   │   │   ├── auth/              # AuthInput, GoogleButton, DemoLoginButton
│   │   │   ├── dashboard/         # Sidebar, StatCard, Charts, OrdersTable
│   │   │   │   └── admin/         # AddProductForm, ProductManageTable, AdminOrdersTable
│   │   │   ├── home/              # Hero, WhyChooseUs, AIAssistantHighlight
│   │   │   ├── layout/            # Navbar, Footer, CartDrawer, ThemeToggle
│   │   │   ├── products/          # FilterPanel, SearchBar, details/
│   │   │   │   └── details/       # ImageGallery, SpecsTable, AISummaryCard, ReviewCard
│   │   │   └── shared/            # ProductCard, ChatWidget, RecommendationsSection, SkeletonLoader
│   │   ├── context/
│   │   │   └── ThemeContext.tsx   # Light/dark theme React context + localStorage
│   │   ├── lib/
│   │   │   ├── api.ts             # Typed fetch wrapper to Express backend
│   │   │   ├── auth.ts            # Better Auth server-side config
│   │   │   ├── auth-client.ts     # Better Auth client config
│   │   │   ├── cart.ts            # Cart read/write utility functions
│   │   │   ├── categories.ts      # Category badge style helpers
│   │   │   └── session.ts         # Session resolver utility
│   │   └── types/                 # Shared TypeScript interfaces
│   ├── package.json
│   ├── next.config.ts
│   └── tailwind.config.ts
│
└── server/                        # Express.js API backend
    ├── src/
    │   └── index.ts               # All route handlers + MongoDB + AI logic (single-file backend)
    ├── package.json
    ├── vercel.json                # Vercel serverless config
    └── tsconfig.json
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB)
- Google Cloud OAuth credentials
- Google AI Studio API key (Gemini 3.5 Flash)
- Stripe account (test keys)
- ImgBB account (for product image uploads)

### 1. Clone the repository
```bash
git clone https://github.com/mahdihasanprogrammer/ShopPilot_AI.git
cd ShopPilot_AI
```

### 2. Set up the Server
```bash
cd server
npm install
cp .env.example .env
# Fill in server/.env with your values (see Environment Variables)
npm run dev
```

### 3. Set up the Client
```bash
cd client
npm install
cp .env.local.example .env.local
# Fill in client/.env.local with your values (see Environment Variables)
npm run dev
```

The app will be available at `http://localhost:3000` and the API at `http://localhost:5000`.

---

## 🔐 Environment Variables

> **Never commit your `.env` files or secrets to GitHub.**

### Server — `server/.env`
| Variable               | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| `PORT`                 | Express server port (default: `5000`)                 |
| `NODE_ENV`             | `development` or `production`                         |
| `MONGODB_URI`          | MongoDB Atlas connection string                       |
| `DATABASE_NAME`        | MongoDB database name                                 |
| `BETTER_AUTH_SECRET`   | Auth signing secret (min 32 chars, must match client) |
| `BETTER_AUTH_URL`      | URL of the server (e.g. `http://localhost:5000`)      |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID                                |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret                            |
| `GEMINI_API_KEY`       | Google AI Studio API key for Gemini 3.5 Flash         |
| `STRIPE_SECRET_KEY`    | Stripe secret key (`sk_test_...`)                     |
| `CLIENT_URL`           | CORS allowed origin (e.g. `http://localhost:3000`)    |

### Client — `client/.env.local`
| Variable                             | Description                                               |
| ------------------------------------ | --------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`                | Express API base URL (e.g. `http://localhost:5000`)       |
| `NEXT_PUBLIC_AUTH_URL`               | Better Auth server URL (must match `BETTER_AUTH_URL`)     |
| `BETTER_AUTH_SECRET`                 | Same secret as server — used in Next.js server components |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID`       | Google OAuth client ID                                    |
| `GOOGLE_CLIENT_SECRET`               | Google OAuth client secret (server-side only)             |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_test_...`)                    |
| `NEXT_PUBLIC_IMGBB_API_KEY`          | ImgBB API key for product image hosting                   |

---

## 🚀 Available Scripts

### Server (`/server`)
| Script          | Description                         |
| --------------- | ----------------------------------- |
| `npm run dev`   | Start with ts-node-dev (hot reload) |
| `npm run build` | Compile TypeScript to `dist/`       |
| `npm start`     | Run compiled `dist/index.js`        |

### Client (`/client`)
| Script          | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start Next.js dev server (port 3000) |
| `npm run build` | Build production bundle              |
| `npm start`     | Serve production build               |
| `npm run lint`  | Run ESLint                           |

---

## 🌐 API Overview

All routes are prefixed with `/api`. Authentication is handled by verifying session tokens from the `Authorization: Bearer <token>` header against MongoDB's `session` collection.

| Method       | Route                                 | Auth   | Description                                              |
| ------------ | ------------------------------------- | ------ | -------------------------------------------------------- |
| GET          | `/api/health`                         | Public | Server & DB health check                                 |
| **Products** |                                       |        |                                                          |
| GET          | `/api/products`                       | Public | List products (filter, search, sort, paginate)           |
| GET          | `/api/products/:id`                   | Public | Get single product by ID                                 |
| POST         | `/api/products`                       | Admin  | Create a new product                                     |
| PATCH        | `/api/products/:id`                   | Admin  | Update a product                                         |
| DELETE       | `/api/products/:id`                   | Admin  | Delete a product                                         |
| POST         | `/api/products/:id/view`              | Auth   | Record product view (used for AI context)                |
| **Orders**   |                                       |        |                                                          |
| GET          | `/api/orders`                         | Auth   | Get authenticated user's orders (all orders if admin)    |
| POST         | `/api/orders`                         | User   | Create a new order (admins blocked)                      |
| PATCH        | `/api/orders/:id`                     | Admin  | Update order status                                      |
| GET          | `/api/orders/analytics/revenue`       | Admin  | Revenue data for charts                                  |
| GET          | `/api/orders/analytics/by-category`   | Admin  | Sales by category for pie chart                          |
| **Payments** |                                       |        |                                                          |
| POST         | `/api/payments/create-payment-intent` | User   | Create Stripe PaymentIntent (admins blocked)             |
| POST         | `/api/payments/webhook`               | Public | Stripe webhook handler                                   |
| **Cart**     |                                       |        |                                                          |
| GET          | `/api/cart`                           | User   | Get user's persistent cart (admins blocked)              |
| POST         | `/api/cart`                           | User   | Save/sync user's cart (admins blocked)                   |
| **AI**       |                                       |        |                                                          |
| POST         | `/api/ai/recommendations`             | Auth   | Generate personalized product recommendations via Gemini |
| POST         | `/api/ai/chat`                        | Auth   | SSE streaming chat with Gemini assistant                 |
| POST         | `/api/ai/summary`                     | Public | Generate AI product buying guide summary                 |
| **Misc**     |                                       |        |                                                          |
| POST         | `/api/contact`                        | Public | Submit contact form message                              |

---

## 📸 Screenshots

> Add screenshots after deployment.

| Home              | Products              | Dashboard              |
| ----------------- | --------------------- | ---------------------- |
| _Home Screenshot_ | _Products Screenshot_ | _Dashboard Screenshot_ |

---

## ☁️ Deployment

Both the **Client** and **Server** are configured for deployment on **Vercel** as separate projects.

### Server (Express API)
The server uses `vercel.json` to deploy as a serverless function via `@vercel/node`.
```json
{
  "builds": [{ "src": "src/index.ts", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "src/index.ts" }]
}
```
- Import the `server/` folder as a separate Vercel project.
- Add all server environment variables in the Vercel dashboard.
- Set `CLIENT_URL` to your deployed Next.js URL.

### Client (Next.js)
The client is a standard Next.js app — Vercel auto-detects it.
- Import the `client/` folder as a separate Vercel project.
- Add all client environment variables in the Vercel dashboard.
- Point `NEXT_PUBLIC_API_URL` to your deployed Express server URL.

---

## 🔭 Future Improvements

- [ ] Wishlist / Saved Items
- [ ] Product Reviews & Ratings submission
- [ ] Order Tracking with real-time status history
- [ ] Email Notifications (order confirmation, shipping updates)
- [ ] Coupon / Discount Codes at checkout
- [ ] Inventory Management with low-stock alerts
- [ ] Search Autocomplete
- [ ] AI Conversation History browser UI
- [ ] Rate Limiting on AI endpoints
- [ ] Unit & E2E Testing (Vitest, Playwright)

---

## 👨‍💻 Author

**Mahdi Hasan**

- GitHub: [github.com/mahdihasanprogrammer](https://github.com/mahdihasanprogrammer)
- LinkedIn: https://www.linkedin.com/in/mahdi-hasan-web
- Portfolio: https://my-personal-portfolio-final.vercel.app

---

## 📄 License

This project was built for **educational and portfolio purposes** (SCIC-13, Assignment 5 — Agentic AI Project).

© 2026 Mahdi Hasan. All rights reserved.
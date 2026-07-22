# 🛍️ ShopPilot AI

**ShopPilot AI** is a full-stack, AI-powered e-commerce platform that replaces traditional filtering and catalog browsing with a conversational, agentic shopping experience. Users chat with a real-time streaming AI assistant powered by **Gemini 3.5 Flash** to discover products, get personalized recommendations based on their order history and cart, and complete checkout — all in one seamless interface.

---

## ✨ Features

### 🤖 AI-Powered Experience
- **Site-Wide Chat Widget** — Floating AI assistant available on every page, streams responses in real time via SSE
- **Context-Aware Responses** — Automatically loads product context when opened from a product detail page
- **Bilingual Support** — Understands and responds in English or Bengali
- **AI Product Summary** — Auto-generated buying guides for each product using Gemini 3.5 Flash
- **Personalized Recommendations** — LangChain + Gemini selects products tailored to user order history, cart, and browsing behavior
- **Follow-up Suggestions** — After each reply, the AI generates 2–3 clickable suggested prompts

### 🛒 Shopping & Catalog
- **Product Listing** with search, category filtering, price range, and sort controls
- **Paginated catalog** with skeleton loading states
- **Product Detail Page** — image gallery, specs table, customer reviews, related products
- **Cart** — persistent MongoDB-backed cart with drawer UI
- **Checkout** — Stripe payment integration with instant order creation

### 👤 Auth & User Dashboard
- **Better Auth** authentication — email/password + Google OAuth
- **JWT/Session Token** validation on Express server (separate from Next.js)
- **User Dashboard** — order history, profile management, recommendations panel
- **Admin Dashboard** — revenue and category Recharts, manage products (add/edit/delete), manage orders, update order status

### 🎨 Design & UX
- **Light / Dark Mode** — system preference detection, `localStorage` persistence, FOUC-free toggle
- **Animated Sun/Moon toggle** in navbar for both desktop and mobile
- **Custom branded scrollbars** in both themes
- **AI markdown rendering** — code blocks, inline code, and product link rendering inside chat
- **Smooth 250ms CSS theme transitions** without layout shift
- **Toast notifications** via Sonner
- **Contact form** with MongoDB message storage

---

## 🏗️ Tech Stack

### Frontend (`/client`)
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + Vanilla CSS |
| Auth Client | Better Auth v1 |
| Payments | Stripe.js + React Stripe.js |
| Charts | Recharts |
| Icons | React Icons |
| Toasts | Sonner |
| DB (Auth) | MongoDB (via Better Auth adapter) |

### Backend (`/server`)
| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v4 |
| Language | TypeScript 5 |
| Database | MongoDB (native driver) |
| Auth | Better Auth v1 (session-based token validation) |
| AI | LangChain (`@langchain/google-genai`) + Gemini 3.5 Flash |
| Payments | Stripe SDK v15 |

---

## 📁 Folder Structure

```
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
    │   └── index.ts               # All route handlers + MongoDB + AI logic
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

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ShopPilot_AI.git
cd ShopPilot_AI
```

---

### 2. Set up the Server

```bash
cd server
npm install
cp .env.example .env
# Fill in server/.env with your values (see Environment Variables)
npm run dev
```

---

### 3. Set up the Client

```bash
cd client
npm install
cp .env.local.example .env.local
# Fill in client/.env.local with your values (see Environment Variables)
npm run dev
```

The app will be available at **http://localhost:3000** and the API at **http://localhost:5000**.

---

## 🔐 Environment Variables

### Server — `server/.env`

| Variable | Description |
|---|---|
| `PORT` | Express server port (default: `5000`) |
| `NODE_ENV` | `development` or `production` |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `DATABASE_NAME` | MongoDB database name (default: `shoppilot_db`) |
| `BETTER_AUTH_SECRET` | Auth signing secret (min 32 chars, must match client) |
| `BETTER_AUTH_URL` | URL of the server (e.g. `http://localhost:5000`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GEMINI_API_KEY` | Google AI Studio API key for Gemini 3.5 Flash |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...`) |
| `CLIENT_URL` | CORS allowed origin (e.g. `http://localhost:3000`) |

### Client — `client/.env.local`

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Express API base URL (e.g. `http://localhost:5000`) |
| `NEXT_PUBLIC_AUTH_URL` | Better Auth server URL (must match `BETTER_AUTH_URL`) |
| `BETTER_AUTH_SECRET` | Same secret as server — used in Next.js server components |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret (server-side only) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_test_...`) |
| `NEXT_PUBLIC_IMGBB_API_KEY` | ImgBB API key for product image hosting |

---

## 🚀 Available Scripts

### Server (`/server`)

| Script | Description |
|---|---|
| `npm run dev` | Start with `ts-node-dev` (hot reload) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled `dist/index.js` |

### Client (`/client`)

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js dev server (port 3000) |
| `npm run build` | Build production bundle |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |

---

## 🌐 API Overview

All routes are prefixed with `/api`. Authentication is handled by verifying Better Auth session tokens from the `Authorization: Bearer <token>` header against MongoDB's `session` collection.

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Server & DB health check |
| **Products** ||||
| `GET` | `/api/products` | Public | List products (filter, search, sort, paginate) |
| `GET` | `/api/products/:id` | Public | Get single product by ID |
| `POST` | `/api/products` | Admin | Create a new product |
| `PATCH` | `/api/products/:id` | Admin | Update a product |
| `DELETE` | `/api/products/:id` | Admin | Delete a product |
| `POST` | `/api/products/:id/view` | Auth | Record product view (used for AI context) |
| **Orders** ||||
| `GET` | `/api/orders` | Auth | Get authenticated user's orders |
| `POST` | `/api/orders` | Auth | Create a new order |
| `PATCH` | `/api/orders/:id` | Admin | Update order status |
| `GET` | `/api/orders/analytics/revenue` | Admin | Revenue data for charts |
| `GET` | `/api/orders/analytics/by-category` | Admin | Sales by category for pie chart |
| **Payments** ||||
| `POST` | `/api/payments/create-payment-intent` | Auth | Create Stripe PaymentIntent |
| `POST` | `/api/payments/webhook` | Public | Stripe webhook handler |
| **Cart** ||||
| `GET` | `/api/cart` | Auth | Get user's persistent cart |
| `POST` | `/api/cart` | Auth | Save/sync user's cart |
| **AI** ||||
| `POST` | `/api/ai/recommendations` | Auth | Generate personalized product recommendations via Gemini |
| `POST` | `/api/ai/chat` | Auth | SSE streaming chat with Gemini assistant |
| `POST` | `/api/ai/summary` | Public | Generate AI product buying guide summary |
| **Misc** ||||
| `POST` | `/api/contact` | Public | Submit contact form message |

---

## ☁️ Deployment

This project is configured for deployment on **Vercel** (both client and server as separate projects).

### Server (Express API)
The server uses `vercel.json` to deploy as a serverless function via `@vercel/node`.

```json
// server/vercel.json
{
  "builds": [{ "src": "src/index.ts", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "src/index.ts" }]
}
```

1. Import the `server/` folder as a separate Vercel project.
2. Add all server environment variables in the Vercel dashboard.
3. Set `CLIENT_URL` to your deployed Next.js URL.

### Client (Next.js)
The client is a standard Next.js app — Vercel auto-detects it.

1. Import the `client/` folder as a separate Vercel project.
2. Add all client environment variables in the Vercel dashboard.
3. Point `NEXT_PUBLIC_API_URL` to your deployed Express server URL.

---

## 🔭 Future Improvements

- [ ] **Wishlist / Saved Items** — persistent wishlist synced to user profile
- [ ] **Product Reviews** — allow authenticated users to submit ratings and written reviews
- [ ] **Email Notifications** — order confirmation and shipping update emails (e.g. Resend)
- [ ] **Image Optimization** — migrate from ImgBB to Cloudinary with Next.js `<Image>` optimization
- [ ] **Order Tracking** — real-time shipment status page with status history
- [ ] **Inventory Management** — stock count field with low-stock alerts on admin dashboard
- [ ] **Search Autocomplete** — real-time product suggestions as the user types in the search bar
- [ ] **Coupon / Discount Codes** — Stripe coupon integration at checkout
- [ ] **Chat History Persistence UI** — let users browse and reload previous AI chat sessions
- [ ] **Rate Limiting** — protect AI endpoints from abuse using `express-rate-limit`
- [ ] **Unit & E2E Tests** — Vitest for utilities, Playwright for critical user flows

---

## 👤 Author

**Mahdi Hasan**
- GitHub: [@mahdihasanprogrammer](https://github.com/mahdihasanprogrammer)

---

## 📄 License

This project is for educational and portfolio purposes. All rights reserved © 2025 Mahdi Hasan.

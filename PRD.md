# PRD — AI-Powered E-Commerce Shopping Assistant

**Assignment:** SCIC-13, Assignment 5 — Project 2 (Agentic AI)
**Author:** Mahdi Hasan

> এই একটা ফাইলেই পুরো প্রজেক্টের সব rules, tech stack, routes, pages, এবং features বিস্তারিতভাবে আছে। এখানে change করলে সেটা পুরো প্রজেক্টের জন্য apply হবে। প্রতিটা build prompt (আলাদা `Prompts.md` ফাইলে) এই PRD-কে reference করে — তাই rules বারবার repeat করা লাগে না।

---

## 1. Tech Stack (Fixed)

### Frontend
- Next.js (App Router)
- TypeScript (mandatory, no `.js` files)
- Tailwind CSS only — কোনো external UI library না
- Better Auth — authentication + protected route handling
- Recharts — শুধু admin dashboard-এর chart-এর জন্য
- Data fetching: native `fetch` — **TanStack Query / RTK Query ব্যবহার হবে না**

### Backend
- Node.js + Express.js
- TypeScript
- MongoDB — **native MongoDB driver**, **Mongoose ব্যবহার হবে না**
- Better Auth — token/session verify backend middleware দিয়ে
- Architecture: **Single-file** — কোনো MVC/separate Model-Controller-Route ফোল্ডার স্ট্রাকচার না
- Entry point: **একটাই `index.ts`** — সব route, সব logic (DB connection, route handlers, middleware) এই একটা ফাইলেই থাকবে
- AI Provider: **Gemini 2.5 Flash via LangChain** (`@langchain/google-genai`)
- Payment: Stripe (Test Mode)
- Deployment: **Vercel** — both frontend and backend

---

## 2. Global UI & Design Rules
- সর্বোচ্চ ৩টা primary color + ১টা neutral color (Light violet theme: Primary `#7c3aed`, Accent `#06b6d4`, Background `#faf9fc` / `#f3f0fa`, Neutral text `#1f2937`)
- সব card একই height, width, border-radius, shadow — কোনো ব্যতিক্রম নেই
- Consistent spacing; প্রতিটা section-এ responsive padding
- Fully responsive: mobile (375px) / tablet (768px) / desktop (1280px+)
- কোনো lorem ipsum / placeholder / dummy content না — সব real, structured copy
- Skeleton loader — যেকোনো data fetch-এর সময়
- Design feel: Nike / Apple / Stripe-এর মতো minimal, clean, premium
- Tailwind CSS ছাড়া অন্য কোনো UI kit ব্যবহার নয় (Recharts শুধুই chart-এর জন্য exception)

---

## 3. Route Map

### Public Routes
| Route | Page |
|---|---|
| `/` | Home |
| `/products` | Product Listing / Explore |
| `/products/[id]` | Product Details |
| `/login`, `/register` | Auth |
| `/about`, `/contact` | Additional pages |
| `/forbidden` | Forbidden page (role mismatch) |

### Protected Routes (Better Auth session required)
| Route | Page | Role |
|---|---|---|
| `/dashboard/user` | User Dashboard — Overview/Home | user |
| `/dashboard/user/profile` | User Profile Settings | user |
| `/dashboard/user/orders` | User Order History | user |
| `/dashboard/admin` | Admin Dashboard — Overview/Home | admin only |
| `/dashboard/admin/profile` | Admin Profile Settings | admin only |
| `/dashboard/admin/manage-products` | Manage Products | admin only |
| `/dashboard/admin/add-product` | Add Product | admin only |
| `/dashboard/admin/manage-orders` | Manage Orders (all users) | admin only |
| `/checkout` | Checkout + Payment | user |

**Rules:**
- Unauthenticated → redirect `/login`, save original path, redirect back after login success
- Role isolation is **mutual**: a `user` cannot access any `/dashboard/admin/*` route, and an `admin` cannot access any `/dashboard/user/*` route
- On a role mismatch → redirect to `/forbidden` (dedicated Forbidden page, not a silent redirect to their own dashboard)
- Navbar: minimum 3 routes visible logged-out, minimum 5 routes logged-in
- Add/Manage Product/Order features are **admin-only** — regular users do not see these routes or links

### Forbidden Page (`/forbidden`)
- Shown when a logged-in user tries to access a route belonging to the other role
- Centered message: "You don't have permission to access this page"
- Two buttons: **Back** (previous page) and **Home** (→ `/`)

---

## 4. Two Dashboards

### User Dashboard
- `/dashboard/user` (Overview/Home): welcome section (user name from session), stats cards (Orders / Wishlist / Cart counts), recent orders summary, quick actions (Continue Shopping, Go to Checkout, Logout)
- `/dashboard/user/profile`: profile card (name, email, avatar), edit profile form
- `/dashboard/user/orders`: full order history list/table
- Sidebar navigation across all three pages, per §4a

### Admin Dashboard
- `/dashboard/admin` (Overview/Home): stats cards (Total Products, Total Orders, Total Revenue, Total Users), Recharts (Revenue over time, Orders by category), recent orders table (all users), quick links to the sub-pages below
- `/dashboard/admin/profile`: admin's own profile settings
- `/dashboard/admin/manage-products`: table/grid of all products — View, Delete (confirmation modal), optional Edit
- `/dashboard/admin/add-product`: Add Product form (Title, Short Description, Full Description, Price, Category, Optional Image URL) → `POST /api/products`
- `/dashboard/admin/manage-orders`: table of all orders across users, with a status-update dropdown (pending → paid → shipped → delivered)
- Sidebar navigation across all five pages, per §4a
- Access strictly limited to `role: "admin"` (frontend guard + backend `requireAdmin` middleware) on every sub-route above

---

## 4a. Dashboard Layout Rule (Sidebar, not Navbar)

- Public pages (`/`, `/products`, `/products/[id]`, `/login`, `/register`, `/about`, `/contact`) use the standard **top Navbar** (PRD §5.1).
- All `/dashboard/*` pages (both User and Admin) use a **Sidebar layout instead of the top Navbar** — no public Navbar rendered inside the dashboard shell.
- **Desktop**: sidebar permanently visible on the left (Overview, sub-pages, Logout at the bottom).
- **Mobile/small devices**: sidebar is hidden by default, replaced by a **hamburger icon** in a slim top bar. Tapping it opens the sidebar as a slide-in drawer (with an overlay/backdrop, closes on outside tap or an explicit close icon).
- This hamburger icon is **only** shown while inside `/dashboard/*` routes. On public pages, the normal Navbar (with its own menu icon on mobile, per PRD §5.1) is shown instead — the two never appear together.
- The sidebar (desktop and mobile drawer) must include a **"Back to Site"** link/icon (e.g. an arrow-left + "Back to Home") that navigates back to `/`, so the user isn't stuck inside the dashboard shell.
- Sidebar content:
  - **User**: Overview, My Orders, Profile Settings, AI Assistant, Back to Site, Logout
  - **Admin**: Overview, Manage Products, Add Product, Manage Orders, Profile, Back to Site, Logout
- Active route in the sidebar should be visually highlighted (per current path).

---

### 5.1 Home Page
Sections (8 total, exceeds 7 minimum): Sticky Navbar (public pages only — see §4a for dashboard layout), Hero (60–70% viewport height, CTA + interactive element), Categories (6 cards), Featured Products (8 items, 4-col grid, skeleton loader), Why Choose Us (4 cards), Testimonials (3 cards), AI Assistant Highlight, Newsletter, Footer (working links + contact/social info).

### 5.2 Product Listing (`/products`)
- Search bar (debounced)
- Filters (min. 2 fields): Category + Price range
- Sorting: Price asc/desc, Newest, Rating
- Pagination (12/page) or infinite scroll
- 4/2/1 column responsive grid, skeleton loader

### 5.3 Product Details (`/products/[id]`)
- Public access
- Image gallery, Overview, Full Description, Specifications, Reviews, Related Products
- Buttons: Buy Now, Add to Cart, Back to Products
- AI Summary card (short AI-generated product summary)

### 5.4 Auth Pages
- Login: email/password, demo login button (auto-fill + submit), Google login, validation, redirect-back-after-login logic
- Register: name/email/password/confirm, validation, auto-login after register

### 5.5 Add Product (`/dashboard/admin/add-product`)
Fields: Title, Short Description, Full Description, Price, Category, Optional Image URL. Submit → `POST /api/products`. Admin-only.

### 5.6 Manage Products (`/dashboard/admin/manage-products`)
Table/grid of all products. Actions: View, Delete (confirmation modal), optional Edit. Admin-only.

### 5.6b Manage Orders (`/dashboard/admin/manage-orders`)
Table of all orders across all users: Order ID, Customer, Product, Amount, Status, Date. Status-update dropdown (pending → paid → shipped → delivered) → `PATCH /api/orders/:id`. Admin-only.

### 5.7 Checkout (`/checkout`)
Order Summary, Shipping Info form, Stripe Elements card payment (Test Mode), Place Order → create payment intent → confirm payment → save order → success redirect.

### 5.8 About / Contact
About: platform story, AI assistant explanation. Contact: form (name/email/message) → saved to MongoDB via `POST /api/contact`.

---

## 6. Agentic AI Features (2 Required)

### Feature 1 — Smart Recommendation Engine
- Backend actively gathers context (order history, cart, filtered product candidates) **before** calling the AI (LangChain + Gemini 2.5 Flash) — this is the agentic part, not just prompt-passthrough
- The model reasons over that context, returns 3–5 product IDs + reasoning, strict JSON output (use LangChain's structured output / JSON parser)
- Frontend: recommendations section with reasoning shown per product, refinement input (e.g. budget constraint) re-triggers the call

### Feature 2 — Conversational Shopping Assistant
- Floating chat widget, available site-wide
- Conversation history persisted in MongoDB (`chat_history` collection), loaded per `conversationId`
- Streaming responses (SSE or chunked)
- Context-aware: if opened from a Product Details page, product info is injected into context
- Follow-up reasoning: must resolve references like "কোনটা" using prior turns
- Suggested follow-up prompt chips after each response
- Typing indicator while streaming
- Responds in the language the user writes in (Bengali/English)

---

## 7. Data Models

### User (Better Auth managed + extended)
`name, email, password(hashed), image, role: "user"|"admin", createdAt`

### Product
`title, shortDescription, fullDescription, price, category, images[], ownerId, rating, reviews[], createdAt`

### Order
`userId, items[{productId, name, price, qty}], totalAmount, status: "pending"|"paid"|"shipped"|"delivered", stripePaymentIntentId, createdAt`

### ChatHistory
`userId, conversationId, messages[{role, content, timestamp}], createdAt`

### ContactMessage
`name, email, message, createdAt`

---

## 8. API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| `*` | `/api/auth/*` | Better Auth handler |
| GET | `/api/products` | Public (search/filter/sort/pagination via query params) |
| GET | `/api/products/:id` | Public |
| POST | `/api/products` | Protected |
| PATCH/DELETE | `/api/products/:id` | Protected |
| GET | `/api/orders` | Protected (own orders, or all if admin) |
| POST | `/api/orders` | Protected |
| PATCH | `/api/orders/:id` | Protected (admin — update order status) |
| GET | `/api/orders/analytics/revenue` | Protected (admin) |
| GET | `/api/orders/analytics/by-category` | Protected (admin) |
| POST | `/api/payments/create-payment-intent` | Protected |
| POST | `/api/payments/webhook` | Public (Stripe signature verified) |
| POST | `/api/ai/recommendations` | Protected |
| POST | `/api/ai/chat` | Protected (streaming) |
| POST | `/api/contact` | Public |

**Standard response shape:**
```json
{ "success": true, "message": "string", "data": {}, "error": null }
```

---

## 9. Backend Structure (Single File, No MVC)

```
src/
└─ index.ts    (ONLY file — DB connection, all route handlers, all middleware,
                 all logic for products, orders, payments, ai, contact, auth mount)
```

- সব কিছু একটাই `index.ts`-এ — কোনো আলাদা `models/`, `controllers/`, `routes/` ফোল্ডার নেই
- ভেতরে logical grouping (comments দিয়ে section আলাদা করা: `// ---- Products ----`, `// ---- Orders ----` ইত্যাদি) রাখা যেতে পারে readability-র জন্য, কিন্তু ফাইল একটাই থাকবে
- MongoDB native driver দিয়ে সরাসরি collection access (`db.collection<Product>('products')`) — এই ফাইলের ভেতরেই
- Better Auth middleware (`requireAuth`, `requireAdmin`) একই ফাইলে function হিসেবে define করা থাকবে
- Vercel serverless deployment-এর জন্য উপযোগী structure (single handler export)

---

## 10. Frontend Folder Structure

```
src/
├─ app/
│  ├─ (public)/ (Home, Products, Product Details, Login, Register, About, Contact)
│  ├─ (protected)/
│  │  └─ dashboard/
│  │     ├─ user/
│  │     │  ├─ page.tsx              (/dashboard/user — Overview)
│  │     │  ├─ profile/page.tsx      (/dashboard/user/profile)
│  │     │  └─ orders/page.tsx       (/dashboard/user/orders)
│  │     └─ admin/
│  │        ├─ page.tsx              (/dashboard/admin — Overview)
│  │        ├─ profile/page.tsx      (/dashboard/admin/profile)
│  │        ├─ manage-products/page.tsx  (/dashboard/admin/manage-products)
│  │        ├─ add-product/page.tsx      (/dashboard/admin/add-product)
│  │        └─ manage-orders/page.tsx    (/dashboard/admin/manage-orders)
│  ├─ (protected)/checkout/page.tsx
│  ├─ layout.tsx
│  └─ globals.css
├─ components/
│  ├─ ui/
│  ├─ layout/ (Navbar, Footer, DashboardSidebar, MobileSidebarDrawer)
│  └─ shared/ (ProductCard, SkeletonLoader, ChatWidget, etc.)
├─ lib/ (auth-client.ts, api.ts, utils.ts)
└─ types/index.ts
```

---

## 11. Non-Functional Requirements
- All routes/buttons/links functional — no dead `#` links
- Skeleton loaders on every async fetch
- Loading + error + empty states everywhere data is fetched
- No API keys exposed in frontend bundle
- `.env` files git-ignored on both frontend and backend
- Backend `requireAuth`/`requireAdmin` middleware is the real security boundary; frontend guards are UX-layer only

---

## 12. Assignment Requirement → PRD Section Map (100% Coverage)

| Assignment Requirement | PRD Section |
|---|---|
| Tech stack | §1 |
| Global UI/design rules | §2 |
| Navbar, Hero, 7+ sections, Footer | §5.1 |
| Card rules, 4-col grid, skeleton loader | §5.2 |
| Details page (public, gallery, specs, reviews, related) | §5.3 |
| Search, filter (2+ fields), sort, pagination | §5.2 |
| Auth: login/register, validation, demo login, Google | §5.4 |
| Protected: Add Item | §5.5 |
| Protected: Manage Item | §5.6 |
| Additional pages (About, Contact) | §5.8 |
| Agentic AI Feature 1 (Recommendation) | §6 |
| Agentic AI Feature 2 (Chat Assistant) | §6 |
| UX & responsiveness | §2, §11 |
| Deployment + GitHub | Final submission (see Prompts.md #18) |

---

## 13. Build Order (mirrors Prompts.md)

1. Frontend setup 2. Backend setup 3. Better Auth integration 4. Home 5. Product Listing 6. Product Details 7. Login/Register 8. Protected route guard 9. User Dashboard 10. Admin Dashboard 11. Add Product 12. Manage Products 13. Checkout + Stripe 14. AI Recommendation Engine 15. AI Chat Assistant 16. About/Contact 17. Full API integration pass 18. Final polish + deployment

---

## 14. Change Log
> নতুন কোনো rule change করলে এখানে note রাখো, যাতে Prompts.md-এর সাথে sync থাকে।

| Date | Change |
|---|---|
| — | Initial version |
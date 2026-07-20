# Build Prompts — AI-Powered E-Commerce Shopping Assistant

> প্রতিটা prompt নিচে আলাদা titled section-এ আছে। প্রতিটা copy করে AI-কে (Claude/GPT/Cursor) সিরিয়াল অনুযায়ী দাও। সব rules, tech stack, design system **`PRD.md`** ফাইলে আছে — সেটা প্রতিটা prompt-এর শুরুতে attach/paste করে দাও (বা AI-কে বলো "PRD.md অনুসরণ করো"), যাতে বারবার rules লেখা না লাগে।

---

## Prompt 01 — Frontend Project Setup

You are a Senior Next.js Developer. Follow the attached `PRD.md` strictly (tech stack §1, design rules §2, folder structure §10).

Set up a new Next.js (App Router) + TypeScript + Tailwind CSS project.

**Tasks:**
1. Initialize with `create-next-app` (TypeScript, Tailwind, App Router, `src/` directory)
2. Configure `tailwind.config.ts` with the light violet theme from PRD §2
3. Create the exact folder structure from PRD §10
4. Create shared TypeScript types in `types/index.ts` for: `Product`, `User`, `Order`, `ChatMessage`
5. Set up `lib/api.ts` — a typed native `fetch` wrapper (no TanStack/RTK Query)
6. Set global font via `next/font`
7. Mobile-first responsive base layout

**Output:** Full folder structure + code for `tailwind.config.ts`, `layout.tsx`, `globals.css`, `types/index.ts`.

---

## Prompt 02 — Backend Project Setup (Express + TypeScript + MongoDB, Single File)

You are a Senior Backend Developer. Follow `PRD.md` §1 (backend tech stack) and §9 (single-file structure) strictly.

Set up an Express.js + TypeScript backend using the **native MongoDB driver** (no Mongoose). **No MVC, no separate models/controllers/routes folders** — everything lives in one `index.ts`.

**Tasks:**
1. Inside `index.ts`: load env vars, connect to MongoDB (native `MongoClient`, singleton pattern), set up Express app (`cors()`, `express.json()`)
2. Define TypeScript interfaces for `Product`, `Order`, `User`, `ChatMessage`, `ContactMessage` directly in `index.ts` (or a single `types.ts` if it gets too long — but no split into model files)
3. Define all route handlers directly on the `app` instance (`app.get('/api/products', ...)`, `app.post('/api/products', ...)`, etc.) — group them with comments per resource for readability
4. Define `requireAuth` / `requireAdmin` middleware functions in the same file
5. A shared response helper function (can be a small local function in the same file) for the standard response shape (PRD §8)
6. Global error handler at the end of the file
7. `.env.example` with all required vars
8. Structure the file to be Vercel-serverless-friendly (export the app / a handler)

**Output:** The complete `index.ts` file (this is the entire backend).

---

## Prompt 03 — Better Auth Integration (Frontend + Backend)

You are a Senior Full Stack Developer. Follow `PRD.md` §3 (routes/roles) and §1 (tech stack).

Integrate Better Auth on both frontend and backend, with MongoDB native driver adapter, Google social login, and `role: "user"|"admin"` support.

**Backend tasks:**
1. Configure Better Auth against the native MongoDB connection
2. Add `role` field to user model (default `"user"`)
3. `requireAuth` (401 if no valid session) and `requireAdmin` (403 if not admin) middleware functions — defined directly in `index.ts`, no separate `middlewares/` folder
4. Mount Better Auth handler at `/api/auth/*`
5. Apply `requireAuth`/`requireAdmin` to routes per PRD §8's Access column

**Frontend tasks:**
1. `lib/auth-client.ts` — Better Auth client config
2. `AuthProvider` wrapping `layout.tsx`
3. Email/password login + register, Google login button, **demo login button** (auto-fill + submit)
4. Redirect-back-after-login using saved original path (fallback `/`)
5. `useSession()` usage for displaying user info

**Output:** Backend Better Auth config + `auth.middleware.ts`; frontend `auth-client.ts` + `AuthProvider` + Login page wired end-to-end.

---

## Prompt 04 — Home Page

You are a Senior Next.js Developer. Follow `PRD.md` §5.1 for exact section list and §2 for design rules.

Build the Home page with all 8 sections listed in PRD §5.1, using reusable components: `Navbar`, `Hero`, `Categories`, `ProductCard`, `FeaturedProducts`, `WhyChooseUs`, `Testimonials`, `AIAssistantHighlight`, `Newsletter`, `Footer`.

- Navbar route count differs by auth state (PRD §3)
- Use `useSession()` to conditionally render logged-in nav items
- Use typed placeholder data matching the `Product` interface (no real API call yet)

**Output:** Full code for every listed component + the composed `page.tsx`.

---

## Prompt 05 — Product Listing / Explore Page

You are a Senior Next.js Developer. Follow `PRD.md` §5.2.

Build `/products` with responsive grid, search bar, category + price range filters, sorting, pagination (12/page), skeleton loader, and error/empty states.

- Fetch from `GET /api/products` (query params per PRD §8) using native `fetch`
- Reuse `ProductCard` from Prompt 04
- "View Details" navigates to `/products/[id]`

**Output:** Full `/products` page + `SearchBar`, `FilterPanel`, `SortDropdown`, `Pagination` components.

---

## Prompt 06 — Product Details Page

You are a Senior Next.js Developer. Follow `PRD.md` §5.3.

Build `/products/[id]` (public route) with image gallery, Overview, Full Description, Specifications, Reviews, Related Products (same category), Buy Now / Add to Cart / Back buttons, and an AI Summary card (static placeholder for now — wired to real AI in Prompt 14).

- Fetch by ID from `GET /api/products/:id`
- Loading + "product not found" error states

**Output:** Full Product Details page + `ImageGallery`, `SpecsTable`, `ReviewCard`, `RelatedProducts`, `AISummaryCard` components.

---

## Prompt 07 — Login & Register Pages

You are a Senior Next.js Developer. Follow `PRD.md` §5.4.

Build `/login` and `/register` using the Better Auth client from Prompt 03.

- Login: email/password, demo login button, Google login, validation, error messages, redirect-back-after-login logic
- Register: name/email/password/confirm, validation, auto-login → redirect `/dashboard/user`

**Output:** Full code for both pages + reusable `AuthInput`, `AuthButton`, `GoogleButton`, `DemoLoginButton` components.

---

## Prompt 08 — Protected Route Guard + Dashboard Sidebar Shell

You are a Senior Next.js Developer. Follow `PRD.md` §3 (route guard rules) and §4a (dashboard layout rule) strictly.

### Part A — Route Guard
Build the route protection system: unauthenticated → `/login` (save path); role mismatch (user on `/dashboard/admin/*`, or admin on `/dashboard/user/*`) → `/forbidden` (mutual, strict separation).

- Apply to the `(protected)` route group: `/dashboard/user`, `/dashboard/user/profile`, `/dashboard/user/orders`, `/dashboard/admin`, `/dashboard/admin/profile`, `/dashboard/admin/manage-products`, `/dashboard/admin/add-product`, `/dashboard/admin/manage-orders`, `/checkout`
- All `/dashboard/admin/*` routes require `role === "admin"`; all `/dashboard/user/*` routes require `role === "user"` (admin excluded)
- This is a UX-layer guard — backend `requireAuth`/`requireAdmin` (Prompt 03) remains the real security boundary (PRD §11)

### Part C — Forbidden Page (`/forbidden`)
Build `/forbidden`: centered message ("You don't have permission to access this page"), two buttons — **Back** (`router.back()`) and **Home** (`→ /`).

### Part B — Dashboard Sidebar Shell (replaces Navbar inside `/dashboard/*`)
Build a shared `DashboardLayout` (used by both `/dashboard/user/*` and `/dashboard/admin/*` route groups) that:
- Renders a **Sidebar** (not the public Navbar) with role-specific links per PRD §4a — User: Overview, My Orders, Profile Settings, AI Assistant, Back to Site, Logout. Admin: Overview, Manage Products, Add Product, Manage Orders, Profile, Back to Site, Logout
- **Desktop**: sidebar always visible, fixed on the left
- **Mobile**: sidebar hidden by default; a hamburger icon in a slim top bar opens it as a slide-in drawer with a backdrop overlay, closable by tapping the backdrop or a close icon — this hamburger only appears inside `/dashboard/*`, never alongside the public Navbar
- Includes a **"Back to Site"** link (arrow-left icon + label) navigating to `/`
- Highlights the currently active route in the sidebar
- `/checkout` does NOT use this dashboard shell — it keeps the public Navbar (it's a protected route but not part of the dashboard section)

**Output:** Full code for `middleware.ts` (or wrapper component) for the route guard, the `/forbidden` page, plus the `DashboardLayout`, `Sidebar`, and `MobileSidebarDrawer` components applied to the `/dashboard/user` and `/dashboard/admin` route groups.

---

## Prompt 09 — User Dashboard (Overview, Profile, Orders)

You are a Senior Next.js Developer. Follow `PRD.md` §4 (User Dashboard section).

Build three pages using the shared `DashboardLayout`/`Sidebar` from Prompt 08 (Overview, My Orders, Profile Settings, AI Assistant nav items already handled there):

- `/dashboard/user` — Overview: welcome section (user name from session), profile card, stats cards (Orders/Wishlist/Cart), recent orders summary, quick actions (Continue Shopping / Go to Checkout / Logout)
- `/dashboard/user/profile` — Profile Settings: editable name/email/avatar form
- `/dashboard/user/orders` — full order history table/list (fetch from `GET /api/orders`)

- Use `useSession()` for user data — no hardcoded values
- Skeleton loaders while fetching

**Output:** Full code for all three pages, the shared dashboard layout/sidebar, and `StatCard`, `RecentOrdersTable`, `ProfileCard` components.

---

## Prompt 10 — Admin Dashboard (Overview, Profile, Manage Products, Add Product, Manage Orders, with Recharts)

You are a Senior Next.js Developer. Follow `PRD.md` §4 (Admin Dashboard section). All routes below are **admin-only**, guarded per Prompt 08.

Build a shared admin section using the `DashboardLayout`/`Sidebar` from Prompt 08 (Overview, Manage Products, Add Product, Manage Orders, Profile nav items already handled there) with these pages:

- `/dashboard/admin` — Overview: stats cards (Total Products/Orders/Revenue/Users), Recharts revenue chart, Recharts category chart, recent orders table (all users), quick links to the sub-pages
- `/dashboard/admin/profile` — admin's own profile settings
- `/dashboard/admin/manage-products` — table/grid of all products, View/Delete (confirmation modal)/optional Edit
- `/dashboard/admin/add-product` — Add Product form (Title, Short Description, Full Description, Price, Category, Optional Image URL) → `POST /api/products`, success toast → redirect to `manage-products`
- `/dashboard/admin/manage-orders` — table of all orders (all users), status-update dropdown → `PATCH /api/orders/:id`

- Fetch analytics from `GET /api/orders/analytics/revenue` and `/by-category`
- Use Recharts `ResponsiveContainer` for responsive charts
- Same design system as User Dashboard, skeleton loaders on every fetch

**Output:** Full code for all five pages, the shared admin layout/sidebar, and `RevenueChart`, `CategoryChart`, `AdminOrdersTable`, `ProductManageTable`, `AddProductForm` components.

---

## Prompt 11 — Deep Dive: Add Product Page (`/dashboard/admin/add-product`)

You are a Senior Next.js Developer. Follow `PRD.md` §5.5. (If already built as part of Prompt 10, use this to refine/harden just this page.)

Build/refine the Add Product form: fields exactly as PRD §5.5, client-side validation with inline errors, submit to `POST /api/products`, success toast → redirect to `/dashboard/admin/manage-products`, error handling on server validation failure. Admin-only access.

**Output:** Full `/dashboard/admin/add-product` page + form component with the fetch call.

---

## Prompt 12 — Deep Dive: Manage Products & Manage Orders (`/dashboard/admin/manage-products`, `/dashboard/admin/manage-orders`)

You are a Senior Next.js Developer. Follow `PRD.md` §5.6 and §5.6b. (If already built as part of Prompt 10, use this to refine/harden these two pages.)

**Manage Products:** table/grid of all products, View, Delete (confirmation modal), optional Edit. Fetch from `GET /api/products`. Empty state + skeleton loader.

**Manage Orders:** table of all orders (all users) — Order ID, Customer, Product, Amount, Status, Date — with a status-update dropdown calling `PATCH /api/orders/:id`. Fetch from `GET /api/orders`.

**Output:** Full code for both pages + `ProductManageTable`, delete confirmation modal, and `AdminOrdersTable` with the status-update control.

---

## Prompt 13 — Checkout Page + Stripe Test Payment

You are a Senior Full Stack Developer. Follow `PRD.md` §5.7 and §8 (payment endpoints).

**Frontend:** Order Summary, Shipping form, Stripe Elements (`CardElement`), Place Order flow (create payment intent → confirm payment → save order → redirect), test card helper note (`4242 4242 4242 4242`).

**Backend:** `POST /api/payments/create-payment-intent`, `POST /api/orders` (status `"paid"`), optional `POST /api/payments/webhook` — all added as route handlers directly in `index.ts` (no separate controller/route files, per PRD §9).

**Output:** Full Checkout page (Stripe Elements) + the new route handlers to add into `index.ts`.

---

## Prompt 14 — Agentic AI Feature 1: Smart Recommendation Engine

You are a Senior AI Integration Engineer. Follow `PRD.md` §6 (Feature 1) carefully — this must demonstrate real agentic reasoning, not simple text generation.

**Backend:** `POST /api/ai/recommendations` route handler (added into `index.ts` per PRD §9) — gathers user's order history, cart, and pre-filtered candidate products from MongoDB *before* calling the AI; uses **LangChain (`@langchain/google-genai`) with Gemini 2.5 Flash** to get 3–5 product IDs + reasoning in strict JSON (use LangChain's structured output/JSON output parser); handles parse/API errors gracefully.

**Frontend:** Recommendations section (Dashboard + Home) showing products with AI reasoning, refinement input that re-triggers the call, loading/error states.

**Output:** The `/api/ai/recommendations` handler code (to add into `index.ts`) and the `RecommendationsSection` component.

---

## Prompt 15 — Agentic AI Feature 2: Conversational Shopping Assistant

You are a Senior AI Integration Engineer. Follow `PRD.md` §6 (Feature 2) carefully — must maintain memory, resolve follow-up references, and use application context.

**Backend:** `POST /api/ai/chat` route handler (added into `index.ts` per PRD §9) — loads conversation history from `chat_history` collection, injects current product context if provided, streams the response using **LangChain (`@langchain/google-genai`) with Gemini 2.5 Flash** (`.stream()`), saves the exchange after streaming, generates 2–3 follow-up prompt suggestions.

**Frontend:** Floating `ChatWidget` (site-wide) — message bubbles, typing indicator, streaming consumption, follow-up prompt chips, `conversationId` persisted in session state, auto-passes `currentProductId` from Product Details pages. Responds in the user's language (Bengali/English).

**Output:** The `/api/ai/chat` streaming handler code (to add into `index.ts`) and the `ChatWidget` component.

---

## Prompt 16 — Additional Pages (About, Contact)

You are a Senior Next.js Developer. Follow `PRD.md` §5.8.

Build `/about` (platform story + AI assistant explanation, optional team/values cards) and `/contact` (form → `POST /api/contact`, saved to MongoDB, success message, contact info block).

**Output:** Full code for both pages + the `/api/contact` route handler (to add into `index.ts`).

---

## Prompt 17 — Full Frontend–Backend API Integration Pass

You are a Senior Full Stack Developer. Follow `PRD.md` §8 (full endpoint list) as the source of truth.

Go through every page built in Prompts 04–13 and 16, replace any remaining placeholder data with real API calls, and verify against this checklist:

- [ ] Home — real featured products
- [ ] Product Listing — real search/filter/sort/pagination
- [ ] Product Details — real fetch, real related products, AI Summary wired to real endpoint
- [ ] Login/Register — fully wired, demo login + Google login work
- [ ] User Dashboard — real orders/stats
- [ ] Admin Dashboard — real Recharts data, real orders table
- [ ] Admin: Add/Manage Products, Manage Orders — real persistence and status updates
- [ ] Checkout — real Stripe test flow end-to-end
- [ ] AI Recommendation + Chat — real LangChain/Gemini calls
- [ ] Contact — real submission
- [ ] Route protection — verify blocked at both frontend guard AND backend middleware

Every fetch call must handle loading/error/empty states (PRD §11). Verify CORS and `.env` completeness on both sides.

**Output:** List of every endpoint the frontend calls with confirmation it's implemented, plus any missing glue code.

---

## Prompt 18 — Final Polish, Responsive QA & Deployment

You are a Senior Full Stack Developer preparing this for submission. Follow `PRD.md` §2, §11, and §12 (full requirement coverage check).

- Responsive QA at 375px / 768px / 1280px+ — no overflow, no dead links, consistent skeleton loaders, color rule compliance, card consistency
- Content QA — remove any lorem ipsum/placeholder/TODO left in the codebase
- Security pass — protected routes reject unauthenticated (401) and non-admin (403) requests on the backend; no API keys exposed in frontend bundle; `.env` git-ignored
- Deploy both frontend and backend to **Vercel** (backend as Vercel serverless functions from the single `index.ts`), with all env vars set (PRD §1)
- Final live checks: demo login works, full Stripe test checkout succeeds, AI features work in production

**Submission package:** Live URL, GitHub repo(s), README.md (setup instructions, tech stack, demo credentials, screenshots).

**Output:** Completed deployment checklist + README.md content.
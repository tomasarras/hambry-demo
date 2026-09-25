# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

Hambry is a fictional multi-restaurant food delivery marketplace demo (portfolio project): Next.js App Router (JS, not TS) + Prisma/PostgreSQL (Neon), Tailwind v4. Same stack and conventions as the sibling `vestra-demo`/`comanda-demo` repos, adapted for a marketplace instead of a single store.

## Commands

```
npm run dev       # next dev (localhost:3000)
npm run build     # prisma generate && prisma migrate deploy && next build
npm run lint      # eslint
npm run db:seed   # node prisma/seed.mjs — upserts the fixed demo restaurants/menus, wipes nothing
```

No test suite exists in this repo.

Prisma workflow: edit `prisma/schema.prisma`, then `npx prisma migrate dev --name <desc>`, then `npx prisma generate` if the client needs regenerating. `DATABASE_URL`/`DATABASE_URL_UNPOOLED` come from `.env` (Neon pooled + direct in production; a local Postgres works fine for dev).

## Architecture

**No real auth, anywhere, for any of the three roles.** `app/page.js` (`/`) is a role picker — Cliente (→ `/inicio`, no gate), Restaurante (→ `/restaurante/ingresar`), Repartidor (→ `/repartidor`, no gate) — plus a "Restablecer demo" button.

- **Cliente**: nothing to gate.
- **Restaurante**: unlike vestra-demo (a single store, so "admin" needs no further identity), Hambry is multi-vendor — `/restaurante/ingresar` lets you pick *which* restaurant you're managing (no password, just a list). `RestaurantAdminProvider` (`components/RestaurantAdminProvider.js`) stores `{id, name, slug}` under `hambry_restaurant_admin` in `localStorage`. Everything under `/restaurante/*` except `/restaurante/ingresar` lives in the `app/restaurante/(panel)/` route group, whose `layout.js` is the enforcement point (redirects to `/restaurante/ingresar` if no restaurant is selected) — the group's parentheses don't affect the URL, so `(panel)/page.js` is still `/restaurante`, `(panel)/pedidos/page.js` is `/restaurante/pedidos`, etc. `/restaurante/ingresar` deliberately sits *outside* the group so the gate doesn't redirect you away from the page that lets you pick a restaurant.
- **Repartidor**: no restaurant scoping needed — `/repartidor` shows ready/in-progress orders across every restaurant, since a real courier isn't tied to one vendor either.

There's no server-side check re-validating any of this on the API routes — same UX-guidance-only pattern as `vestra-demo`'s `AdminProvider`/`comanda-demo`'s `RoleProvider`.

**Cart is client-side and single-restaurant.** `CartProvider` (`components/CartProvider.js`) keeps `{restaurantId, restaurantName, deliveryFee, items}` in `localStorage` under `hambry_cart` — adding an item from a *different* restaurant than what's currently in the cart silently starts a fresh cart (see `addItem`'s `wouldSwitchRestaurant` check), but only after the customer confirms in `components/RestaurantMenu.js`'s inline warning banner (never a native `confirm()` — kept deliberate to stay easy to drive from browser automation and to look better than a native dialog).

**Order status is a shared state machine split across two actors.** `lib/orderStatus.js` defines the flow `RECEIVED → CONFIRMED → PREPARING → ON_THE_WAY → DELIVERED` (plus `CANCELLED`, reachable from `RECEIVED`/`CONFIRMED`) and two disjoint transition maps: `RESTAURANT_TRANSITIONS` (owns `RECEIVED→CONFIRMED→PREPARING`, plus cancel) and `COURIER_TRANSITIONS` (owns `PREPARING→ON_THE_WAY→DELIVERED`). `lib/orders.js` `updateOrderStatus(id, nextStatus, actor)` — called from `PATCH /api/orders/[id]` with `actor: "restaurant"` (from `/restaurante/pedidos`) or `actor: "courier"` (from `/repartidor`) — only allows a transition present in that actor's map, so a courier can never jump an order straight to `CONFIRMED` and a restaurant can never mark one `ON_THE_WAY`. The customer's `/pedido/[id]` tracking page and `/mis-pedidos` history just poll `GET /api/orders/[id]` every 4s (`components/OrderStatusTimeline.js` renders the stepper) — no websockets, this is a demo.

**Domain logic lives in `lib/`, not in route handlers**, mirroring `vestra-demo`: each feature has a `<Feature>Error(message, status)` class and route handlers just catch it and translate to a JSON response. `lib/orders.js` (`OrderError`), `lib/menuItems.js` (`MenuItemError`), `lib/menuCategories.js` (`MenuCategoryError`). `lib/format.js` has `formatCurrency` (ARS, whole pesos)/`formatDate`/`slugify`.

**Data model** (`prisma/schema.prisma`): `Restaurant → MenuCategory → MenuItem`, `Restaurant → Order → OrderItem`. `OrderItem` snapshots `itemName`/`unitPrice` at purchase time so a later menu edit doesn't corrupt past (simulated) order history. Money is a plain `Int` (whole ARS pesos), not Prisma `Decimal` — same rationale as `vestra-demo`. There is deliberately no `Customer`/`User` model: "my orders" (`/mis-pedidos`) is just a list of order ids the browser created, kept in `localStorage` (`lib/myOrders.js`), not a real account.

**No images anywhere.** There's no seeded stock photography and no upload flow (no Vercel Blob dependency, unlike `vestra-demo`/`comanda-demo`) — every restaurant/menu-item placeholder renders a cuisine-appropriate `lucide-react` icon on a cuisine-colored background instead (`lib/cuisineStyle.js` + `components/CuisineIcon.js`). This was a deliberate scope cut to avoid the extra Blob-store provisioning step during deploy.

**Route inventory**: Public storefront — `/inicio` (restaurant list, `?cocina=`/`?q=` filters), `/restaurantes/[slug]` (menu, add to cart), `/carrito` (cart + checkout form, posts to `/api/orders`), `/pedido/[id]` (tracking), `/mis-pedidos` (history) — all render `StoreHeader`. Restaurant admin — `/restaurante/ingresar` (pick restaurant), then the `(panel)` group: `/restaurante` (dashboard/counts), `/restaurante/pedidos` (order queue + status actions), `/restaurante/menu` (+ `/nuevo`, `/[id]` using the shared `components/MenuItemForm.js`), `/restaurante/categorias`. Courier — `/repartidor` (cross-restaurant ready/in-progress board). `app/api/<resource>/route.js` (+ `[id]/route.js`) are plain Route Handlers returning `{ error }` + a status code on failure.

**Demo reset**: `POST /api/demo/reset` (`lib/demoReset.js`) wipes every table and reseeds the fixed restaurants/menus from `lib/demoData.mjs`, exposed as a button on `/` (the role picker).

**Client conventions**: plain `.js` files, `"use client"` where needed, Tailwind utility classes, `lucide-react` icons, `@/*` path alias. UI copy is in Spanish (Argentina) — match this when adding strings.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

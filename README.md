# YG STORE

An Amazon-style shopping experience built with Angular 21 (standalone components + SSR), with its own light, teal-and-amber design — not a visual clone of Amazon. Product data is fetched live from the [DummyJSON](https://dummyjson.com) API: 194 products across 24 categories with real images, stock, discounts, ratings, and reviews.

## Features

- **Browse & discover** — home page with category tiles, trending deals, top-rated and randomized "just for you" sections
- **Search** — live debounced search suggestions in the header, full search results page
- **Product listing** — category filter, sort (price/rating), pagination
- **Product detail** — image gallery, price/discount, stock status, quantity stepper, specs, customer reviews, related products
- **Cart** — add/update/remove items, live subtotal/tax/shipping/total, persisted to `localStorage`
- **Wishlist** — save/remove products, move all to cart
- **Accounts** — sign up / sign in (mock, `localStorage`-backed — see note below)
- **Checkout** — guarded behind sign-in, prefilled from the logged-in user, simulated payment flow
- **Order history** — past orders per account, with a reusable order confirmation/detail view

## Tech stack

- Angular 21 (standalone components, signals, SSR via `@angular/ssr` + Express)
- RxJS for streams (cart/wishlist/orders as `BehaviorSubject`s)
- Plain CSS with a shared design-token system in `src/styles.css` (no UI framework)
- [DummyJSON](https://dummyjson.com) as the live product data source — no backend of our own
- Vitest for unit tests

## Getting started

```bash
npm install
npm start        # ng serve, http://localhost:4200
```

Other scripts:

```bash
npm run build     # production build
npm test          # run unit tests (Vitest)
npm run serve:ssr:ecommerce   # run the built SSR server (after npm run build)
```

## Project structure

```
src/app/
  service/         # ProductService, CartService, WishlistService, AuthService, OrderService, ToastService
  guard/            # authGuard (protects /checkout and /orders)
  interface/        # Product, CartItem, Order, User, etc.
  shared/           # product-card, star-rating, toast — reused across pages
  home/ products/ product-detail/ cart/ wishlist/
  login/ signup/ checkout/ orders/ order-confirmation/ page-error/
```

## Routes

| Path | Page | Notes |
|---|---|---|
| `/` | Home | Categories, deals, top-rated, "just for you" |
| `/products` | Product listing | `?category=`, `?q=`, `?sort=`, `?page=` |
| `/product/:id` | Product detail | |
| `/cart` | Cart | |
| `/wishlist` | Wishlist | |
| `/login`, `/signup` | Auth | |
| `/checkout` | Checkout | requires sign-in |
| `/orders` | Order history | requires sign-in |
| `/order-confirmation/:orderId` | Order confirmation / detail | |


# Project Development & Sprint Logs

---

# Sprint 1 — The Identity & Trust Module

**Focus:** Establish secure full-stack infrastructure, database connectivity, and a pluggable system for identity verification.

## ✅ What We Implemented

### Infrastructure & Core Security

* Initialized monorepo structure with dedicated `Frontend` and `Backend` folders.
* Established React-to-Express communication via Axios.
* Configured PostgreSQL 17 local instance, connection pooling, and `schema.sql` auto-sync via `init.js`.
* Integrated `bcryptjs` for one-way password hashing and implemented JWT-based session handling.
* Built `auth.middleware.js`, alongside `PublicRoute` and `PrivateRoute` React guards with auto-redirect logic.

### Trust & Verification System

* Implemented the Service-Adapter Pattern for the Identity module with a Mock vs Real toggle via `.env`.
* Refactored registration to a Freemium Trust Model (optional TC No) and built a Trust Verification modal.
* Developed backend verification comparing `full_name` and `tc_no`.

## ⚠️ Problems Faced & Fixes

* **Database "does not exist" error:** Fixed by manually initializing database via `psql`.
* **Module resolution crash:** Created placeholder exports for missing `identity.real.js`.
* **Profile endpoint missing `tc_no`:** Updated SELECT query in `user.routes.js`.
* **CORS errors & Path mismatches:** Corrected relative directory structures and standard paths using `path.join`.

## 🔄 Reflection

Established a secure vertical slice from Database to Frontend. Shifted trust from forced identity to optional verification, improving user onboarding and system credibility.

---

# Sprint 2 — The Asset Management & Discovery Module

**Focus:** Build a functional rental marketplace and professional asset management system.

## ✅ What We Implemented

### Item Management & Discovery Engine

* Built full Item CRUD functionality with an `image_url` column and dynamic `/item/:id` routing.
* Engineered a "Recently Added" live feed with multi-parameter filtering, server-side sorting, and a 400ms query debounce.
* Replaced native prompts with custom React modals and a Toast notification system.

### Dashboard & Data Integrity

* Developed "My Listings" using `LEFT JOIN` for live renter visibility, highlighting rented items with an "Unavailable" badge and grayscale UI.
* Implemented Soft Deletes (`is_deleted = TRUE`) to replace physical deletion, preserving history.

## ⚠️ Problems Faced & Fixes

* **`image_url` ignored in SQL:** Refactored `POST /api/items` to include full parameter destructuring.
* **API overload & UI state desync:** Implemented debounced querying and added backend guard clauses.
* **Seed data bug & Abrupt deletions:** Refactored SQL seeding and added a password-verified deletion modal.

## 🔄 Reflection

Marketplace evolved from simple listing to professional asset management system with transparency and audit capabilities.

---

# Sprint 3 — The Transaction & Escrow Module

**Focus:** Implement secure rental lifecycle, financial safeguards, and escrow-style transaction integrity.

## ✅ What We Implemented

### Rental Engine & Financial Safeguards

* Wrapped rental creation and item state updates in PostgreSQL `BEGIN/COMMIT` blocks.
* Added a user `balance` column, a mock funding endpoint, and strict server-side validation.
* Integrated `FOR UPDATE` row locking to prevent double-spending and double-booking.

### Escrow Handshake

* Designed a 3-state lifecycle (`active → returned_by_renter → completed`).
* Introduced an Owner-side “Confirm Receipt” requirement before asset release.
* Split Profile page into Active Rentals and Rental History, preventing deletion of rented items.

## ⚠️ Problems Faced & Fixes

* **Atomic State Desync Risk:** Enforced transaction wrapping to guarantee consistency.
* **ON DELETE CASCADE wiping history:** Replaced hard deletion with Soft Delete strategy.
* **Frontend 404 & Free Rental Loophole:** Registered `rental.routes.js` and added server-side balance checks.

## 🔄 Reflection

Transformed the platform from a listing application into a secure transaction system with ACID guarantees.

---

# Sprint 4 — The Notification & Governance Module

**Focus:** Implement social governance, asynchronous communication, and reputation quantifiers.

## ✅ What We Implemented

### Event Bus & Polling

* Developed a central `notifications` table to trigger alerts on Rental Creation and Returns.
* Built a global Notification Bell with real-time polling and "Actionable Notifications" deep-linking users to specific tasks.

### Social Trust System

* Engineered a dual-sided Renter ↔ Owner reputation system using `ReviewModal.jsx`.
* Enforced strict logic restricting reviews to completed rentals only.
* Integrated auto-cleanup hooks to delete review request prompts upon successful submission.

## ⚠️ Problems Faced & Fixes

* **Database Schema Desync:** Resolved `target_user_id` missing column error via `ALTER TABLE`.
* **Undefined Notification Names:** Refactored routing to join the `users` table for accurate message rendering.

## 🔄 Reflection

Moved the platform from a closed-loop system into a social ecosystem with measurable peer trust.

---

# Sprint 5 — The Real-Time Communication Module

**Focus:** Enable direct peer-to-peer communication and real-time handshakes.

## ✅ What We Implemented

### WebSockets & Chat Architecture

* Integrated Socket.io for bi-directional communication, routing users into context-aware "focus" rooms.
* Developed `ChatPage.jsx` with a dual-pane inbox linking messages to specific items.

### Read Receipts & Sync

* Built Read Receipts (Blue Ticks) utilizing "Focus/Blur" socket logic.
* Integrated dynamic SQL counts to update unread message totals.
* Added "Mark All as Read" and "Clear History" features to Navbar dropdowns.

## ⚠️ Problems Faced & Fixes

* **Ghost Review Prompts:** Fixed by adding `DELETE` operations to purge notifications.
* **Tick Color Contrast:** Adjusted Tailwind classes to ensure message status ticks are visible across chat bubble themes.

## 🔄 Reflection

Messaging reduced friction between users, transforming the platform into a true collaborative economy tool.

---

# Sprint 6 — The Production Readiness Module (Current)

**Focus:** Optimize dashboard performance, modularize architecture, and prepare system for real-world deployment.

## ✅ What We Implemented

### Component Decomposition & UI Scaling

* Decomposed monolithic pages into an atomic structure (`ProfileSidebar.jsx`, `MyListings.jsx`, `LendingHistory.jsx`).
* Implemented a Multi-Column Dashboard using responsive CSS Grid and `no-scrollbar` utility containers.
* Standardized modals across the platform.

## 📌 Planned Features

* Implement formal Dispute Resolution dashboard.
* Integrate real payment processing (Stripe/PayPal Mock).
* Add "Typing..." indicators to real-time chat.

## 🔄 Reflection

Modularizing the frontend has prepared the application for scale, making it easy to plug in the remaining enterprise-level features.

---
# Project Development & Sprint Logs

---

# Sprint 1 — Foundation & Secure Architecture

**Focus:** Establish full-stack infrastructure, database connectivity, and secure authentication.

## ✅ What We Implemented

### Infrastructure & Database
- Initialized monorepo structure with dedicated `Frontend` and `Backend` folders.
- Established React-to-Express communication via Axios.
- Configured PostgreSQL 17 local instance and connection pooling.
- Finalized core database schema for `Users`, `Items`, and `Rentals`.
- Implemented `init.js` to auto-sync `schema.sql` on server startup for environment portability.

### Architecture
- Implemented the Service-Adapter Pattern for Identity module (Mock vs Real).
- Structured backend with modular routes, services, and middleware.

### Authentication & Security
- Integrated `bcryptjs` for one-way password hashing.
- Implemented JWT-based session handling using `jsonwebtoken`.
- Built:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Developed `auth.middleware.js` to protect private routes.
- Implemented `PublicRoute` and `PrivateRoute` guards in React.
- Added auto-redirect logic (e.g., logged-in users redirected from `/login` to `/profile`).

## ⚠️ Problems Faced & Fixes

- **Database "does not exist" error**
  - Fixed by manually initializing database via `psql`.

- **Module resolution crash (missing identity.real.js)**
  - Created placeholder exports to satisfy dependency requirements.

- **Redundant authentication states**
  - Implemented declarative route guarding in `App.jsx`.

- **Relative path mismatches in init.js**
  - Standardized paths using `path.join(__dirname, ...)`.

## 🔄 Reflection

Established a secure vertical slice from Database → Backend → Frontend.  
System foundation is modular, secure, and environment-portable.

---

# Sprint 2 — Marketplace Core & Asset Management

**Focus:** Build a functional rental marketplace and professional asset management system.

## ✅ What We Implemented

### Item Management
- Added `image_url` column to `items` table.
- Built full Item CRUD functionality.
- Implemented:
  - `GET /api/items`
  - `GET /api/items/:id`
- Created dynamic `/item/:id` frontend routing.

### UX & Interface
- Developed high-fidelity Item Detail page.
- Refactored homepage into "Recently Added" live feed.
- Replaced native prompts with custom React modals.
- Built Toast notification system for feedback.

### Discovery Engine
- Multi-parameter filtering (search, category, price cap).
- Server-side SQL sorting (price, newest, oldest).
- Implemented debouncing (400ms delay) to prevent API overload.

### Owner Dashboard Enhancements
- "My Listings" with live renter and due-date visibility (LEFT JOIN).
- Lending History module with cumulative earnings.
- Display of rented items with "Unavailable" badge and grayscale UI.
- Connected Verified badge to `tc_no` database field.

### Data Integrity Improvements
- Implemented Soft Deletes (`is_deleted = TRUE`) instead of physical deletion.

## ⚠️ Problems Faced & Fixes

- **`image_url` ignored in SQL insertion**
  - Refactored `POST /api/items` to include full parameter destructuring.

- **Account deletion UX too abrupt**
  - Added password-verified confirmation modal.

- **Seed data visibility issue ("Shadow Item" bug)**
  - Refactored SQL seeding to dynamically assign correct user IDs.

- **Frontend API overload**
  - Implemented debounced querying logic.

- **UI state desync for rented items**
  - Added backend guard clauses and frontend filtering logic.

## 🔄 Reflection

Marketplace evolved from simple listing to professional asset management system with transparency and audit capabilities.

---

# Sprint 3 — Transaction Engine & Financial Integrity

**Focus:** Implement secure rental lifecycle, financial safeguards, and escrow-style transaction integrity.

## ✅ What We Implemented

### Rental Creation Engine
- Implemented `POST /api/rentals`.
- Wrapped rental creation and item status update inside a PostgreSQL transaction block (`BEGIN/COMMIT`).
- Prevented:
  - Self-renting
  - Double-booking of items
- Developed dynamic duration picker on the Item Detail page with real-time total price calculation.

### Financial System
- Added `balance` column to users.
- Implemented mock funding endpoint (`/api/user/add-funds`).
- Enforced strict server-side balance validation before rental authorization.
- Integrated `FOR UPDATE` row locking to prevent double-spending during concurrent rental attempts.

### Escrow Handshake (Return Confirmation System)
- Implemented `PUT /api/rentals/:id/return`.
- Designed 3-state lifecycle:
  - `active → returned_by_renter → completed`
- Introduced Owner-side “Confirm Receipt” requirement before:
  - Item becomes available again
  - Rental is marked completed
- Ensured atomic updates between rental status and item availability.

### Dashboard & History Persistence
- Split Profile page into:
  - Active Rentals
  - Rental History
- Preserved historical rental records via Soft Deletes (`is_deleted = TRUE` on items).
- Prevented deletion of rented items through backend guard clauses.

## ⚠️ Problems Faced & Fixes

- **Frontend 404 ("Ghost URL")**
  - Created `rental.routes.js` and registered it in `server.js`.

- **Atomic State Desynchronization Risk**
  - Enforced transaction wrapping to guarantee consistency.

- **ON DELETE CASCADE wiping rental history**
  - Replaced hard deletion with Soft Delete strategy.

- **Owners deleting currently rented items**
  - Added backend validation to block archival if status = `rented`.

- **Free Rental Loophole**
  - Implemented server-side balance check (`balance < total_price`).

## 🔄 Reflection

This sprint transformed the platform from a listing application into a secure transaction system.  
ACID guarantees, row locking, and escrow-style confirmation logic ensure financial and asset integrity.

---

# Sprint 4 — Trust & Identity Layer

**Focus:** Strengthen credibility and introduce official verification mechanisms.

## ✅ What We Implemented

- Refactored registration to remove mandatory TC No (Freemium Trust Model).
- Integrated IdentityService adapter with Mock / Real toggle via `.env`.
- Developed backend verification comparing `full_name` and `tc_no`.
- Built Trust Verification modal in Profile page.
- Executed database-wide TC field reset for clean testing.

## ⚠️ Problems Faced & Fixes

- **Profile endpoint missing tc_no**
  - Updated SELECT query in `user.routes.js`.

- **CORS errors after refactor**
  - Identified backend crash due to incorrect service path.
  - Corrected relative directory structure.

- **bcrypt import missing in delete route**
  - Standardized imports across route files.

## 🔄 Reflection

Shifted trust from forced identity to optional value-added verification, improving user onboarding and system credibility.

---

This is an excellent way to maintain a "Living Document" of your progress. I have updated the logs to reflect the massive progress we've made on the **Social Trust Layer** and the **Architectural Refactor**.

I have moved the **Planned** sections forward to accommodate our new **Sprint 6 (UI/UX Refinement)** which turned out to be a major milestone in modularizing the app.

---

# Project Development & Sprint Logs

---

# Sprint 1 — Foundation & Secure Architecture

**Focus:** Establish full-stack infrastructure, database connectivity, and secure authentication.
*(Details remain as previously documented)*

---

# Sprint 2 — Marketplace Core & Asset Management

**Focus:** Build a functional rental marketplace and professional asset management system.
*(Details remain as previously documented)*

---

# Sprint 3 — Transaction Engine & Financial Integrity

**Focus:** Implement secure rental lifecycle, financial safeguards, and escrow-style transaction integrity.
*(Details remain as previously documented)*

---

# Sprint 4 — Trust & Identity Layer

**Focus:** Strengthen credibility and introduce official verification mechanisms.
*(Details remain as previously documented)*

---

# Sprint 5 — Governance, Social Trust & Notification Engine

**Focus:** Implement social governance, asynchronous communication, and reputation quantifiers.

## ✅ What We Implemented

### Asynchronous Notification Engine

* Developed a central `notifications` table to act as the platform’s Event Bus.
* Integrated backend hooks to trigger notifications on:
* **Rental Creation:** Notifying owners of new bookings.
* **Return Confirmation:** Notifying renters that their return was accepted.


* Built a global **Notification Bell** in the Navbar with real-time polling (45s intervals).
* Implemented "Actionable Notifications" that deep-link users to specific tasks (e.g., Rating Modals).

### Social Trust (Rating & Review System)

* Engineered a dual-sided reputation system (Renter ↔ Owner).
* Developed `ReviewModal.jsx` with tactile star-rating interactions and hover states.
* Enforced strict business logic:
* Reviews only permitted for `completed` rentals.
* One review per participant per transaction (SQL Unique Constraint).


* Implemented **Public Profiles** (`/user/:id`) to allow users to verify a peer's reputation before transacting.
* Developed dynamic SQL joins to calculate **Average Ratings** and **Review Counts** on the fly.

## ⚠️ Problems Faced & Fixes

* **Decimal Precision (Floating Point Ghost)**
* Fixed total earnings displaying infinite decimals using `.toFixed(2)`.


* **Database Schema Desync**
* Resolved `target_user_id` missing column error by executing `ALTER TABLE` migrations.


* **Undefined Notification Names**
* Refactored `rental.routes.js` to join with the `users` table during transactions to ensure notification messages contain actual names instead of `undefined`.



## 🔄 Reflection

The platform now moves from a "closed loop" transaction system to a "social ecosystem." Users are no longer anonymous entities; they are peers with measurable trust scores.

---

# Sprint 6 — UI/UX Refinement & Modular Architecture

**Focus:** Optimize dashboard performance, modularize large components, and improve data density.

## ✅ What We Implemented

### Architectural Refactor (Component Decomposition)

* Decomposed the 500+ line `Profile.jsx` into a modular "Atomic" structure.
* Created dedicated sub-components in `src/components/profile/`:
* `ProfileSidebar.jsx` (Identity & Wallet)
* `BorrowedItems.jsx` (Active Renter Transactions)
* `MyListings.jsx` (Active Owner Inventory)
* `UserReviews.jsx` (Social Reputation Feed)
* `LendingHistory.jsx` (Financial Records)



### Dashboard UX Optimization

* Implemented a **Multi-Column Dashboard Layout** using a responsive CSS Grid.
* Transformed the "Infinite Scroll" profile into a high-density information cockpit.
* Integrated **Scrollable UI Containers** with `no-scrollbar` utilities to handle large datasets without breaking the page layout.
* Standardized modal interactions for Account Deletion, Verification, and Item Archiving.

## 🔄 Reflection

By modularizing the frontend now, we have prepared the application for scale. Adding new features (like Messaging or Disputes) is now a matter of plugging in new components rather than expanding a "Mega-File."

---

# Sprint 7 — Real-Time Messaging & Communication (Current)

**Focus:** Enable direct peer-to-peer communication and real-time handshakes.

## 📌 Planned Features

* Implement `messages` database schema with item-context linking.
* Integrate **Socket.io** for real-time, low-latency chat.
* Build the "Chat Inbox" UI.
* Add "Message Owner" triggers on Item Detail pages.

---

# Sprint 8 — Production Readiness & Automation (Planned)

**Focus:** Prepare system for real-world deployment.
*(Planned features including Stripe integration, Cron jobs, and Dockerization)*

---

# Sprint 9 — Testing & Quality Assurance (Planned)

**Focus:** Ensure reliability, maintainability, and system robustness.
*(Planned features including Jest unit testing and security audits)*

---

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
- **Database "does not exist" error:** Fixed by manually initializing database via `psql`.
- **Module resolution crash (missing identity.real.js):** Created placeholder exports to satisfy dependency requirements.
- **Redundant authentication states:** Implemented declarative route guarding in `App.jsx`.
- **Relative path mismatches in init.js:** Standardized paths using `path.join(__dirname, ...)`.

## 🔄 Reflection
Established a secure vertical slice from Database → Backend → Frontend. System foundation is modular, secure, and environment-portable.

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
- **`image_url` ignored in SQL insertion:** Refactored `POST /api/items` to include full parameter destructuring.
- **Account deletion UX too abrupt:** Added password-verified confirmation modal.
- **Seed data visibility issue ("Shadow Item" bug):** Refactored SQL seeding to dynamically assign correct user IDs.
- **Frontend API overload:** Implemented debounced querying logic.
- **UI state desync for rented items:** Added backend guard clauses and frontend filtering logic.

## 🔄 Reflection
Marketplace evolved from simple listing to professional asset management system with transparency and audit capabilities.

---

# Sprint 3 — Transaction Engine & Financial Integrity

**Focus:** Implement secure rental lifecycle, financial safeguards, and escrow-style transaction integrity.

## ✅ What We Implemented

### Rental Creation Engine
- Implemented `POST /api/rentals`.
- Wrapped rental creation and item status update inside a PostgreSQL transaction block (`BEGIN/COMMIT`).
- Prevented self-renting and double-booking of items.
- Developed dynamic duration picker on Item Detail page with real-time total price calculation.

### Financial System
- Added `balance` column to users.
- Implemented mock funding endpoint (`/api/user/add-funds`).
- Enforced strict server-side balance validation before rental authorization.
- Integrated `FOR UPDATE` row locking to prevent double-spending during concurrent rental attempts.

### Escrow Handshake (Return Confirmation System)
- Implemented `PUT /api/rentals/:id/return`.
- Designed 3-state lifecycle: `active → returned_by_renter → completed`.
- Introduced Owner-side “Confirm Receipt” requirement before item availability and rental completion.
- Ensured atomic updates between rental status and item availability.

### Dashboard & History Persistence
- Split Profile page into: Active Rentals and Rental History.
- Preserved historical rental records via Soft Deletes.
- Prevented deletion of rented items through backend guard clauses.

## ⚠️ Problems Faced & Fixes
- **Frontend 404 ("Ghost URL"):** Created `rental.routes.js` and registered it in `server.js`.
- **Atomic State Desynchronization Risk:** Enforced transaction wrapping to guarantee consistency.
- **ON DELETE CASCADE wiping rental history:** Replaced hard deletion with Soft Delete strategy.
- **Free Rental Loophole:** Implemented server-side balance check.

## 🔄 Reflection
This sprint transformed the platform from a listing application into a secure transaction system with ACID guarantees.

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
- **Profile endpoint missing tc_no:** Updated SELECT query in `user.routes.js`.
- **CORS errors after refactor:** Identified backend crash due to incorrect service path; corrected relative directory structure.
- **bcrypt import missing in delete route:** Standardized imports across route files.

## 🔄 Reflection
Shifted trust from forced identity to optional verification, improving user onboarding and system credibility.

---

# Sprint 5 — Governance, Social Trust & Notification Engine

**Focus:** Implement social governance, asynchronous communication, and reputation quantifiers.

## ✅ What We Implemented

### Asynchronous Notification Engine
- Developed central `notifications` table to act as the platform’s Event Bus.
- Integrated backend hooks to trigger notifications on Rental Creation and Return Confirmation.
- Built global Notification Bell in the Navbar with real-time polling.
- Implemented "Actionable Notifications" deep-linking users to specific tasks (e.g., Rating Modals).

### Social Trust (Rating & Review System)
- Engineered dual-sided reputation system (Renter ↔ Owner).
- Developed `ReviewModal.jsx` with tactile star-rating interactions.
- Enforced strict logic: reviews permitted only for `completed` rentals; one review per participant per transaction.
- **Auto-Cleanup Logic:** Integrated backend hooks to delete "Review Request" notifications upon review submission.

## ⚠️ Problems Faced & Fixes
- **Database Schema Desync:** Resolved `target_user_id` missing column error by executing `ALTER TABLE` migrations.
- **Undefined Notification Names:** Refactored `rental.routes.js` to join with `users` table to ensure notification messages contain actual names.

## 🔄 Reflection
The platform now moves from a "closed loop" system to a social ecosystem where users are peers with measurable trust scores.

---

# Sprint 6 — UI/UX Refinement & Modular Architecture

**Focus:** Optimize dashboard performance and modularize large components.

## ✅ What We Implemented

### Architectural Refactor (Component Decomposition)
- Decomposed the large `Profile.jsx` into an atomic structure in `src/components/profile/`.
- Created modular sub-components: `ProfileSidebar.jsx`, `BorrowedItems.jsx`, `MyListings.jsx`, `UserReviews.jsx`, and `LendingHistory.jsx`.

### Dashboard UX Optimization
- Implemented a Multi-Column Dashboard Layout using responsive CSS Grid.
- Integrated Scrollable UI Containers with `no-scrollbar` utilities.
- Standardized modal interactions for Account Deletion, Verification, and Item Archiving.

## 🔄 Reflection
Modularizing the frontend has prepared the application for scale, making it easy to plug in new features without expanding a single file.

---

# Sprint 7 — Real-Time Messaging & Communication Layer

**Focus:** Enable direct peer-to-peer communication and real-time handshakes.

## ✅ What We Implemented

### Real-Time Infrastructure
- Integrated **Socket.io** for low-latency, bi-directional communication.
- Implemented **Room Management:** Users join private user rooms and specific context-aware "focus" rooms for state tracking.

### Messaging Logic & UX
- Developed `ChatPage.jsx` featuring a dual-pane inbox and context-aware messaging (linked to specific items).
- **Read Receipts (Blue Ticks):** Implemented "Focus/Blur" logic via Socket.io. Messages are marked `read` instantly if focused; otherwise, they trigger a notification.
- **Unread Counters:** Integrated dynamic SQL counts into the conversation list to show pending message totals per user.

### Global Notification Refinement
- Added "Mark All as Read" and "Clear History" (Trash Bin) functionality to the Navbar dropdown.
- Implemented persistent unread state synchronization between database and frontend UI.

## ⚠️ Problems Faced & Fixes
- **Ghost Review Prompts:** Fixed by adding `DELETE` operation in `review.routes.js` to purge specific notifications upon successful review submission.
- **Tick Color Contrast:** Adjusted Tailwind classes in `ChatPage.jsx` to ensure message status ticks are visible against dark and light message bubbles.

## 🔄 Reflection
Messaging transforms the platform into a collaborative economy tool, reducing friction between renters and owners.

---

# Sprint 8 — Financial Scaling & Production Readiness (Current)

**Focus:** Prepare system for real-world deployment.

## 📌 Planned Features
- Implement formal Dispute Resolution dashboard.
- Integrate real payment processing (Stripe/PayPal Mock).
- Add "Typing..." indicators to real-time chat.
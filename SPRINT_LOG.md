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

# Sprint 5 — Platform Governance, Social Trust & Risk Management

**Focus:** Introduce moderation mechanisms, social governance systems, and dispute resolution architecture.

## ✅ What We Implemented / Designed

### Rating & Review System (Social Governance Layer)
- Designed post-completion rating flow tied to completed rentals.
- Enabled:
  - Renter → Owner ratings
  - Owner → Renter ratings
- Ensured ratings can only be submitted after `completed` rental state.
- Prevented duplicate reviews per rental.
- Integrated average rating calculation on user profiles.
- Displayed rating badges in marketplace listings to increase trust visibility.

> Ratings act as the primary moderation tool in the P2P ecosystem, reducing reliance on centralized enforcement.

---

### Dispute Resolution System
- Designed dispute initiation endpoint tied to active rentals.
- Introduced dispute states:
  - `open`
  - `under_review`
  - `resolved`
  - `rejected`
- Automatically freezes rental status during dispute.
- Logs dispute messages and timestamps for audit purposes.

---

### Admin Moderation Panel
- Defined Admin role with elevated permissions.
- Admin capabilities:
  - View disputes
  - Update dispute status
  - Suspend users
  - Archive listings
- Implemented role-based access control middleware.

---

### Insurance Logic Modeling
- Defined claim workflow for damaged items.
- Structured damage-report submission process.
- Linked insurance claims to dispute lifecycle.
- Designed conditional payout logic (future payment integration compatible).

---

### Escrow Handshake Documentation
- Officially documented the 3-state return confirmation system as part of governance safeguards.
- Clarified platform rule:
  - Funds and asset state finalize only after Owner confirms receipt.
- Established foundation for automated arbitration rules.

## 🔄 Reflection

Governance was approached through layered protection:
1. Social Trust (Ratings)
2. Automated Escrow Handshake
3. Structured Dispute Resolution
4. Admin Oversight

This sprint formalizes how the platform handles risk, accountability, and community trust without relying solely on centralized enforcement.


---

# Sprint 6 — Production Readiness & Automation (Planned)

**Focus:** Prepare system for real-world deployment.

## 📌 Planned Features

- Real payment integration (Stripe / iyzico equivalent).
- Escrow-style payment holding logic.
- Webhook processing.
- Email integration for transactional notifications.
- In-app notification system.
- Cron jobs for:
  - Rental expiry
  - Overdue handling
  - Automated balance updates
- Docker containerization.
- CI/CD pipeline setup.
- Environment staging configuration.

---

# Sprint 7 — Testing & Quality Assurance (Planned)

**Focus:** Ensure reliability, maintainability, and system robustness.

## 📌 Planned Features

- Unit testing (Jest).
- Integration testing for API endpoints.
- Transaction failure simulations.
- Edge case validation.
- Security testing (auth bypass attempts).
- Load testing scenarios.
- Test coverage reporting.
- Structured bug tracking documentation.

---

# Overall Status

Core Marketplace, Transaction Engine, and Trust Layer implemented.  
Governance, Production Hardening, and Testing phases planned for iterative expansion.

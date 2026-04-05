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

# Sprint 6 — The Production Readiness Module

**Focus:** Optimize dashboard performance, secure asset condition, and integrate formal governance models for enterprise deployment.

## ✅ What We Implemented

### Governance & Dispute Resolution
* **Trust & Safety Engine:** Built a dedicated `/admin` dashboard protected by a bespoke backend validation middleware.
* **Dispute Escalation:** Implemented decision-grade logic where admins judge Side-by-Side "Before & After" photo condition logs to finalize escrow outcomes.

### Media & Asset Evidence
* **Condition Logging:** Enforced users (Renters & Owners) to log the physical state of equipment during handovers and returns.
* **Canvas Compression:** Developed a browser-native image compression utility (`imageCompression.js`) to minimize high-resolution file weight before Cloudinary persistence.

### UX Scaling & Real-World Simulation
* **Mock Checkout Flow:** Created a premium-feel `PaymentModal` with card masking and MM/YY validation templates.
* **Component Refactor:** Decomposed the profile into an atomic structure of reusable atoms, including `ProfileSidebar.jsx` and `MyListings.jsx`.

## ⚠️ Problems Faced & Fixes
* **Network Payload Congestion:** Solved via frontend-side Canvas resizing and quality reduction.
* **Action State Management:** Stabilized complex profile state machine using localized modal coordination logic in `Profile.jsx`.
* **Database Schema Synchronization:** Fixed 500 errors by writing a hotfix migration script to add missing schema fields (`resolution`, `admin_notes`) that initial `CREATE TABLE IF NOT EXISTS` commands had bypassed.
* **Wildcard Routing Collisions:** Prevented React Router from directing edge-case URLs into numeric backend query paths, mitigating DB casting errors through explicit integer checking and Error Boundaries.
* **Privilege Escalation Exposure:** Hardened the admin upgrade endpoint by entirely decoupling the static master-key and relying on strict `.env` dependency parsing.

## 🔄 Reflection
The system is now vertically scaled to handle complex P2P marketplaces with high friction, high trust, and high credibility requirements. Ready for final evaluation.

---

# Sprint 7 — Defense in Depth & Quota Protection

**Focus:** Neutralize edge-case exploits, protect cloud quotas, and block automated abuse.

## ✅ What We Implemented

### Infrastructure Protection
* **Rate Limiting (DoS Defense):** Configured Express middleware to cap API traffic (150 requests per 15 minutes per IP), immediately walling off brute-force testing and web-scraping bots.
* **Canvas Pre-Processing:** Upgraded the listing creation flow (`ListItem.jsx`) to a Cloudinary-powered drag-and-drop zone. High-fidelity images are flattened and compressed locally in the browser to strictly prevent adversaries from intentionally depleting free-tier S3/Cloud Storage limits.

### Session Resilience
* **Zero-Trust Identity Sync:** Hardened the backend JWT decoder middleware (`auth.middleware.js`). Valid tokens are now secondary-checked against the PostgreSQL runtime memory. The system now cleanly catches and flushes "Zombie Tokens" (sessions belonging to deleted/wiped users), completely eliminating infinite loop UI crashing.

## 🔄 Reflection
The architecture is now robust not just against happy paths, but against adversarial interaction.

---

# Sprint 8 — High-Trust Operations & Deployment Sync

**Focus:** Close the final gaps in P2P trust mechanisms and synchronize schema migrations to the live production environments.

## ✅ What We Implemented

### Identity Singularity
* **Hardware-Level Uniqueness:** Enforced a `UNIQUE` constraint on the `tc_no` column in PostgreSQL, neutralizing identity-cloning across multiple accounts. The backend verification API now actively intercepts duplicate TCKNs.

### The True "Handover Handshake"
* **Pre-Flight Accountability:** We completely dismantled the "Word of Mouth" vulnerability. Rentals now default to a `pending_handover` state on creation.
* **Dual-Verification Funnel:** The Renter must physically receive the item and click **"Confirm Receipt"**. This triggers the `ConditionUploadModal`, forcing the renter to supply *Pre-Flight Evidence* (`stage: handover`), anchoring the item's starting condition definitively into the system.
* **Stage Alignment Fix:** Corrected a critical mapping distortion where post-flight returns were cross-contaminating pre-flight staging in the Admin Dashboard query logs.

### UI/UX Immersion
* **Integrated Dispute Modal:** Replaced the legacy window-prompt `window.prompt` with a full-context, high-fidelity `DisputeModal`, wrapping serious actions in professional UX.
* **DevOps Balancing:** Loosened the `express-rate-limit` from 150 to 500 requests to accommodate aggressive testing sprints without locking out administrators.

## 🔄 Reflection
OmniRent has successfully transitioned from an experimental sandbox into a hardened, production-capable financial escrow platform, where every stage of an item's lifecycle mathematically protects both the owner and the renter.

---

# Sprint 9 — Escrow Fortress & Legal Compliance

**Focus:** Eradicate state collision bugs, secure the Escrow payouts against concurrent disputes, and integrate proactive legal consent.

## ✅ What We Implemented

### The Escrow Fortress (State-Lock Matrix)
* **Ghost Inventory Lock:** Re-engineered the "Archive" function. Owners can no longer delete items that are currently in an active transaction or dispute, ensuring active evidence is physically bolted down for Administrators.
* **Double-Payout Immunity:** Intercepted the `PUT /confirm-receipt` Escrow release endpoint. If there is an `open` dispute in the system from either party, the transaction explicitly throws a hard error and freezes. The Escrow flow physically pauses until the Admin ticket is resolved.
* **Symmetrical Owner Disputes:** Fixed a loophole where Owners could dispute a returned item without providing evidence. Owners are now forced through the `ConditionUploadModal` to provide "Post-Flight" camera documentation *before* unlocking the `DisputeModal` text submission.
* **Single-Ticket Enforcement:** Blocked users from spamming the dispute endpoint, locking the relationship to an absolute 1:1 `rental_id` to `dispute` configuration.

### Proactive Legal Connectivity
* **Active Consent Hooks:** Injected explicit, legally binding UI warnings into the four major platform arteries: User Registration, Item Publishing, Rental Checkout, and Evidence Uploading.
* **Legal Policy Architecture:** Built and deployed formal, aesthetic static routes for *Terms of Service*, *Privacy Policy*, and *Usage Agreements*, clarifying OmniRent's exact stance on identity verification and physical asset liability.
* **Global Ecosystem:** Implemented a unified system footer to seamlessly ground the UI while providing persistent legal navigation.

## 🔄 Reflection
OmniRent's backend is now mathematically immune to overlapping matrix state errors. The platform has officially reached elite physical Escrow functionality standards.
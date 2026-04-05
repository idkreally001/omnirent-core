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

# Sprint 8 — Production Readiness & Governance Refinement

**Focus:** Implement formal dispute resolution, secure photo evidence, and high-fidelity simulated checkout.

## ✅ What We Implemented

### Trust & Identity (Official Calibration)
- **Mathematical TCKN Algorithm:** Replaced mock identity logic with a robust checksum-based algorithm that mirrors the official Turkish Identity validation rules (Mod 11).

### Financial Mock Architecture
- **Mock Checkout Interface:** Developed a dedicated `PaymentModal` with card number formatting, masked CVC inputs, and MM/YY validation to simulate a real-world checkout experience.
- **Transaction Processing Time:** Integrated an intentional 1.5s delay to emulate API handshakes with payment gateways.

### Media & Dispute Management
- **Condition Logging (Pre-Flight/Post-Flight):** Built a photo-evidence system (`ConditionUploadModal.jsx`) that enforces users to upload asset condition images during handovers and returns.
- **Browser Image Compression:** Implemented an HTML5 Canvas-based utility to compress image file size before Cloudinary upload.
- **Cloudinary Integration:** Integrated the Cloudinary SDK for static asset persistence.
- **Admin Dashboard & Dispute Resolution:**
  - Created a secure `/admin` portal protected by `admin.middleware.js`.
  - Built an interface for admins to compare "Before & After" photos side-by-side.
  - Engineered **Admin Broadcast Intercepts**, instantly notifying all logged-in Admins platform-wide if a dispute is raised.
  - Implemented decision hooks: **Refund Renter** or **Pay Owner**, seamlessly distributing frozen escrow funds based on ruling.
  
### UI Polish & Discovery
- **Streamlined Landing Page:** Redesigned `Home.jsx` with a clean, minimalist, search-first interface, ensuring users can find and rent tools without aggressive marketing copy.
- **Omnipresent Search:** Engineered a persistent query tracker in the global Navbar that instantly synchronizes and routes into the Browse library.
- **Accountability UX:** Implemented a real-time `isOverdue` function that cross-references `return_date` with the current system time, flagging active rentals with a red "OVERDUE" pulsating UI badge.

## ⚠️ Problems Faced & Fixes
- **Large Image Upload Crashes:** Fixed by implementing frontend Canvas compression.
- **State Leakage in Actionable Modals:** Standardized modal reset logic in the Parent `Profile.jsx` coordinator.
- **Mock Fallback Logic:** Included fallback constants for when Cloudinary credentials are not present in `.env`.
- **Database Schema Validation Failures:** Fixed Admin Dashboard 500 errors by writing hot-migration scripts to inject newly drafted fields (`resolution`, `admin_notes`) bypassing faulty `CREATE IF NOT EXISTS` defaults.
- **Frontend Wildcard Interception:** React Router misidentified `/user/escalate` browser queries as a Public Profile lookup, causing fatal db-casting backend crashes. Solved via integer-first validation and React Error Boundaries.
- **Security Key Hardcoding:** Patched an exploitation risk by stripping the fallback logic from the admin escalation endpoint and making it strictly reliant on `process.env.ADMIN_SECRET`.

## 🔄 Reflection
The platform is now fully production-ready. It manages zero-trust identity requirements, physically secures transactions via escrow, maintains asynchronous peer-to-peer accountability, and manages dispute governance centrally. The application successfully embodies a modern, resilient sharing-economy tool.

---

# Sprint 9 — Final Security Hardening & Exploit Prevention

**Focus:** Patching session management, preventing cloud quota depletion, and protecting against brute-force/DoS attacks.

## ✅ What We Implemented

### Exploit Prevention & Rate Limiting
- **The "Wall" (Rate Limiting):** Integrated `express-rate-limit` middleware directly into `server.js`, capping API requests to 150 per 15-minute window per IP. This entirely neutralizes brute-force login attempts and automated scraping bots, ensuring a stable infrastructure.
- **Client-Side Media Compression:** Upgraded the `ListItem.jsx` page from manual URL inputs to an integrated Cloudinary drag-and-drop zone. High-resolution images are compressed via native HTML5 Canvas *before* uploading, preventing malicious actors from depleting free-tier bucket quotas with massive file uploads.

### Session Management & Integrity
- **Zombie Token Elimination:** Upgraded the `auth.middleware.js` to cross-reference decoded JWT identities against the live PostgreSQL database. Eradicated edge-case "flickering" redirect loops caused when old browser tokens attempt to map to wiped/deleted database users.

## 🔄 Reflection
These final patches complete the zero-trust paradigm. The platform is not only architecturally robust and visually appealing but now fortified against common web vulnerabilities and resource abuse.
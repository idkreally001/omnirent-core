# **OmniRent: Comprehensive Development & Sprint Logs**

## **Sprint 1: The Identity & Trust Module**
**Primary Focus:** Engineering secure full-stack infrastructure, establishing relational database connectivity, and implementing a pluggable identity verification system.

### **✅ Core Deliverables & Implementation**
* **Monorepo Architecture:** Initialized a modular repository structure with dedicated `Frontend` and `Backend` environments.
* **API Bridge:** Established a standardized communication layer between React and Express utilizing the Axios library.
* **Persistence Layer:** Configured a PostgreSQL 17 instance with connection pooling and an `init.js` automation script for `schema.sql` synchronization.
* **Identity Security:** Integrated `bcryptjs` for one-way password hashing and `jsonwebtoken` (JWT) for secure, stateless session management.
* **Access Control:** Developed `auth.middleware.js` alongside React-side `PublicRoute` and `PrivateRoute` guards with intelligent auto-redirect logic.
* **Service-Adapter Pattern:** Engineered a pluggable Identity module allowing the system to toggle between Mock and Real verification via `.env`.
* **Freemium Trust Model:** Refactored the registration flow to support optional identity verification and built a dedicated Trust Verification modal.
* **Verification Logic:** Developed backend verification routines to compare `full_name` and `tc_no` data points against the identity adapter.

### **⚠️ Technical Blockers & Resolutions**
* **Initialization Error:** Resolved a "database does not exist" failure by standardizing the manual initialization process via `psql`.
* **Module Resolution:** Fixed a system crash caused by a missing `identity.real.js` file by implementing stable placeholder exports.
* **Query Gaps:** Addressed a profile endpoint failure by updating the SQL `SELECT` query in `user.routes.js` to include the `tc_no` field.
* **Environment Mapping:** Resolved CORS errors and path mismatches by standardizing directory structures using Node’s `path.join` utility.

### **🔄 Sprint Reflection**
This sprint successfully established a secure vertical slice from the database to the frontend. By shifting from forced identity to a voluntary verification model, we successfully optimized user onboarding while maintaining long-term system credibility.

---

## **Sprint 2: The Asset Management & Discovery Module**
**Primary Focus:** Development of a functional peer-to-peer rental marketplace and a professional-grade asset management dashboard.

### **✅ Core Deliverables & Implementation**
* **Asset CRUD Engine:** Developed a full CRUD lifecycle for rental items, including `image_url` support and dynamic frontend routing via `/item/:id`.
* **Discovery Engine:** Engineered a "Recently Added" live feed featuring multi-parameter filtering, server-side sorting, and a 400ms query debounce.
* **UI Modernization:** Replaced native browser prompts with custom React modals and integrated a Toast notification system for tactile feedback.
* **Inventory Dashboard:** Developed the "My Listings" interface using SQL `LEFT JOIN` operations to provide real-time renter and due-date visibility.
* **Availability State:** Implemented an "Unavailable" badge and grayscale UI filters for rented items to ensure marketplace transparency.
* **Data Auditing:** Implemented a Soft Delete strategy (`is_deleted = TRUE`) to ensure transaction history is preserved when items are removed.

### **⚠️ Technical Blockers & Resolutions**
* **SQL Parameters:** Fixed a bug where `image_url` was ignored during insertion by refactoring the `POST /api/items` parameter destructuring.
* **Network Load:** Eliminated API overload and UI state desync by implementing debounced querying logic and backend guard clauses.
* **UX Friction:** Addressed abrupt account deletions by adding a password-verified confirmation modal to the user settings.
* **Seeding Logic:** Resolved a seed data visibility issue by refactoring SQL scripts to dynamically assign valid user IDs.

### **🔄 Sprint Reflection**
The marketplace evolved from a simple listing application into a professional asset management system, emphasizing data integrity and a permanent audit trail.

---

## **Sprint 3: The Transaction & Escrow Module**
**Primary Focus:** Implementation of a secure rental lifecycle, financial safeguards, and ACID-compliant escrow-style transaction integrity.

### **✅ Core Deliverables & Implementation**
* **Atomic Transactions:** Wrapped rental creation and item state updates in PostgreSQL `BEGIN/COMMIT` blocks to ensure data consistency.
* **Financial Guardrails:** Integrated a user `balance` system, built a mock funding endpoint, and enforced strict server-side validation for all rentals.
* **Race Condition Defense:** Integrated `FOR UPDATE` row locking in the database to prevent double-spending and double-booking during concurrent attempts.
* **Escrow Handshake:** Designed a 3-state rental lifecycle consisting of `active`, `returned_by_renter`, and `completed` states.
* **Receipt Confirmation:** Introduced an Owner-side “Confirm Receipt” requirement to ensure assets are recovered before funds are released.
* **Profile Segmentation:** Refactored the Profile page into Active Rentals and Rental History views to improve financial oversight.
* **Safety Guards:** Implemented backend guard clauses to prevent the deletion of items that are currently in an active rental state.

### **⚠️ Technical Blockers & Resolutions**
* **State Desynchronization:** Mitigated the risk of atomic state errors by strictly enforcing transaction wrapping across all financial endpoints.
* **History Preservation:** Replaced `ON DELETE CASCADE` with the Soft Delete strategy to prevent the accidental wiping of historical records.
* **Endpoint Registration:** Resolved frontend 404 errors by properly registering `rental.routes.js` within the main `server.js` file.
* **Financial Loophole:** Identified and closed a "Free Rental" loophole by adding mandatory server-side balance checks before transaction processing.

### **🔄 Sprint Reflection**
This sprint successfully transformed the platform into a secure financial system, utilizing ACID guarantees to protect the interests of both owners and renters.

---

## **Sprint 4: The Notification & Governance Module**
**Primary Focus:** Deployment of a social governance framework, asynchronous communication, and reputation quantifiers.

### **✅ Core Deliverables & Implementation**
* **Notification Event Bus:** Developed a central `notifications` table to trigger automated system alerts for rental and return events.
* **Task Deep-Linking:** Built a global Notification Bell with real-time polling that directs users to specific tasks via actionable deep-links.
* **Social Trust System:** Engineered a dual-sided reputation system (Renter ↔ Owner) utilizing a custom `ReviewModal.jsx` component.
* **Reputation Constraints:** Enforced strict logic restricting reviews to "Completed" rentals and preventing multiple reviews per transaction.
* **Notification Cleanup:** Integrated backend hooks to automatically delete review-request prompts once a review has been successfully submitted.

### **⚠️ Technical Blockers & Resolutions**
* **Schema Desync:** Resolved a `target_user_id` missing column error by executing an `ALTER TABLE` migration script.
* **Context Accuracy:** Fixed "Undefined" notification names by refactoring the backend to perform SQL joins with the `users` table for message rendering.

### **🔄 Sprint Reflection**
OmniRent evolved from a closed-loop system into a social ecosystem where users are treated as peers with measurable trust and reputation scores.

---

## **Sprint 5: The Real-Time Communication Module**
**Primary Focus:** Enabling direct peer-to-peer communication and real-time interaction handshakes.

### **✅ Core Deliverables & Implementation**
* **WebSocket Integration:** Integrated Socket.io for bi-directional communication, routing users into context-aware "focus" rooms for real-time tracking.
* **P2P Messaging Layer:** Developed `ChatPage.jsx` with a dual-pane inbox that links messages directly to specific rental item IDs.
* **Blue Tick Receipts:** Built "Read Receipt" functionality using Focus/Blur socket logic to update message status in real-time.
* **Unread Sync:** Integrated dynamic SQL counts into the conversation list to provide accurate unread message totals per user.
* **Inbox Utilities:** Added "Mark All as Read" and "Clear History" functionality to the global Navbar messaging dropdown.

### **⚠️ Technical Blockers & Resolutions**
* **Stale Alerts:** Eliminated "Ghost Review Prompts" by adding `DELETE` operations to purge specific notifications upon review completion.
* **UI Accessibility:** Adjusted Tailwind CSS classes to ensure that message status ticks remain visible across various chat bubble themes.

### **🔄 Sprint Reflection**
The implementation of real-time messaging successfully reduced peer friction, transforming the platform into a true collaborative economy tool.

---

## **Sprint 6: The Production Readiness Module**
**Primary Focus:** Optimization of dashboard performance, securing asset condition, and integrating formal governance models.

### **✅ Core Deliverables & Implementation**
* **Governance Dashboard:** Built a secure `/admin` portal protected by bespoke backend validation middleware for dispute management.
* **Dispute Resolution:** Implemented decision-grade logic for admins to judge side-by-side "Before & After" photo condition logs.
* **Physical Accountability:** Mandated that users log the physical state of equipment during both handover and return phases.
* **Image Optimization:** Developed a browser-native compression utility (`imageCompression.js`) to minimize file weight before Cloudinary persistence.
* **Financial Emulation:** Created a high-fidelity `PaymentModal` with card masking and MM/YY validation to simulate real-world checkout.
* **Atomic Deconstruction:** Refactored the monolithic Profile page into reusable atoms, including `ProfileSidebar.jsx` and `MyListings.jsx`.

### **⚠️ Technical Blockers & Resolutions**
* **Payload Congestion:** Solved via frontend-side Canvas resizing and quality reduction to improve upload speeds.
* **State Management:** Stabilized the complex profile state machine using localized modal coordination logic in the parent `Profile.jsx`.
* **Schema Hotfix:** Resolved 500 errors by writing migration scripts to add missing schema fields bypassed by initial `IF NOT EXISTS` defaults.
* **Wildcard Collisions:** Prevented React Router from misidentifying edge-case URLs through explicit integer checking and Error Boundaries.
* **Privilege Hardening:** Patched escalation risks by entirely decoupling the admin master-key and moving it to strict `.env` variables.

### **🔄 Sprint Reflection**
The system is now vertically scaled to handle complex marketplaces with high friction, high trust, and high credibility requirements.

---

## **Sprint 7: Defense in Depth & Quota Protection**
**Primary Focus:** Neutralizing edge-case exploits, protecting cloud quotas, and blocking automated system abuse.

### **✅ Core Deliverables & Implementation**
* **Denial-of-Service Defense:** Configured Express middleware to cap API traffic (150 requests per 15 minutes per IP) to block brute-force testing.
* **Quota Preservation:** Upgraded `ListItem.jsx` with a Cloudinary drag-and-drop zone that compresses images locally before upload.
* **Session Resilience:** Hardened `auth.middleware.js` to cross-reference JWT identities against the live PostgreSQL runtime memory.
* **Zombie Token Flush:** Engineered the system to catch and flush sessions belonging to deleted users, eliminating infinite redirect loops.

### **🔄 Sprint Reflection**
The architecture is now robust against adversarial interactions, ensuring long-term infrastructure stability and resource protection.

---

## **Sprint 8: High-Trust Operations & Deployment Sync**
**Primary Focus:** Closing final gaps in P2P trust mechanisms and synchronizing database schema migrations.

### **✅ Core Deliverables & Implementation**
* **Identity Integrity:** Enforced a `UNIQUE` constraint on the `tc_no` column to prevent identity-cloning across multiple user accounts.
* **Handover Handshake:** Re-engineered the rental flow to default to a `pending_handover` state to dismantle "Word of Mouth" vulnerabilities.
* **Dual-Verification:** Implemented a requirement for renters to "Confirm Receipt" and upload pre-flight evidence before a rental becomes active.
* **Data Alignment:** Corrected a critical mapping distortion where return data was cross-contaminating handover logs in the Admin interface.
* **High-Fidelity UX:** Replaced the legacy browser `window.prompt` with a full-context `DisputeModal` wrapping actions in professional UX.
* **DevOps Tuning:** Loosened the rate-limit to 500 requests to accommodate aggressive testing sprints for system administrators.

### **🔄 Sprint Reflection**
OmniRent has successfully transitioned from an experimental sandbox into a hardened, production-capable financial escrow platform.

---

## **Sprint 9: Escrow Fortress & Legal Compliance**
**Primary Focus:** Eradicating state collision bugs, securing escrow payouts, and integrating proactive legal consent.

### **✅ Core Deliverables & Implementation**
* **Inventory Lock:** Re-engineered the "Archive" function to prevent the deletion of items currently involved in active transactions or disputes.
* **Double-Payout Immunity:** Engineered an interceptor for the escrow release endpoint that freezes transactions if an open dispute exists.
* **Dispute Symmetry:** Mandated that owners provide "Post-Flight" photographic evidence before being allowed to submit a formal dispute.
* **Abuse Prevention:** Enforced a 1:1 relationship between rental records and dispute tickets to prevent spam and system abuse.
* **Legal Integration:** Injected legally binding UI warnings into registration, publishing, checkout, and evidence upload flows.
* **Policy Architecture:** Deployed dedicated routes for Terms of Service, Privacy Policy, and Usage Agreements to clarify platform liability.
* **Unified Footer:** Implemented a global footer system to provide persistent navigation for legal and usage policies.

### **🔄 Sprint Reflection**
OmniRent's backend is now mathematically immune to overlapping state errors, reaching elite standards for physical escrow functionality.

---

## **Sprint 10: Production Hardening & Quality Assurance**
**Primary Focus:** Transitioning from manual verification to automated reliability and fortifying production security.

### **✅ Core Deliverables & Implementation**
*   **Integration Testing Suite:** Developed a comprehensive test suite using **Jest and Supertest** (58 tests) covering Auth, Items, Rentals, Messaging, and Admin governance.
*   **Database Isolation:** Engineered a `globalSetup.js` and `globalTeardown.js` logic that runs tests against a dedicated `DATABASE_URL_TEST`, with absolute guards preventing accidental production data wipes.
*   **Server Refactor:** Decoupled the Express `app` from the HTTP server listener, enabling Supertest to inject the app instance without network port conflicts during testing.
*   **Brute-Force Protection:** Implemented strict rate-limiting on the `/api/auth/login` endpoint to protect against credential stuffing attacks.
*   **Dynamic CORS:** Implemented configurable CORS origins via `ALLOWED_ORIGINS` environment variable, replacing hardcoded localhost values.
*   **Secure Upload Flow:** Migrated from client-side Cloudinary logic to a secure **Backend Signature** flow (`/api/upload-signature`), ensuring upload API secrets are never exposed to the browser.
*   **Intelligent Health Monitoring:** Built a dual-purpose `/api/health` endpoint that performs a live database connectivity check (`SELECT 1`) and serves both machine-readable JSON and human-friendly HTML status pages.
*   **Global Error Handler:** Implemented centralized error-handling middleware to catch unhandled exceptions and prevent full server crashes.
*   **UX Bug Fixes:** Patched the "Account Deletion" 401/400 status code bug that was causing unintentional global logouts on failed password attempts.

### **🔄 Sprint Reflection**
This sprint moved OmniRent from a "feature-complete" state to a "production-reliable" state. The 58-test coverage ensures that the complex Escrow state machine cannot be broken by future code changes, providing absolute confidence in the platform's stability.

---

## **Sprint 11: Email Verification & Transactional Communication**
**Primary Focus:** Implementing mandatory email verification for account security and integrating transactional email notifications across the rental lifecycle.

### **✅ Core Deliverables & Implementation**
*   **Email Service Architecture:** Built a modular `emailService.js` using **Resend** with an automatic console-logging fallback for development environments without an API key.
*   **Account Verification:** Mandated email verification for all new registrations. The backend generates a cryptographic token (`crypto.randomBytes`), stores it in the database, and dispatches a verification email containing a secure activation link.
*   **Verification Endpoint:** Implemented `GET /api/auth/verify-email` that activates user accounts and renders a branded success page with a direct link back to the login screen.
*   **Login Guard:** Updated the authentication flow to reject unverified accounts with a `403 Forbidden` status, preventing access to the platform before email confirmation.
*   **Frontend Registration Flow:** Replaced the auto-login behavior with a dedicated "Check Your Email" success screen (`MailCheck` icon, email display, and login redirect), ensuring alignment with the new backend contract.
*   **Owner Rental Alerts:** Integrated email notifications into the rental creation route, automatically alerting item owners when their equipment is booked, including renter name and earnings details.
*   **Escrow Completion Receipts:** Implemented dual-party digital receipt dispatch upon successful return confirmation, providing both the renter and owner with a transaction summary for audit purposes.
*   **Environment Variable Elimination:** Removed the need for a `FRONTEND_URL` environment variable by deriving the backend URL from the incoming request (`req.protocol + req.get('host')`) and reusing the existing `ALLOWED_ORIGINS` variable for frontend redirects.
*   **Test Suite Adaptation:** Updated all 58 integration tests to accommodate the new verification flow by auto-verifying test users*   **Dependency Audit:** Resolved all npm audit vulnerabilities across both backend and frontend, achieving zero known vulnerabilities in the dependency tree.
*   **CI/CD Pipeline:** Configured GitHub Actions to spin up a PostgreSQL 17 container and run the full 58-test suite on every push or pull request to `main`, providing an automated safety net for the production branch.

### **⚠️ Technical Blockers & Resolutions**
*   **Existing User Lockout Risk:** Identified that the `is_email_verified` column defaults to `FALSE`, which would lock out all pre-existing users. Mitigated by confirming the production database was truncated prior to deployment.
*   **CI/CD Production Safeguard:** The automated test runner initially failed because `DATABASE_URL` was identical to `DATABASE_URL_TEST` (a safeguard I built in Sprint 10). Resolved by setting a dummy `DATABASE_URL` in the GitHub Actions environment.
*   **Frontend State Desync:** Updated the registration UI to handle the lack of a token response, showing a "Check Your Email" message instead of attempting a failed auto-login.
*   **Route Syntax Corruption:** Repaired the accidentally broken `rental.routes.js` module.

### **🔄 Sprint Reflection**
OmniRent is now a professionally guarded platform. We have eliminated manual verification friction while simultaneously hardening the identity layer. With the addition of CI/CD, the codebase is now self-validating — any future changes that break the escrow logic will be caught by GitHub before they ever touch your users.

---

## **Sprint 12: Dark Mode & Community Engagement**
**Primary Focus:** Implementing a premium visual experience and establishing a professional open-source presence.

### **✅ Core Deliverables & Implementation**
*   **Dynamic Theme Engine:** Engineered a `ThemeContext` that detects system preferences (`prefers-color-scheme`) and persists user choices via `localStorage`.
*   **Tailwind v4 Design Tokens:** Refactored the entire CSS foundation in `index.css` to use semantic variables (`--bg-primary`, `--text-primary`), enabling instant application-wide theme switching.
*   **Aesthetic Switcher:** Designed a high-polish Sun/Moon toggle with micro-animations and integrated it into the global navigation bar.
*   **Community Presence:** Created a dedicated **"About & Thank You"** page documenting the project's mission and open-source spirit.
*   **GitHub Integration:** Added a direct, styled link to the official repository in the footer to encourage community transparency and contribution.
*   **Themed Content Audit:** Systematically updated `Home.jsx`, `Browse.jsx`, and the `Navbar/Footer` components to ensure a premium "Slate & Charcoal" experience in Dark Mode.

---

## **Sprint 13: Advanced Logistics & Visual Content (Proposed)**
**Primary Focus:** Enhancing the booking experience and item representation.

### **🎯 Future Goals**
*   **Availability Calendar:** Implement visual date-range selection on item detail pages to provide real-time booking availability and prevent overlap errors.
*   **Multi-Image Gallery:** Support multiple high-resolution photos per listing with a performance-optimized carousel and lightbox viewer.
*   **Real-Time Notification Bar:** Add an in-app "Toast" system for instant feedback when rental statuses change or new messages arrive.
*   **User Verification Badges:** Implement a visual "Verified" checkmark for users who have completed their email confirmation and have a 4.5+ star rating.
Sprint 1 — The Identity & Trust Module (Status: COMPLETED)
Focus: Establish secure full-stack infrastructure and a pluggable system for identity verification.
✅ What We Implemented
Infrastructure & Core Security
 * Initialized monorepo structure with dedicated Frontend and Backend folders.
 * Established React-to-Express communication via Axios and configured PostgreSQL 17 connection pooling.
 * Implemented init.js for automatic schema.sql synchronization on server startup.
 * Integrated bcryptjs for password hashing and implemented JWT-based session handling.
 * Developed auth.middleware.js and React route guards (PublicRoute/PrivateRoute) with auto-redirect logic.
Trust & Identity Layer
 * Implemented the Service-Adapter Pattern for the Identity module, allowing Mock/Real toggles via .env.
 * Developed backend verification logic comparing full_name and tc_no to award a "Verified" badge.
 * Built a modular Trust Verification modal and executed a database-wide TC field reset for clean testing.
⚠️ Problems Faced & Fixes
 * Database Initialization: Fixed "does not exist" errors by manually initializing the DB via psql.
 * Dependency Issues: Created placeholder exports for identity.real.js to resolve module resolution crashes.
 * CORS & Paths: Resolved backend crashes by correcting relative directory structures and standardizing paths with path.join.
🔄 Reflection
Successfully established a secure vertical slice. Shifting from forced identity to a "Freemium Trust Model" has improved the onboarding flow while maintaining system credibility.
Sprint 2 — The Asset Management & Discovery Module (Status: COMPLETED)
Focus: Build a professional asset management system and a functional rental marketplace.
✅ What We Implemented
Marketplace Core
 * Built full Item CRUD functionality with dynamic /item/:id routing.
 * Refactored the homepage into a "Recently Added" live feed with multi-parameter filtering (search, category, price cap).
 * Implemented server-side SQL sorting and 400ms debouncing to prevent API overload.
 * Replaced native prompts with custom React modals and a Toast notification system.
Owner Dashboard & Integrity
 * Developed a "My Listings" dashboard with live renter visibility using SQL LEFT JOIN.
 * Added a Lending History module for tracking cumulative earnings.
 * Implemented UI state logic to display rented items with an "Unavailable" badge and grayscale styling.
 * Integrated Soft Deletes (is_deleted = TRUE) to ensure data persistence for future transaction records.
⚠️ Problems Faced & Fixes
 * Parameter Destructuring: Refactored POST /api/items after finding the image_url column was initially ignored.
 * User UX: Added a password-verified confirmation modal for account deletions to prevent accidental loss.
 * Data Sync: Fixed a "Shadow Item" bug by refactoring SQL seeding to dynamically assign correct user IDs.
🔄 Reflection
The marketplace has evolved from a simple listing board into a professional asset management tool with built-in audit capabilities.
Sprint 3 — The Transaction & Escrow Module (Status: PLANNED)
Objective: Implement a secure, ACID-compliant rental engine for financial and state transitions.
📌 Upcoming Features
 * Atomic Rental Engine: Wrapping rental creation and item status updates in PostgreSQL transaction blocks (BEGIN/COMMIT) to guarantee state consistency.
 * Financial Safeguards: Implementing user balances with mock funding and FOR UPDATE row locking to prevent concurrent double-booking.
 * 3-State Escrow Handshake: Developing a lifecycle for assets (active → returned_by_renter → completed) requiring owner-side "Confirm Receipt" before item release.
 * Historical Persistence: Separating profile views into Active Rentals and History, protected by backend guard clauses.
Sprint 4 — The Notification & Governance Module (Status: PLANNED)
Objective: Introduce an asynchronous event bus and a quantifiable social trust layer.
📌 Upcoming Features
 * Event-Driven Notifications: Implementing a central notifications table to trigger actionable alerts for rental requests and return handshakes.
 * Dual-Sided Reputation: Developing a rating and review system restricted to completed transactions.
 * Auto-Cleanup Logic: Integrating hooks to automatically purge "Action Required" notifications once a review or receipt is submitted.
Sprint 5 — The Real-Time Communication Module (Status: PLANNED)
Objective: Enable direct peer-to-peer communication and real-time state tracking.
📌 Upcoming Features
 * Socket.io Infrastructure: Establishing bi-directional communication with private room management for notifications and chats.
 * Context-Aware Messaging: Building a chat interface where conversations are linked to specific marketplace items.
 * Smart Receipts: Implementing "Focus/Blur" logic to provide real-time read receipts (blue ticks) and dynamic unread message counters.
Sprint 6 — The Production Readiness Module (Status: PLANNED)
Objective: Optimize dashboard architecture and prepare the platform for real-world scaling.
📌 Upcoming Features
 * Atomic Refactor: Decomposing large components into a modular structure (e.g., ProfileSidebar, BorrowedItems).
 * Dashboard Optimization: Implementing a multi-column responsive layout using CSS Grid and standardizing global interactions.
 * Enterprise Stubs: Scaffolded endpoints for formal dispute resolution and mock integration for third-party payment gateways.
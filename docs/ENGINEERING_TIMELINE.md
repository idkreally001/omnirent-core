# 📘 OmniRent — SPRINT_LOG V4 (Condensed Engineering Timeline)

---

## **1. Core Infrastructure & System Foundation**

**Focus:** Establishing a stable, scalable full-stack baseline.

### ✅ Key Implementations

* Monorepo architecture (Frontend + Backend separation)
* React ↔ Express API bridge using Axios
* PostgreSQL 17 setup with connection pooling
* Automated schema initialization (`schema.sql`, `init.js`)
* Standardized environment configuration and path resolution
* Express app/server decoupling for testing (Supertest compatibility)
* Dynamic CORS via environment variables
* `/api/health` endpoint with DB connectivity checks

### ⚠️ Challenges & Fixes

* Database initialization failures resolved via manual `psql` setup
* Path mismatches fixed using `path.join` standardization
* CORS inconsistencies resolved with centralized config

### 🔄 Evolution Insight

Established a **stable vertical slice** enabling all future modules to integrate reliably.

---

## **2. Identity, Authentication & Trust Layer**

**Focus:** Building a secure, flexible identity system with progressive trust.

### ✅ Key Implementations

* JWT-based stateless authentication + bcrypt password hashing
* Auth middleware + protected route guards (frontend + backend)
* Mandatory email verification system (token-based activation)
* Resend → Brevo migration using HTTP-based email delivery
* Google Workspace integration for domain-level email control
* Optional TCKN verification (Mod 11 checksum + adapter pattern)
* UNIQUE constraint on `tc_no` to prevent identity duplication
* Session validation against live DB (anti-zombie tokens)
* Resend activation flow with rate limiting

### ⚠️ Challenges & Fixes

* SMTP port blocking resolved by migrating to HTTP-based email APIs
* Existing user lockout avoided via DB reset strategy
* Missing identity modules patched with fallback adapters

### 🔄 Evolution Insight

Transitioned from simple auth to a **multi-layer trust system with real-world identity guarantees**.

---

## **3. Marketplace & Asset Management**

**Focus:** Enabling asset monetization with professional inventory tools.

### ✅ Key Implementations

* Full CRUD lifecycle for listings (with `image_url` support)
* Dynamic routing (`/item/:id`)
* “Recently Added” feed with filtering, sorting, debounce (400ms)
* Inventory dashboard (“My Listings”) with SQL JOINs
* Availability state system (Unavailable badge + UI filters)
* Soft delete (`is_deleted`) for audit-safe removal
* Multi-image upload system (up to 5 images)
* Interactive preview rail with thumbnail switching

### ⚠️ Challenges & Fixes

* SQL insertion bugs fixed via parameter restructuring
* API overload mitigated with debounce + backend guards
* Seed data inconsistencies resolved with dynamic user mapping

### 🔄 Evolution Insight

Evolved into a **professional-grade asset management system with audit integrity**.

---

## **4. Transaction Lifecycle & Escrow Engine**

**Focus:** Designing a secure, fraud-resistant financial system.

### ✅ Key Implementations

* ACID-compliant PostgreSQL transactions (`BEGIN/COMMIT`)
* Row-level locking (`FOR UPDATE`) to prevent race conditions
* Rental lifecycle state machine:

  * `pending_handover → active → returned_by_renter → completed`
* Wallet/balance system with strict server-side validation
* Owner confirmation required for escrow release
* Double-payout prevention logic
* Dispute-aware escrow freeze system
* Archive restrictions for active rentals

### ⚠️ Challenges & Fixes

* “Free rental” loophole patched with mandatory balance checks
* State desynchronization eliminated via strict transaction wrapping
* Cascade delete issues replaced with soft-delete strategy

### 🔄 Evolution Insight

Transformed OmniRent into a **financially secure escrow platform with strong consistency guarantees**.

---

## **5. Real-Time Communication & Notification System**

**Focus:** Reducing user friction through instant, contextual interaction.

### ✅ Key Implementations

* Socket.io integration for real-time communication
* Context-aware messaging linked to item IDs
* Read receipts using focus/blur socket events
* Unread message counters via SQL aggregation
* Global notification system with event-driven triggers
* Notification bell with deep-linking to actionable tasks
* Inbox utilities (mark all as read, clear history)

### ⚠️ Challenges & Fixes

* “Ghost notifications” eliminated via targeted DELETE operations
* UI inconsistencies resolved through Tailwind refinements

### 🔄 Evolution Insight

Shifted from static interactions to a **real-time collaborative ecosystem**.

---

## **6. Governance, Reputation & Dispute Resolution**

**Focus:** Enforcing accountability and enabling fair conflict resolution.

### ✅ Key Implementations

* Dual-sided review system (Owner ↔ Renter)
* Review constraints (only completed rentals, one per transaction)
* Admin dashboard for dispute arbitration
* Before/After evidence comparison system
* Mandatory pre-flight & post-flight image logging
* One-to-one mapping between rentals and disputes
* Privilege hardening via backend validation middleware

### ⚠️ Challenges & Fixes

* Schema mismatches resolved with migration scripts
* Undefined notification data fixed via SQL JOIN refactors

### 🔄 Evolution Insight

Established a **trust-driven governance layer with enforceable accountability**.

---

## **7. Security, Performance & Production Hardening**

**Focus:** Defending against abuse and preparing for real-world deployment.

### ✅ Key Implementations

* Global and endpoint-specific rate limiting
* Cloudinary secure upload (server-side signature flow)
* Client-side image compression (HTML5 Canvas)
* Proxy trust configuration (`app.set('trust proxy', 1)`)
* IPv4 DNS prioritization to resolve network errors
* Global error-handling middleware
* Dependency vulnerability cleanup (0 known issues)

### ⚠️ Challenges & Fixes

* ENETUNREACH errors resolved via DNS configuration
* Payload congestion solved via frontend compression logic
* Rate-limiter misidentification fixed with proxy trust

### 🔄 Evolution Insight

System hardened against **abuse, network constraints, and infrastructure limitations**.

---

## **8. DevOps, Testing & Platform Experience**

**Focus:** Ensuring reliability, maintainability, and high-quality UX.

### ✅ Key Implementations

* 58 integration tests (Jest + Supertest)
* Dedicated test DB with isolation safeguards
* GitHub Actions CI/CD pipeline (test-gated deployments)
* Dynamic theme system (Dark Mode with design tokens)
* UI modernization (modals, toasts, responsive layouts)
* Profile segmentation (Active Rentals vs History)
* Legal system (ToS, Privacy Policy, disclaimers)
* Domain deployment to omnirent.org with DNS + DKIM/DMARC

### ⚠️ Challenges & Fixes

* CI/CD safeguards triggered by identical DB URLs (fixed via env separation)
* State complexity stabilized via component-level coordination
* Router edge-case crashes fixed with explicit validation

### 🔄 Evolution Insight

Transitioned from feature-complete to **production-reliable with polished UX and automated validation**.

# **OmniRent: Strategic Requirements Document**

## **1. System Vision & Strategic Objectives**

### **1.1 System Definition**
OmniRent is a secure, full-stack peer-to-peer (P2P) rental marketplace designed to facilitate the high-trust exchange of physical assets. By integrating a modular architecture of identity verification, financial escrow, and real-time communication, OmniRent transitions the user experience from a model of "Ownership" to one of "Access".

### **1.2 Strategic Objectives**
* **Verified Trust Engine:** Move beyond forced identity to a "Freemium Trust Model," incentivizing verification for high-value exchanges.
* **Transactional Integrity:** Guarantee absolute safety for both funds and assets through ACID-compliant escrow handshakes.
* **Professional Governance:** Provide professional-grade inventory management tools with permanent audit trails via soft-deletion.
* **Social Ecosystem:** Reduce friction through context-aware messaging and dual-sided reputation metrics.

---

## **2. User Roles**
* **Guest:** An unauthenticated user browsing the public marketplace.
* **User:** A registered participant capable of funding their wallet.
* **Owner:** A user listing their physical assets for rent.
* **Renter:** A user borrowing assets and paying rental fees.
* **Administrator:** A platform governor responsible for resolving disputes.

---

## **3. Product Backlog (Agile User Stories)**

### **Module 1: Identity & Trust (Sprint 1 & 4)**
* **User Story 1:** As a guest, I want to create a secure account, so that I can participate in the marketplace.
    * **Acceptance Criteria:**
        * Passwords are encrypted using one-way Bcryptjs hashing.
        * The system utilizes JWT for stateless session management.
        * Login attempts are rate-limited to prevent brute-force attacks.
* **User Story 2:** As a user, I want to verify my identity using my TCKN, so that I can earn a "Verified" badge and access high-trust transactions.
    * **Acceptance Criteria:**
        * The system uses a mathematical Mod 11 checksum algorithm to validate Turkish Identity Numbers.
        * Verification is optional for onboarding but required for high-trust status.

### **Module 2: Asset Management & Discovery (Sprint 2 & 6)**
* **User Story 3:** As an owner, I want to list my equipment with images and daily rates, so that I can monetize my idle assets.
    * **Acceptance Criteria:**
        * Owners can perform full CRUD operations on their listings.
        * Daily rates are handled as integers to ensure mathematical precision.
        * Images are compressed locally before being securely uploaded to Cloudinary.
* **User Story 4:** As a renter, I want to search and filter the marketplace, so that I can find the specific tools I need quickly.
    * **Acceptance Criteria:**
        * Search queries utilize a 400ms debounce to maintain UI performance.
        * Users can filter by category, price caps, and sorting parameters.

### **Module 3: Transaction & Escrow (Sprint 3 & 8)**
* **User Story 5:** As a participant, I want my funds and assets held in escrow, so that I am protected from fraud during the rental lifecycle.
    * **Acceptance Criteria:**
        * Rental creation is wrapped in a PostgreSQL transaction block to ensure atomicity.
        * Funds are frozen in the system until the owner confirms the return of the asset.
        * `FOR UPDATE` row-locking is used during balance updates to prevent double-spending.

### **Module 4: Communication & Social Governance (Sprint 5 & 7)**
* **User Story 6:** As a user, I want to receive real-time notifications, so that I am instantly aware of rental requests or status changes.
    * **Acceptance Criteria:**
        * The system utilizes an asynchronous Event Bus for system alerts.
        * Actionable notifications deep-link the user directly to the required task.
* **User Story 7:** As a renter or owner, I want to chat with my peer about a specific item, so that we can coordinate handovers easily.
    * **Acceptance Criteria:**
        * Messages are context-aware and linked to specific asset IDs.
        * Read receipts (blue ticks) are updated in real-time using Focus/Blur socket logic.

### **Module 5: Evidence & Dispute Resolution (Sprint 6, 8 & 9)**
* **User Story 8:** As a participant, I want to log the condition of an asset during handover, so that I have evidence in case of a dispute.
    * **Acceptance Criteria:**
        * The system enforces pre-flight and post-flight photo uploads.
        * Evidence images are linked to the specific `rental_id` and stored with timestamps.
* **User Story 9:** As an administrator, I want to view side-by-side evidence, so that I can fairly resolve disputes and release escrow funds.
    * **Acceptance Criteria:**
        * Admins have a secure dashboard to view "Before & After" condition logs.
        * Frozen escrow funds can only be released via Admin intervention if a dispute is open.

---

## **4. Non-Functional Requirements (Quality Attributes)**

* **NFR-1 (Security):** All API endpoints require JWT authentication to ensure stateless session integrity.
* **NFR-2 (Integrity):** All financial calculations must utilize integer math to prevent floating-point rounding errors.
* **NFR-3 (Reliability):** Historical transaction records must be preserved via soft-deletion even if a listing is removed.
* **NFR-4 (Defense):** The system must implement rate-limiting and image compression to protect server resources and cloud quotas.
* **NFR-5 (Usability):** The interface must utilize responsive CSS Grid layouts for accessibility across mobile and desktop devices.
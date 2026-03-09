### **1. Functional Requirements (FR)**

These define the core services the OmniRent system provides to the user.

#### **1.1 Identity & Trust (Sprint 1)**

* **FR-1:** The system shall provide a secure registration and login portal utilizing one-way password hashing via Bcryptjs.
* **FR-2:** The system shall implement a "Freemium Trust Model" where identity verification (TC No) is optional for onboarding but required for high-trust status.
* **FR-3:** The system shall award a "Verified" badge to users who successfully pass the Identity Service adapter logic.
* **FR-4:** The system shall enforce a high-friction account deletion protocol requiring password re-verification.

#### **1.2 Asset Management & Discovery (Sprint 2)**

* **FR-5:** The system shall allow users to Create, Read, Update, and Delete (CRUD) rental listings with support for image URLs.
* **FR-6:** The system shall provide a marketplace discovery engine with multi-parameter filtering and server-side sorting.
* **FR-7:** The system shall provide a "My Listings" dashboard that displays the real-time rental status of owned assets.
* **FR-8:** The system shall implement "Soft Deletes" for assets to ensure transaction history is preserved in the database after removal from the public marketplace.

#### **1.3 Transactions & Communications (Sprints 3–5)**

* **FR-9:** The system shall implement an Escrow Handshake with three states: Active, Returned, and Completed.
* **FR-10:** The system shall restrict user reviews to only occur after a rental transaction has reached the "Completed" state.
* **FR-11:** The system shall provide real-time peer-to-peer messaging within context-aware chat rooms for specific rental items.

---

### **2. Non-Functional Requirements (NFR)**

These define the quality attributes and constraints of the system.

#### **2.1 Security & Reliability**

* **NFR-1 (Security):** All backend API endpoints shall be protected by custom JWT (JSON Web Token) middleware to ensure stateless session integrity.
* **NFR-2 (Reliability):** All financial and state-change operations (like rental creation) shall be wrapped in ACID-compliant PostgreSQL transaction blocks to prevent data corruption.
* **NFR-3 (Integrity):** The system shall utilize row-locking (`FOR UPDATE`) during balance updates to prevent double-spending or race conditions.

#### **2.2 Performance & Usability**

* **NFR-4 (Performance):** The discovery engine shall implement a 400ms debounce on search queries to minimize redundant server requests and maintain UI responsiveness.
* **NFR-5 (Usability):** The system shall utilize responsive CSS Grid layouts and a modular UI architecture to ensure accessibility across various device types.


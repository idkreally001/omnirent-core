# Project Development & Sprint Logs

## Sprint 0: Infrastructure & Handshake (Feb 13, 2026)

**Goal:** Establish the full-stack "Handshake" and database connectivity.

### ✅ What we did

* **Initialized monorepo structure:** Organized codebase into dedicated `Frontend` and `Backend` folders.
* **Axios Integration:** Established React-to-Express communication.
* **Database Setup:** Configured **PostgreSQL 17** local instance and established a connection pool.
* **Architecture:** Implemented the **Service-Adapter Pattern** for the Identity module (Mock vs. Real).
* **Schema Design:** Finalized core database schema for `Users`, `Items`, and `Rentals`.

### ⚠️ Problems Faced

* **Database Connection Refused:** Encountered `database "omnirent" does not exist`.
* *Fix:* Manually initialized the database via `psql`.


* **Module Resolution Error:** System crashed due to missing placeholder for `identity.real.js`.
* *Fix:* Created placeholder export files to satisfy dependency requirements.



---

## Sprint 1: Security & Identity Management (Feb 13, 2026)

**Goal:** Implement secure user authentication and protected route architecture.

### ✅ What we did

* **Secure Hashing:** Integrated `bcryptjs` for one-way password hashing before DB insertion.
* **JWT Implementation:** Built a token generation system using `jsonwebtoken` to handle user sessions.
* **Registration & Login:** Completed `POST /api/auth/register` and `POST /api/auth/login` endpoints.
* **Middleware Bouncer:** Developed a custom `auth.middleware.js` to intercept requests and verify JWTs.
* **Frontend Guards:** Created `PublicRoute` and `PrivateRoute` HOCs to manage access control.
* **Navigation Sync:** Implemented auto-redirection (e.g., logged-in users are bounced from `/login` to `/profile`).

### ⚠️ Problems Faced

* **Redundant Auth States:** Logged-in users could still access registration/login forms.
* *Fix:* Implemented declarative route guarding in `App.jsx` to check `localStorage` before mounting components.



### 🔄 Agile Reflections

* **What went well:** The "Vertical Slice" approach worked. We have a fully functional Auth system (Database -> Backend -> Frontend) that is secure and user-friendly.
* **Status:** Sprint 1 CLOSED.

---

## Sprint 2: Marketplace Inventory & UX Refinement (Feb 13, 2026)

**Goal:** Implement item listing, public browsing, and professional asset management.

### ✅ What we did

* **Database Expansion:** Added `image_url` column to `items` table and verified via `psql` CLI.
* **Dynamic Asset Routing:** Implemented `/item/:id` routes in React and `GET /api/items/:id` in Express.
* **Item Detail View:** Built a high-fidelity detail page featuring owner information and "Share" logic.
* **Homepage Evolution:** Refactored `Home.jsx` into a live "Recently Added" feed.
* **Custom Modal Architecture:** Replaced all browser-native prompts with custom-styled React modals.
* **Instant Feedback (Toasts):** Built a state-driven Toast notification system for asset removal.

### ⚠️ Problems Faced

* **Data Persistence Gap:** `image_url` was being ignored by the backend SQL query.
* *Fix:* Refactored `POST /api/items` to destructure and insert the 6th parameter.


* **User Offboarding UX:** Deleting an account was too abrupt.
* *Fix:* Added a password-verified modal with a two-step confirmation button.



### 🔄 Agile Reflections

* **Status:** Sprint 2 CLOSED.

---

## Sprint 3: Transaction Engine (Feb 13, 2026 - CLOSED)

**Goal:** Enable the core business logic—the ability for one user to rent an item from another.

### ✅ What we did

* **ACID Transactions:** Implemented `POST /api/rentals` using `BEGIN/COMMIT` logic to ensure rental creation and item status updates happen simultaneously.
* **Rental Verification:** Integrated backend checks to prevent "self-renting" and double-booking of items.
* **Booking UX:** Developed a dynamic duration picker on the **Detail page** that calculates total price in real-time.
* **Success Feedback:** Integrated a `CheckCircle2` animation upon successful rental to improve user confidence and visual flow.
* **Borrower Dashboard:** Expanded the **Profile page** with a "Borrowed Items" section, joining `rentals` and `items` tables to display active contracts.
* **Database Automation:** Developed an `init.js` script to automatically sync the `schema.sql` on server startup, ensuring environment portability.

### ⚠️ Problems Faced

* **Endpoint 404 (The Ghost URL):** The frontend "Rent Now" action initially failed because it was calling a non-existent backend route.
* *Fix:* Developed the `rental.routes.js` controller and registered it in `server.js` to complete the full-stack handshake.


* **Atomic State Desync:** Risk of an item being rented but still appearing as "Available" if a server error occurred mid-process.
* *Fix:* Wrapped the rental creation and item status update in a **PostgreSQL transaction block** (`BEGIN/COMMIT`) to ensure data integrity.


* **Module Path Errors:** The new database automation script failed initially due to relative path mismatches between `src/db/` and the root `database/` folder.
* *Fix:* Standardized paths using `path.join(__dirname, ...)` to ensure the script runs correctly across different directories.



### 🔄 Agile Reflections

* **What went well:** We successfully moved from a "Listing" app to a "Transaction" platform. The database schema held up perfectly under the new foreign key requirements, and the "Zero-Config" startup script now makes the project much easier to share or deploy.
* **Status:** Sprint 3 CLOSED.

---

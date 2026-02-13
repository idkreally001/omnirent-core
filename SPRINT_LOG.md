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
* **Frontend Guards:** Created `PublicRoute` and `PrivateRoute` HOCs (Higher-Order Components) to manage access control.
* **Navigation Sync:** Implemented auto-redirection (e.g., logged-in users are bounced from `/login` to `/profile`).

### ⚠️ Problems Faced
* **Redundant Auth States:** Logged-in users could still access registration/login forms.
    * *Fix:* Implemented declarative route guarding in `App.jsx` to check `localStorage` before mounting components.
* **Manual Server Restarts:** Backend code changes weren't reflecting, leading to false 404s.
    * *Fix:* Integrated `nodemon` to automate the development workflow.

### 🔄 Agile Reflections
* **What went well:** The "Vertical Slice" approach worked. We have a fully functional Auth system (Database -> Backend -> Frontend) that is secure and user-friendly.
* **Status:** Sprint 1 CLOSED.

---

## Sprint 2: Marketplace Inventory (Feb 13, 2026 - Current)
**Goal:** Implement item listing and public browsing capabilities.

### ✅ What we did
* **Database Expansion:** Created the `items` table with foreign key relations to users and decimal precision for pricing.
* **RESTful Item Routes:**
    * `POST /api/items`: Securely captures item details linked to the authenticated user's ID.
    * `GET /api/items`: Retrieves all 'available' items for the public marketplace.
* **Asset Creation Flow:** Developed `ListItem.jsx` with a dedicated form for marketplace supply.
* **UX Refinement:** Replaced browser-native `alert()` popups with custom in-page error banners in Login and Register components.
* **State Synchronization:** Resolved a critical bug where the Navbar didn't reflect authentication changes without a manual refresh.

### ⚠️ Problems Faced
* **Route Misdirection:** The "Start Renting" CTA on the Home page was incorrectly leading to the Profile instead of the Item Creation page.
    * *Fix:* Updated `Home.jsx` routing logic to point to `/list-item`.
* **Auth State Latency:** Navbar components weren't re-rendering upon `localStorage` updates.
    * *Fix:* Switched from `Maps()` hooks to `window.location.href` for auth-related redirects to ensure a clean state hydration.

### 🔄 Agile Reflections
* **What went well:** The decision to use **Tailwind CSS** early allowed us to quickly pivot from an "Admin Panel" look to a consumer-facing marketplace aesthetic.
* **Next Steps:** Implement "My Listings" management in the User Profile and build the Item Detail view.
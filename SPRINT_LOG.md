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


* **Manual Server Restarts:** Backend code changes weren't reflecting, leading to false 404s.
* *Fix:* Integrated `nodemon` to automate the development workflow.



### 🔄 Agile Reflections

* **What went well:** The "Vertical Slice" approach worked. We have a fully functional Auth system (Database -> Backend -> Frontend) that is secure and user-friendly.
* **Status:** Sprint 1 CLOSED.

---

## Sprint 2: Marketplace Inventory & UX Refinement (Feb 13, 2026 - Current)

**Goal:** Implement item listing, public browsing, and professional asset management.

### ✅ What we did

* **Database Expansion:** Added `image_url` column to `items` table and verified via `psql` CLI.
* **Dynamic Asset Routing:** Implemented `/item/:id` routes in React and `GET /api/items/:id` in Express to allow for sharable listing URLs.
* **Item Detail View:** Built a high-fidelity detail page featuring owner information, "Share" logic (clipboard API), and fallback UI for missing media.
* **Asset Creation Flow:** Updated `ListItem.jsx` to support optional image URLs, linking visual media to the database.
* **Homepage Evolution:** Refactored `Home.jsx` from a static landing page to a live "Recently Added" feed, importing marketplace cards for immediate user engagement.
* **Security & Account Control:** Developed password-verified account deletion and owner-only listing removal.
* **Management UI:** Integrated an "Active Listings" dashboard within the User Profile for real-time CRUD operations.

### ⚠️ Problems Faced

* **Data Persistence Gap:** `image_url` was being collected on the frontend but ignored by the backend SQL query.
* *Fix:* Refactored `POST /api/items` to destructure and insert the 6th parameter (image_url) into the query.


* **State Sync (Blank Pages):** Application crashed due to missing imports of newly created pages within the Router.
* *Fix:* Standardized import checks and added `ListItem` and `ItemDetail` to `App.jsx`.


* **Latency in UI State:** Login/Logout didn't trigger Navbar updates.
* *Fix:* Replaced `Maps()` with `window.location.href` for auth-actions to force a full state hydration.



### 🔄 Agile Reflections

* **What went well:** Moving the "Browse" feed onto the Homepage immediately improved the app's professional feel and "liveliness."
* **Next Steps:** Begin **Sprint 3: Transactions**, focusing on the `rentals` table, item availability state-changes, and the booking flow.

## Sprint 2: Marketplace Inventory & UX Refinement (Feb 13, 2026 - CLOSED)
**Goal:** Implement item listing, public browsing, and professional asset management.

### ✅ What we did (Polishing Phase)
* **Visual Marketplace Feed:** Refactored `Home.jsx` to include a dynamic "Recently Added" section that pulls live data from the database.
* **Custom Modal Architecture:** Replaced all browser-native `confirm()` and `alert()` prompts with custom-styled React modals for a unified project aesthetic.
* **High-Stakes Verification:** Implemented a "Double-Check" button pattern for account deletion to prevent accidental data loss.
* **Instant Feedback (Toasts):** Built a state-driven Toast notification system to confirm successful asset removal without page reloads.

### ⚠️ Problems Faced
* **User Offboarding UX:** Deleting an account was too abrupt and lacked friction.
    * *Fix:* Added a password-verified modal with a two-step confirmation button ("Delete" -> "Are you sure?").
* **Browser Consistency:** Native `confirm()` boxes looked different across browsers (Chrome vs Safari).
    * *Fix:* Developed custom Tailwind-based modals to ensure a consistent look and feel.

### 🔄 Agile Reflections
* **What went well:** The combination of "Vertical Slices" for features and a "Polish Pass" for UX has made the app feel significantly more complete and trustworthy.
* **Status:** Sprint 2 CLOSED.

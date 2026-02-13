# Project Development & Sprint Logs

## Sprint 0: Infrastructure & Handshake (Feb 13, 2026)
**Goal:** Establish the full-stack "Handshake" and database connectivity.

### ✅ What we did
* Initialized monorepo structure (Frontend/Backend folders).
* Established React-to-Express communication via Axios.
* Configured PostgreSQL 17 local instance and established connection pool.
* Implemented **Service-Adapter Pattern** for the Identity module (Mock vs. Real).
* Finalized core database schema (Users, Items, Rentals).

### ⚠️ Problems Faced
* **Database Connection Refused:** Encountered `database "omnirent" does not exist`.
    * *Fix:* Manually initialized the database via `psql`.
* **Module Resolution Error:** System crashed due to missing placeholder for `identity.real.js`.
    * *Fix:* Created placeholder export files.

---

## Sprint 1: Security & Identity Management (Feb 13, 2026 - Current)
**Goal:** Implement secure user authentication and protected route architecture.

### ✅ What we did
* **Secure Hashing:** Integrated `bcryptjs` for one-way password hashing before DB insertion.
* **JWT Implementation:** Built a token generation system using `jsonwebtoken` to handle user sessions.
* **Registration & Login:** Completed `POST /api/auth/register` and `POST /api/auth/login` endpoints.
* **Middleware Bouncer:** Developed a custom `auth.middleware.js` to intercept requests and verify JWTs in the `Authorization` header.
* **Protected Resources:** Created `GET /api/user/profile` to test end-to-end secure data retrieval.

### ⚠️ Problems Faced
* **Missing Dependencies:** Backend failed to start due to `bcryptjs` and `jsonwebtoken` not being in the local `node_modules`.
    * *Fix:* Standardized local environment by running `npm install`.
* **Stale Route State (404 Error):** `Cannot GET /api/user/profile` despite correct code.
    * *Fix:* Integrated `nodemon` to ensure a clean server state on every save.
* **Token Formatting:** Initial issues with Postman sending `Bearer` prefixes.
    * *Fix:* Updated middleware logic to handle both raw tokens and `Bearer ` string splitting.

### 🔄 Agile Reflections
* **What went well:** Using Postman early allowed us to verify the "Identity James" logic before building any UI. 
* **Next Steps:** Begin Sprint 2: The Marketplace Module (Item listings and search functionality).
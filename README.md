---

# OmniRent: The Universal Sharing Marketplace

OmniRent is a high-trust, peer-to-peer (P2P) rental platform designed to transition from a model of **"Ownership" to "Access."** It provides a secure ecosystem for users to monetize assets and access premium equipment on demand.

---

## 🏗 Modular System Architecture

The OmniRent platform is developed using a highly scalable, 6-module Agile architecture. Each module operates with distinct independence and objective-driven logic:

1. **The Identity & Trust Module:** A secure onboarding system featuring JWT authentication, `bcryptjs` encryption, and a pluggable Service-Adapter pattern for mock vs. real government ID verification.
2. **The Asset Management & Discovery Module:** A dynamic digital catalog featuring real-time live feeds, multi-parameter filtering, debounced search querying, and soft-delete historical preservation.
3. **The Transaction & Escrow Module:** An ACID-compliant financial engine utilizing PostgreSQL `BEGIN/COMMIT` blocks and `FOR UPDATE` row locking to prevent double-booking and ensure secure 3-state escrow handshakes.
4. **The Notification & Governance Module:** An asynchronous Event Bus powering real-time alerts, deep-linked actionable tasks, and a self-cleaning dual-sided social trust (rating) system.
5. **The Real-Time Communication Module:** A low-latency Socket.io messaging layer featuring context-aware inboxes linked to specific assets, and "Focus/Blur" logic for instant Read Receipts (blue ticks).
6. **The Production Readiness Module:** A responsive, multi-column CSS Grid interface prepared for enterprise scaling, including scaffolded endpoints for Dispute Resolution and third-party payment gateways (Stripe/PayPal).

---

## 🛠 Tech Stack

* **Frontend:** React (Vite) + Tailwind CSS + Lucide Icons
* **Backend:** Node.js (Express) + JWT Authentication
* **Real-Time Layer:** Socket.io (Bi-directional communication)
* **Database:** PostgreSQL 17 (Relational Schema with strict constraints)
* **Architecture Patterns:** Service-Adapter Pattern, Event-Driven Hooks, Component Decomposition

---

## 🏁 Getting Started

### Prerequisites

* Node.js (v22+)
* PostgreSQL (v17+)

---

### Installation

1. **Clone the repository and install dependencies:**

```bash
git clone https://github.com/idkreally001/omnirent-core.git
cd omnirent-core/backend
npm install

cd ../frontend
npm install

```

---

### Database Setup

1. Create a PostgreSQL database named:

```
omnirent

```

2. On backend startup, the system automatically executes the synchronization script:

```
backend/src/db/schema.sql

```

This initializes the relational database schema, tables, and necessary triggers.

---

### Run the Development Environment

#### Backend (from `/backend`)

The backend relies on atomic startup logic and auto-syncs the database.

```bash
npm run dev

```

#### Frontend (from `/frontend`)

```bash
npm run dev

```

---

## 🛡 System Security & Trust Model

OmniRent takes data integrity and peer safety seriously:

* **Service-Adapter Verification:** Enables seamless transitions between mock development environments and production-grade API integrations.
* **High-Friction Data Management:** Includes password-verified account deletion and owner-protected inventory guards to prevent accidental data loss during active transactions.
---

# OmniRent: The Universal Sharing Marketplace

OmniRent is a high-trust, peer-to-peer (P2P) rental platform designed to transition from a model of **"Ownership" to "Access."** It provides a secure ecosystem for users to monetize assets and access premium equipment on demand.

---

## 🏗 Modular System Architecture

The OmniRent platform is developed using a highly scalable, 6-module Agile architecture. Each module operates with distinct independence and objective-driven logic:

1. **The Identity & Trust Module:** A secure onboarding system featuring JWT authentication, mathematically accurate TCKN validation algorithms, and a pluggable Service-Adapter pattern.
2. **The Asset Management & Discovery Module:** A dynamic digital catalog featuring real-time live feeds, multi-parameter filtering, debounced global search querying, and soft-delete historical preservation.
3. **The Transaction & Escrow Module:** An ACID-compliant financial engine utilizing PostgreSQL `BEGIN/COMMIT` blocks securely freezing transaction funds in system proxy. Eliminates risk by holding funds until the owner and renter mutually verify condition and transfer.
4. **The Notification & Governance Module:** An asynchronous Event Bus powering real-time system alerts, deep-linked actionable tasks, and real-time Admin Dispute broadcasts.
5. **The Real-Time Communication Module:** A low-latency Socket.io messaging layer featuring context-aware inboxes linked to specific assets, and "Focus/Blur" logic for instant Read Receipts (blue ticks).
6. **The Production Readiness Module:** A responsive, multi-column CSS Grid interface prepared for enterprise scaling. Includes a robust **Dispute Engine** where administrators compare condition-logging evidence to release escrow holds.
7. **The Media & Asset Evidence Module:** A browser-native image compression system using HTML5 Canvas to optimize high-resolution proof-of-condition photos before uploading them to Cloudinary.

---

## 🛠 Tech Stack

* **Frontend:** React (Vite) + Vanilla CSS + Lucide Icons
* **Backend:** Node.js (Express) + JWT Authentication
* **Real-Time Layer:** Socket.io (Bi-directional communication)
* **Media Storage:** Cloudinary (Unsigned Upload Preset)
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

---

### ⚡️ Run the Entire Platform (Simultanous)

You can spin up both the **Frontend** and **Backend** with a single command from the root folder:

```bash
npm run dev
```

*(On Windows, you can also simply double-click `run_omnirent.bat`)*

#### Manual Execution

##### Backend (from `/backend`)
```bash
npm start
```

##### Frontend (from `/frontend`)
```bash
npm run dev
```

---

## 🛡 System Security & Trust Model

OmniRent takes data integrity and peer safety seriously:

* **Service-Adapter Verification:** Enables seamless transitions between mock development environments and production-grade API integrations.
* **Escrow Financial Freezes:** Total risk mitigation by holding rental funds securely in the background, only routing to the vendor upon confirmed asset recovery or Administrative intervention. 
* **High-Friction Target Constraints:** Strict system architecture prevents deletion of active rental records or ongoing dispute files, ensuring comprehensive audit logs.
* **Denial of Wallet & DoS Defenses:** Implements `express-rate-limit` middleware (to block bot swarms and scrapers) alongside browser-native Canvas compression (to prevent massive files from draining cloud bucket space).
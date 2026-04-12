# 🚀 OmniRent — The Universal Sharing Marketplace

OmniRent is a **high-trust peer-to-peer (P2P) rental platform** designed to shift the economy from **ownership → access**.

It enables users to monetize physical assets while ensuring **financial safety, identity trust, and dispute accountability** through a production-grade escrow system.

---

## ✨ Key Highlights

* 🔐 **ACID-secured escrow system** (no double-spending, no race conditions)
* 💬 **Real-time messaging** with context-aware conversations
* 🧪 **58 integration tests** with CI/CD enforcement (GitHub Actions)
* ☁️ **Secure media uploads** via signed Cloudinary API
* 📬 **Custom domain email system** with verified delivery (SPF, DKIM, DMARC)
* 🛡 **Identity-gated platform** (email verification + optional national ID validation)
* 🌙 **Full Dark Mode system** using Tailwind v4 design tokens

---

## 🏗 System Architecture

OmniRent is built using a modular, production-oriented architecture:

### 1. Identity & Trust

* JWT authentication + bcrypt hashing
* Mandatory email verification (token-based activation)
* Optional TCKN validation with trust-tier system
* Session validation against live database

---

### 2. Marketplace & Asset Management

* Full CRUD system for listings
* Multi-image upload with client-side compression
* Debounced search + multi-parameter filtering
* Real-time availability state

---

### 3. Escrow & Transaction Engine

* PostgreSQL **ACID transactions (`BEGIN/COMMIT`)**
* **Row-level locking (`FOR UPDATE`)** to prevent race conditions

**Rental lifecycle:**

```text
pending_handover → active → returned_by_renter → completed
```

* Funds held securely until return confirmation
* Automatic blocking of payouts during disputes

---

### 4. Real-Time Communication

* Socket.io bi-directional messaging
* Item-linked conversations
* Read receipts (focus/blur logic)
* Unread message synchronization

---

### 5. Governance & Dispute System

* Evidence-based dispute resolution (before/after images)
* Admin dashboard for arbitration
* One-to-one mapping between rentals and disputes
* Escrow freeze enforcement during conflicts

---

### 6. Security & Reliability

* Rate limiting (global + login endpoints)
* Secure upload signature flow (no exposed API secrets)
* Zombie session invalidation
* Global error handling middleware

---

### 7. Testing & DevOps

* **58 integration tests** (Jest + Supertest)
* Dedicated test database with isolation safeguards
* GitHub Actions CI/CD pipeline (runs on every push)

---

### 8. UX & Platform Experience

* Tailwind v4 design system (semantic tokens)
* Persistent Dark Mode (system-aware)
* Notification system with deep-linking
* Trust badges (Verified / Super Owner)

---

## 🛠 Tech Stack

**Frontend**

* React (Vite)
* Tailwind CSS v4
* Lucide Icons

**Backend**

* Node.js (Express)
* PostgreSQL 17
* JWT Authentication

**Real-Time**

* Socket.io

**DevOps**

* GitHub Actions (CI/CD)

**Email & Communication**

* Brevo (Transactional Email API over HTTPS)
* Google Workspace (domain email infrastructure for omnirent.org)

**Storage**

* Cloudinary (secure signed uploads)

**Testing**

* Jest + Supertest

---

## 📘 Documentation & Development History

OmniRent is developed using an iterative, engineering-driven approach with detailed system tracking and requirement planning.

* 📜 **Engineering Log (Timeline):**
  A condensed, system-level overview of the platform’s evolution across all major modules.
  👉 [View docs/ENGINEERING_TIMELINE.md](./docs/ENGINEERING_TIMELINE.md)

* 📄 **Technical History (Detailed):** 
  The high-fidelity archive containing every SQL fix, route refactor, and micro-sprint decision.
  👉 [View docs/DETAILED_LOG.md](./docs/DETAILED_LOG.md)

* 📋 **Strategic Requirements Document:**
  Defines system vision, user roles, Agile-style user stories, and non-functional requirements.
  👉 [View docs/REQUIREMENTS.md](./docs/REQUIREMENTS.md)

<details>
<summary>Quick Overview</summary>

* Infrastructure → Identity → Marketplace → Escrow → Communication
* Governance → Security → DevOps & UX

</details>

---

## 📬 Email Infrastructure

OmniRent utilizes a **custom domain email system** powered by **Brevo + Google Workspace**, ensuring high deliverability and production-grade reliability:

* Lifecycle-triggered transactional emails:

  * Account verification
  * Rental confirmations
  * Escrow completion receipts
* Domain authentication via:

  * SPF (Sender Policy Framework)
  * DKIM (DomainKeys Identified Mail)
  * DMARC (Domain-based Message Authentication)
* Fully HTTP-based email delivery (port 443), avoiding SMTP port restrictions

---

## 🛡 Security Philosophy

OmniRent is built with **defense-in-depth principles**:

* 🔒 Identity verification before access
* 💰 Escrow-protected financial flows
* ⚖️ Dispute-aware transaction blocking
* 🚫 Rate-limited endpoints to prevent abuse
* 📬 Authenticated email infrastructure to prevent spoofing and spam

---

## 🏁 Getting Started

### Prerequisites

* Node.js (v22+)
* PostgreSQL (v17+)

---

### Installation

```bash
git clone https://github.com/idkreally001/omnirent-core.git
cd omnirent-core

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE omnirent;
```

2. On backend startup, schema is automatically initialized from:

```text
backend/src/db/schema.sql
```

---

### Run the Platform

```bash
npm run dev
```

Or on Windows:

```text
run_omnirent.bat
```

---

## 📌 Project Status

✅ Feature-complete MVP
✅ Production-hardened backend
🚧 Upcoming features:

* Geolocation-based discovery
* e-Devlet identity integration
* Community moderation system

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome.
Feel free to open issues or submit pull requests.

---

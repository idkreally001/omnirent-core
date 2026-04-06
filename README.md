# OmniRent: The Universal Sharing Marketplace

OmniRent is a high-trust, peer-to-peer (P2P) rental platform designed to transition from a model of **"Ownership" to "Access."** It provides a secure ecosystem for users to monetize assets and access premium equipment on demand.

---

## 🏗 Modular System Architecture

The OmniRent platform is developed using a highly scalable, 8-module architecture:

1. **Identity & Trust:** Secure onboarding featuring JWT, TCKN validation, and **Mandatory Email Verification (Resend)**.
2. **Asset Management:** A dynamic digital catalog with real-time feeds, debounced search, and multi-parameter filtering.
3. **Transaction & Escrow:** An ACID-compliant financial engine utilizing PostgreSQL blocks to securely freeze funds until mutual verification.
4. **Real-Time Communication:** A low-latency Socket.io layer featuring context-aware inboxes and instant Read Receipts.
5. **Aesthetic & Experience:** A premium UI powered by **Tailwind v4 Design Tokens** and a persistent, system-aware **Dark Mode**.
6. **Verification & Reliability:** A CI/CD pipeline using **GitHub Actions** to run **58 integration tests** on every push.
7. **Media & Asset Evidence:** Browser-native image compression using HTML5 Canvas before **Secure Signed-Uploads** to Cloudinary.
8. **Governance & Dispute Module:** A high-friction dispute engine where admins monitor photographic evidence to arbitrate escrow holds.

---

## 🛠 Tech Stack

* **Frontend:** React (Vite) + **Tailwind v4** + Lucide Icons
* **Backend:** Node.js (Express) + JWT + PostgreSQL 17
* **Real-Time:** Socket.io (Bi-directional)
* **DevOps:** GitHub Actions (CI/CD)
* **Email:** Resend (Transactional Lifecycle Emails)
* **Storage:** Cloudinary (Secure Signature Flow)
* **Testing:** Jest + Supertest (58 Individual Cases)

---

## 🛡 System Security & Reliability

* **Zero-Touch CI/CD:** Code is only promoted to production if all 58 tests pass on the main branch.
* **Escrow Financial Freezes:** Total risk mitigation by holding rental funds securely until recovery is confirmed.
* **Identity-Gated Lifecycle:** Login is strictly blocked for unverified accounts, ensuring market participants are verified.

---

## 🏁 Getting Started

### Prerequisites

* Node.js (v22+)
* PostgreSQL (v17+)

### Installation

1. **Clone the repository and install dependencies:**

```bash
git clone https://github.com/idkreally001/omnirent-core.git
cd omnirent-core/backend
npm install

cd ../frontend
npm install
```

### Database Setup

1. Create a PostgreSQL database named `omnirent`.
2. On backend startup, the system automatically executes `backend/src/db/schema.sql` to initialize the schema.

### ⚡️ Run the Entire Platform

```bash
npm run dev
```

*(On Windows, you can also double-click `run_omnirent.bat` from the root folder)*
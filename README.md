````markdown
# OmniRent: The Universal Sharing Marketplace

OmniRent is a high-trust, peer-to-peer (P2P) rental platform designed to transition from a model of **"Ownership" to "Access."** It provides a secure ecosystem for users to monetize assets and access premium equipment on demand.

---

## 🚀 Key Features (Updated Feb 13, 2026)

- **Live Marketplace Feed:** Real-time discovery of items listed by neighbors.  
- **Dynamic Asset Routing:** Sharable, unique URLs for every listing (`/item/:id`).  
- **Identity-Linked Profiles:** Integrated dashboard for managing personal listings and active rentals.  
- **Transactional Integrity:** ACID-compliant rental engine ensuring secure asset state transitions.  
- **High-Friction Security:** Verified account deletion and owner-protected inventory management.  

---

## 🛠 Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS + Lucide Icons  
- **Backend:** Node.js (Express) + JWT Authentication  
- **Database:** PostgreSQL 17 (Relational Schema)  
- **Architecture:** Modular Service-Adapter Pattern  

---

## 🏁 Getting Started

### Prerequisites

- Node.js (v22+)  
- PostgreSQL (v17+)  

---

### Installation

1. **Clone the repository and install dependencies:**

```bash
git clone https://github.com/idkreally001/omnirent-core.git
cd omnirent-core/backend
npm install

cd ../frontend
npm install
````

---

### Database Setup

1. Create a PostgreSQL database named:

```
omnirent
```

2. On backend startup, the system automatically executes:

```
backend/src/db/schema.sql
```

to initialize the database schema.

---

### Run the Development Environment

#### Backend (from `/backend`)

```bash
npm run dev
```

#### Frontend (from `/frontend`)

```bash
npm run dev
```

---

## 🏗 System Architecture

The project follows a **Service-Adapter Pattern**, enabling seamless transitions between mock development environments and production-grade API integrations.

```
```

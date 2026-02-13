# OmniRent 🚀
> A Peer-to-Peer "Everything" Rental Marketplace (localized for Turkey).

## 📌 Project Overview
OmniRent is a managed marketplace designed to transition society from "Ownership" to "Access." 
Built for SENG 204, it utilizes a high-trust intermediary model handling identity verification, 
secure transactions, and localized logistics.

## 🛠 Tech Stack
- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL 17
- **Architecture:** Service-Adapter Pattern (supports Mock/Real toggling)

## 🚀 Getting Started

### Prerequisites
- Node.js (v22+)
- PostgreSQL (v17)

### Installation
1. **Clone the repo:**
   ```bash
   git clone [https://github.com/idkreally001/omnirent-core.git](https://github.com/idkreally001/omnirent-core.git)

```

2. **Setup Backend:**
* Navigate to `/backend`
* Run `npm install`
* Create a `.env` file (see `.env.example`)
* Run the database schema found in `/backend/database/schema.sql`


3. **Setup Frontend:**
* Navigate to `/frontend`
* Run `npm install`



### Running the App

* **Backend:** `node server.js` (starts on port 5000)
* **Frontend:** `npm run dev` (starts on port 5173)

## 🏗 System Architecture

We use a **Service-Adapter pattern**. This allows us to switch between `Mock` data
(for local testing) and `Real` APIs (for production) without changing the core business logic.
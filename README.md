# OmniRent 🚀

> A Peer-to-Peer "Everything" Rental Marketplace (localized for Turkey)

------------------------------------------------------------------------

## 📌 Project Overview

OmniRent is a managed marketplace designed to transition society from
**"Ownership" to "Access."**\
Built for **SENG 204**, it utilizes a high-trust intermediary model
handling:

-   Identity verification\
-   Secure transactions\
-   Localized logistics

------------------------------------------------------------------------

## 🛠 Tech Stack

-   **Frontend:** React (Vite) + Tailwind CSS\
-   **Backend:** Node.js + Express\
-   **Database:** PostgreSQL 17\
-   **Architecture:** Service-Adapter Pattern (supports Mock/Real
    toggling)

------------------------------------------------------------------------

## 🚀 Getting Started

### 📋 Prerequisites

-   Node.js (v22+)
-   PostgreSQL (v17)

------------------------------------------------------------------------

## 🔧 Installation

### 1️⃣ Clone the Repository

``` bash
git clone https://github.com/idkreally001/omnirent-core.git
cd omnirent-core
```

------------------------------------------------------------------------

### 2️⃣ Setup Backend

``` bash
cd backend
npm install
```

-   Create a `.env` file (see `.env.example`)
-   Run the database schema located at:

```{=html}
<!-- -->
```
    /backend/database/schema.sql

-   Start the backend:

``` bash
node server.js
```

> Backend runs on: **http://localhost:5000**

------------------------------------------------------------------------

### 3️⃣ Setup Frontend

``` bash
cd frontend
npm install
npm run dev
```

> Frontend runs on: **http://localhost:5173**

------------------------------------------------------------------------

## 🏗 System Architecture

We use a **Service-Adapter Pattern**.

This allows us to:

-   Switch between **Mock data** (for local testing)
-   And **Real APIs** (for production)

Without changing the core business logic.


## 🧠 Concept

OmniRent promotes a shift from:

> ❌ Ownership → ✅ Access

By enabling secure, peer-to-peer rentals with centralized trust
management.

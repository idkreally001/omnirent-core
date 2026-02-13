# OmniRent 🚀

> A Peer-to-Peer "Everything" Rental Marketplace\
> Localized for Turkey \| Built for SENG 204

------------------------------------------------------------------------

## 📌 Overview

**OmniRent** is a managed peer-to-peer rental marketplace designed to
transition society from **ownership** to **access**.\
Instead of purchasing items that are rarely used, users can securely
rent what they need --- when they need it.

The platform operates under a **high-trust intermediary model**, where
OmniRent handles:

-   Identity verification\
-   Secure payment processing\
-   Dispute management\
-   Localized logistics coordination

This ensures safety, transparency, and reliability for both renters and
item owners.

------------------------------------------------------------------------

## 🎯 Objectives

-   Promote sustainable consumption
-   Reduce unnecessary ownership
-   Provide secure peer-to-peer transactions
-   Enable scalable architecture with mock/real API switching

------------------------------------------------------------------------

## 🛠 Technology Stack

| Layer \| Technology \|

\|-------------\|------------\| Frontend \| React (Vite) + Tailwind CSS
\| \| Backend \| Node.js + Express \| \| Database \| PostgreSQL 17 \| \|
Architecture\| Service--Adapter Pattern \|

------------------------------------------------------------------------

## 🏗 System Architecture

OmniRent follows a **Service--Adapter Pattern**.

This architecture enables:

-   Seamless switching between **Mock data** (development/testing)
-   Integration with **Real APIs** (production)
-   Clean separation of business logic from infrastructure

This improves maintainability, scalability, and testability.

------------------------------------------------------------------------

## 🚀 Getting Started

### 📋 Prerequisites

-   Node.js (v22+)
-   PostgreSQL (v17+)

------------------------------------------------------------------------

## 🔧 Installation

### 1️⃣ Clone the Repository

``` bash
git clone https://github.com/idkreally001/omnirent-core.git
cd omnirent-core
```

------------------------------------------------------------------------

### 2️⃣ Backend Setup

``` bash
cd backend
npm install
```

Create a `.env` file using `.env.example` as reference.

Initialize the database using:

    /backend/database/schema.sql

Start the backend server:

``` bash
node server.js
```

Backend runs on:

    http://localhost:5000

------------------------------------------------------------------------

### 3️⃣ Frontend Setup

``` bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

    http://localhost:5173

------------------------------------------------------------------------

## 📂 Project Structure

    omnirent-core/
    │
    ├── backend/
    │   ├── database/
    │   ├── routes/
    │   ├── services/
    │   ├── adapters/
    │   └── server.js
    │
    ├── frontend/
    │   ├── src/
    │   └── ...
    │
    └── README.md

------------------------------------------------------------------------

## 🔐 Security & Trust Model

OmniRent prioritizes user safety by:

-   Verifying identities
-   Handling payment escrow
-   Maintaining transaction logs
-   Enabling transparent dispute resolution

------------------------------------------------------------------------

## 🌍 Vision

OmniRent aims to support a cultural shift:

> ❌ Ownership\
> ✅ Access

By making temporary access to goods safe, affordable, and convenient.

------------------------------------------------------------------------

## 📄 License

This project was developed for academic purposes (SENG 204). Further
licensing terms may be added in future releases.

------------------------------------------------------------------------

## 👥 Authors

Developed as part of the SENG 204 coursework.

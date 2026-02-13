# OmniRent: The Universal Sharing Marketplace

OmniRent is a high-trust, peer-to-peer (P2P) rental platform designed to facilitate the temporary exchange of physical goods. By transitioning from a model of "Ownership" to "Access," OmniRent provides a secure ecosystem for users to monetize underutilized assets and access premium equipment on demand.

## 🚀 Key Features
* **Identity Verification:** Multi-layer security checks for all participants.
* **Managed Logistics:** Integrated "Hub" system for secure item drop-off and pickup.
* **Smart Escrow:** Automated security deposit provisioning and payment protection.
* **Dynamic Inventory:** State-machine logic for real-time item availability tracking.

## 🛠 Tech Stack
* **Frontend:** React (Vite) + Tailwind CSS
* **Backend:** Node.js (Express)
* **Database:** PostgreSQL 17
* **Architecture:** Modular Service-Adapter Pattern

## 🏁 Getting Started

### Prerequisites
* Node.js (v22+)
* PostgreSQL (v17+)

### Installation
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-repo/omnirent-core.git](https://github.com/your-repo/omnirent-core.git)
    ```
2.  **Setup Backend:**
    ```bash
    cd backend
    npm install
    # Create a .env file based on the documentation
    node server.js
    ```
3.  **Setup Frontend:**
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

## 🏗 System Architecture
The project follows a **Service-Adapter pattern**, allowing for seamless transitions between mock development environments and production-grade API integrations.
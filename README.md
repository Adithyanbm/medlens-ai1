# MedLens AI

MedLens AI is an intelligent healthcare platform designed to enhance medication safety and management. It empowers users to verify medicines, check for dangerous drug interactions, and manages prescriptions, while providing pharmacists with a dedicated dashboard for oversight.

## Key Features

- **Medicine Verification**: AI-powered analysis to verify the authenticity and details of medicines.
- **Interaction Checker**: Instantly check for potential adverse interactions between multiple medications.
- **Prescription Management**: Upload, store, and manage digital prescriptions with ease.
- **Pharmacist Dashboard**: specialized interface for pharmacists to review prescriptions and manage inventory.
- **Role-Based Access**: Secure authentication handling distinct patient and pharmacist workflows.
- **Safety Alerts**: Real-time notifications and safety trend monitoring.

## Tech Stack

**Frontend:**
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) (Icons)

**Backend:**
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) (Mongoose)

**Testing:**
- [Jest](https://jestjs.io/)
- [Supertest](https://github.com/ladjs/supertest)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (Local or Atlas connection string)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Adithyanbm/medlens-ai1.git
    cd medlens-ai
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    cd ..
    ```

### Configuration

Create a `.env` file in the `backend` directory (and root if needed) with your environment variables:

**backend/.env**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Running the Application

1.  **Start the Backend:**
    ```bash
    cd backend
    npm start
    # Or for development with auto-restart:
    npm run dev
    ```

2.  **Start the Frontend:**
    Open a new terminal in the root directory:
    ```bash
    npm run dev
    ```

The frontend will be available at `http://localhost:5173` (or the port shown in your terminal).
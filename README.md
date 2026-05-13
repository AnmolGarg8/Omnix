# 🌌 Omnix | AI Agent Orchestration Platform

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-v0.100+-05998b?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Omnix** is a high-performance, enterprise-grade orchestration platform designed to deploy, monitor, and manage autonomous AI agents at scale. It combines a lightning-fast FastAPI backend with a sleek, responsive Next.js frontend to provide a seamless experience for AI developers and operators.

---

## ✨ Key Features

- **🚀 Mission Control:** Centralized dashboard to launch and manage complex AI agent missions.
- **🛰️ Real-time Observability:** Live mission tracking powered by WebSockets and high-fidelity logging.
- **🧠 Advanced AI Stack:** Native integration with **Groq** for sub-second inference and **VoyageAI** for state-of-the-art embeddings.
- **🛡️ Secure & Scalable:** Integrated with **Clerk** for modern authentication and **Upstash Redis** for globally distributed state management.
- **📈 Comprehensive Monitoring:** Full observability suite via **AgentOps** to track agent performance and costs.
- **🔔 Intelligent Alerting:** Automated system notifications and mission status updates via **Resend**.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Framer Motion (Animations)
- **UI Components:** Shadcn UI + Lucide React (Icons)
- **Auth:** Clerk (Enterprise-grade authentication)

### Backend
- **Framework:** FastAPI (Python 3.10+)
- **Database:** MongoDB (Motor Async Driver)
- **Caching/State:** Upstash Redis
- **AI Engine:** Groq API & VoyageAI
- **Observability:** AgentOps

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Deployment:** Vercel (Frontend) & Scalable Cloud Hosting (Backend)

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker & Docker Compose
- MongoDB Instance (Local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/AnmolGarg8/Omnix.git
cd Omnix
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env # Fill in your API keys
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.local.example .env.local # Fill in your Clerk keys
npm run dev
```

### 4. Running with Docker
```bash
docker-compose up --build
```

---

## 📂 Project Structure

```text
Omnix/
├── backend/            # FastAPI Application
│   ├── routers/        # API Endpoints
│   ├── services/       # Business Logic & AI Services
│   ├── models/         # Database Schemas
│   └── db/             # Database Connectivity
├── frontend/           # Next.js Application
│   ├── app/            # App Router Pages
│   ├── components/     # Reusable UI Components
│   └── lib/            # Utilities & API Hooks
├── docker-compose.yml  # Container Orchestration
└── vercel.json         # Deployment Configuration
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/AnmolGarg8">Anmol Garg</a>
</p>

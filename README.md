# 🛡️ ENERGON X — Next-Gen Security Operations Center (SOC) & Threat Intelligence Platform

<p align="center">
  <img src="https://img.shields.io/badge/SECURITY-SOC%20Engine-blueviolet?style=for-the-badge&logo=shield" alt="Security SOC Engine Badge" />
  <img src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=vite" alt="Build Passing Badge" />
  <img src="https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript%20%7C%20Tailwind-blue?style=for-the-badge&logo=react" alt="Frontend Badge" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20Python-green?style=for-the-badge&logo=nodedotjs" alt="Backend Badge" />
  <img src="https://img.shields.io/badge/License-MIT-orange?style=for-the-badge" alt="License Badge" />
</p>

<p align="center">
  <strong>EnergonX</strong> is a production-grade cybersecurity command center engineered for modern SOC workflows, real-time threat telemetry, vulnerability intelligence, network reconnaissance, and analyst-focused incident visibility.
</p>

<p align="center">
  Built with a futuristic hacker aesthetic, the platform blends immersive visual analytics with actionable defensive workflows for blue-team operators, security learners, and full-stack cyber engineers.
</p>

<p align="center">
  <a href="https://maniiverma.github.io/EnergonX-SOC/"><strong>Live Frontend Portal</strong></a>
</p>

---

## Overview

**EnergonX** is an advanced full-stack SOC and Threat Intelligence Dashboard designed to centralize monitoring, vulnerability assessment, telemetry visualization, and recon-driven security awareness into a single operational interface.

It is structured for defenders who want more than static dashboards. The platform aims to simulate a real cyber defense environment with live visual context, real-time data flow, and modular backend security engines that can evolve into a serious production ecosystem.

---

## Core Capabilities

- **Interactive Global Attack Map** — Visualize hostile activity patterns and global threat movement using immersive 3D rendering workflows powered by WebGL-oriented libraries such as Three.js and Globe.gl.
- **Threat Intelligence Workspace** — Review CVE-linked intelligence, CVSS severity indicators, exploit context, risk summaries, and remediation guidance in a format built for rapid triage.
- **Vulnerability Analysis Engine** — Surface high-priority weaknesses, track severity posture, and support analyst decision-making with structured vulnerability data.
- **Network Reconnaissance Module** — Perform automated network sweeps, device discovery, ARP monitoring, and port scanning integration for situational awareness across target environments.
- **Real-Time Telemetry Dashboard** — Monitor bandwidth, latency, packet trends, and socket-driven live activity streams through high-density security visualizations.
- **Bug Bounty & Reporting Console** — Organize findings, maintain structured vulnerability records, and support export-friendly reporting workflows.
- **Analyst-Centric UI/UX** — Deliver a dark, glassmorphism-infused, hacker-style interface with high signal density, strong visual hierarchy, and operational focus.

---

## Why EnergonX

EnergonX is not positioned as a generic admin panel. It is designed as a cyber operations experience that combines aesthetics, telemetry, and defensive tooling into a single platform layer.

This makes it especially suitable for:

- Security dashboard portfolios.
- SOC simulation projects.
- Full-stack cybersecurity showcases.
- Threat-monitoring research prototypes.
- Blue-team learning environments.

---

## System Architecture

```text
EnergonX/
├── backend/                 # Express API, auth logic, service controllers, socket services
├── frontend/                # React + TypeScript + Vite dashboard application
└── security-engine/         # Python-based scanners, traffic analyzers, detection scripts
```

### Frontend Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS, Lucide Icons, React Icons
- **Visualization:** Three.js, Globe.gl, Recharts, Leaflet
- **Networking:** Axios, Socket.io Client

### Backend Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Realtime Layer:** Socket.io
- **API Role:** REST endpoints, control layer, service integration

### Security Engine

- **Language:** Python 3.10+
- **Use Cases:** Packet monitoring, reconnaissance automation, attack detection logic, scan orchestration

---

## Feature Breakdown

### 1. SOC Dashboard

The SOC dashboard acts as the operational nucleus of the platform, presenting threat visibility, network posture, severity snapshots, and active monitoring metrics in one place.

### 2. Threat Intelligence

This layer is built to help analysts inspect vulnerabilities with context instead of raw identifiers alone. CVE references, severity scoring, exploitability signals, and remediation direction all contribute to a more practical triage workflow.

### 3. Recon & Monitoring

The reconnaissance and monitoring modules support discovery-oriented security operations, including host awareness, device enumeration, ARP observation, and scan-driven inspection.

### 4. Live Security Visualization

EnergonX emphasizes visual comprehension. Instead of burying operators in logs alone, it translates activity into maps, charts, cards, and live panels that improve situational awareness.

---

## Quick Start

### Prerequisites

Ensure the following dependencies are available on your machine:

- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Python:** v3.10 or higher
- **Git:** Latest stable version recommended

### 1. Clone the Repository

```bash
git clone https://github.com/maniiverma/EnergonX-SOC.git
cd EnergonX-SOC
```

### 2. Start the Backend

```bash
cd backend
npm install
npm start
```

Backend service will typically run at:

```text
http://localhost:5000
```

### 3. Start the Frontend

```bash
cd ../frontend/energonx-dashboard
npm install
npm run dev
```

Frontend development server will typically run at:

```text
http://localhost:5173
```

---

## Environment Configuration

Create a `.env` file inside `frontend/energonx-dashboard/`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

For production deployment, configure the frontend to point toward your hosted backend service:

```env
VITE_BACKEND_URL=https://your-backend-service.onrender.com
```

> Keep secrets, API keys, and sensitive backend configuration out of the frontend environment file.

---

## Development Workflow

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend/energonx-dashboard
npm install
npm run dev
```

### Suggested Production Enhancements

To evolve EnergonX into a stronger production-ready platform, consider adding:

- JWT or session-based authentication with role-aware access control.
- Database-backed event persistence for alerts, reports, and telemetry history.
- Rate limiting, request validation, and secure headers for API hardening.
- Containerized deployment using Docker and reverse proxy routing.
- CI/CD pipelines for automated test, lint, build, and deployment stages.
- Centralized logging and alerting integrations.

---

## Deployment

### Frontend Deployment

If the frontend is configured for GitHub Pages deployment:

```bash
cd frontend/energonx-dashboard
npm run deploy
```

### Recommended Hosting Strategy

- **Frontend:** GitHub Pages, Vercel, or Netlify
- **Backend:** Render, Railway, VPS, or container platform
- **Security Engine:** Isolated worker service, private VM, or controlled internal execution environment

---

## Security Notes

This platform includes offensive-security-adjacent capabilities such as scanning and recon workflows. These modules should only be used in authorized environments, lab systems, local networks, or explicitly permitted assessment scopes.

Before public or enterprise deployment, add proper authentication, authorization, audit logging, rate limiting, secret management, and environment isolation.

---

## Use Cases

- **SOC Portfolio Project** — Showcase real-time security engineering skills.
- **Cybersecurity Learning Platform** — Explore practical monitoring and visualization workflows.
- **Threat Monitoring Prototype** — Build a foundation for future detection tooling.
- **Blue-Team Command Interface** — Present live operational concepts in a polished security UI.
- **Bug Bounty Operations Workspace** — Organize findings and reporting in a more structured interface.

---

## Roadmap Ideas

- SIEM-style alert ingestion.
- CVE feed automation.
- Asset inventory correlation.
- Threat actor tagging.
- Malware IOC enrichment.
- Multi-user analyst collaboration.
- PDF/JSON report pipelines.
- RBAC-based access controls.
- Historical telemetry storage.
- AI-assisted incident summarization.

---

## Author

**Developer:** Team Decepticons   
**GitHub:** [@maniiverma](https://github.com/maniiverma)  
**Project:** EnergonX SOC Platform

---

## Git Commands

Run the following commands from the project root directory:

```bash
cd "/home/manpreet/Energon X"
git add README.md
git commit -m "Added production-grade advanced README.md documentation"
git push origin main
```

---

## License

This project is licensed under the **MIT License** unless your repository specifies otherwise.

---

## Final Note

EnergonX represents a fusion of cybersecurity engineering, realtime visualization, and modern full-stack design. It is built to look sharp on GitHub, feel premium in demos, and scale into a stronger security platform over time.

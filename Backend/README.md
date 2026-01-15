
---

## 🛠️ **BACKEND README (NestJS)**

```md
# GistPin Backend

This is the **GistPin backend service**, built with **NestJS**.  
It acts as the off-chain layer that powers fast queries, moderation, indexing, and analytics.

The backend is designed for:
- Fetching nearby gists efficiently
- Indexing on-chain events from Flare
- Rate limiting and spam protection
- Supporting frontend clients

---

## 🧰 Tech Stack

- NestJS
- TypeScript
- PostgreSQL / MongoDB (configurable)
- Ethers.js (Flare event indexing)

---

## ⚙️ Project Setup

### Requirements
- Node.js ≥ 18
- Database (Postgres or MongoDB)

### Install
```bash
npm install

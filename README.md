# 🌿 FarmDirect — Direct Farmer-to-Customer Digital Marketplace

A presentation-ready full-stack web application connecting farmers directly with customers, complete with AI-powered demand forecasting and logistics management.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ — [nodejs.org](https://nodejs.org)
- **pnpm** — install once with `npm install -g pnpm`

### 1. Install Dependencies (one-time)
```powershell
cd C:\Users\DELL\Downloads\FarmDirect_updated
pnpm install --no-frozen-lockfile
```

### 2. Start the Backend API (Terminal 1)
```powershell
pnpm --filter @workspace/api-server dev
```
> API runs at **http://localhost:3000**

### 3. Start the Frontend (Terminal 2)
```powershell
pnpm --filter @workspace/farmdirect dev
```
> App runs at **http://localhost:5173**

---

## 🔑 Demo Login Credentials

Open **http://localhost:5173/login** in your browser.

### Customer Accounts (password: `customer123`)
| Name   | Email                          |
|--------|-------------------------------|
| Akhil  | customer1@farmdirect.com      |
| Priya  | customer2@farmdirect.com      |
| Rahul  | customer3@farmdirect.com      |
| Sneha  | customer4@farmdirect.com      |
| Ananya | customer5@farmdirect.com      |
| Kiran  | customer6@farmdirect.com      |
| Neha   | customer7@farmdirect.com      |
| Arjun  | customer8@farmdirect.com      |
| Divya  | customer9@farmdirect.com      |
| Varun  | customer10@farmdirect.com     |

### Farmer Accounts (password: `farmer123`)
| Name         | Email                      |
|--------------|---------------------------|
| Ramesh Kumar | farmer1@farmdirect.com    |
| Suresh Reddy | farmer2@farmdirect.com    |
| Ravi Kumar   | farmer3@farmdirect.com    |
| Mahesh Rao   | farmer4@farmdirect.com    |
| Srinivas     | farmer5@farmdirect.com    |
| Prakash      | farmer6@farmdirect.com    |
| Anil Kumar   | farmer7@farmdirect.com    |
| Rajesh       | farmer8@farmdirect.com    |
| Venkat       | farmer9@farmdirect.com    |
| Naveen       | farmer10@farmdirect.com   |

---

## 📋 Feature Overview

### Customer Features
- 🛒 Browse 20+ farm products with search, filter & sort
- 📦 Product details with farmer info, harvest date, organic badge
- 🛍️ Shopping cart (persisted in localStorage)
- 💳 Demo checkout (Cash on Delivery / UPI at doorstep)
- 📬 Order tracking with live status timeline
- 👤 Editable profile

### Farmer Features
- 📊 Dashboard with stats (Active Listings, Open Orders, Demand Rising)
- 📝 Add / Edit / Delete product listings
- 📥 Incoming order management (Accept → Preparing → Picked Up → Delivered)
- 🤖 **AI Demand Forecast** — historical trend model with product-by-product predictions
- 🚚 Logistics view — delivery stops, routes, on-time rate
- 📈 Sales Analytics — monthly bar chart, category breakdown
- 👤 Editable farm profile

---

## 🏗️ Project Structure

```
FarmDirect_updated/
├── artifacts/
│   ├── farmdirect/          ← React + Vite frontend (Tailwind CSS)
│   │   └── src/
│   │       ├── App.tsx      ← All pages in one file (routing + components)
│   │       └── index.css    ← Design system (CSS variables + utilities)
│   └── api-server/          ← Express.js backend
│       └── src/
│           ├── index.ts     ← Server entry (port 3000)
│           ├── app.ts       ← Express app + middleware
│           └── routes/
│               └── farmdirect.ts  ← All API routes + in-memory data
└── lib/
    ├── api-client-react/    ← Generated React Query hooks
    ├── api-zod/             ← Zod validation schemas
    └── api-spec/            ← OpenAPI spec
```

---

## 🤖 AI Demand Forecasting

The forecast engine (in `api-server/src/routes/farmdirect.ts`) uses:

1. **Moving average** of 5 weeks of historical sales data
2. **Growth factor** = (last week / prev week)
3. **Trend multiplier** = overall growth rate × 0.35 damping factor
4. **Formula**: `Predicted = Average × RecentGrowth × (1 + Growth × 0.35)`

Products covered: Tomatoes, Potatoes, Onions, Rice, Wheat, Mangoes, Bananas, Spinach, Carrots, Green Peas.

Classifications: **HIGH** (>170 units), **MEDIUM** (95–170), **LOW** (<95)

---

## 🛠️ Technology Stack

| Layer    | Tech                                        |
|----------|---------------------------------------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Routing  | Wouter                                      |
| State    | TanStack React Query + localStorage         |
| Backend  | Node.js, Express 5                          |
| Database | In-memory (demo — no DB required)           |
| Charts   | Custom CSS bar charts (Analytics page)      |
| Fonts    | Manrope, Newsreader, DM Mono (Google Fonts) |

---

## ⚠️ Demo Notes

- All data is **in-memory** — restarting the backend resets orders/products to seed data
- Cart persists in **localStorage** across page refreshes
- No real payment processing — demo only
- The frontend proxies all `/api/*` requests to `http://localhost:3000`

<div align="center">

<img src="./icon-512.png" alt="STOC Logo" width="100" height="100" />

# 📦 STOC — Inventory Manager

**A Progressive Web App (PWA) for Factory Inventory Management**

[![PWA](https://img.shields.io/badge/PWA-Ready-blueviolet?style=for-the-badge&logo=pwa)](.)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](.)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)](.)
[![Offline](https://img.shields.io/badge/Offline-First-orange?style=for-the-badge)](.)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](.)

[🌐 Live Demo](#) · [📖 Docs](#) · [🐛 Report a Bug](https://github.com/Ayad-Mounir/STOC-PWA/issues)

---

</div>

## 🏭 Overview

**STOC** is a full-featured Progressive Web App (PWA) built for textile and garment factory inventory management. It runs entirely on mobile or desktop with no installation required, supports **offline mode**, and syncs automatically via Supabase.

> **Goal:** Track fabric rolls and raw materials, manage cutting/production/sales orders, and generate detailed reports — all from your phone.

---

## ✨ Key Features

### 📊 Dashboard
- Instant overview of inventory and active orders
- KPI cards: available items, cutting orders, production, and ready-to-ship
- Permission-based section access per user

### 📦 Inventory Management
- Two item types: **Rolls** (by meter/length) and **Bulk** (by quantity)
- Organize inventory with custom categories (fabrics, buttons, lining...)
- Track colors with photos and Hex codes per roll
- Monitor total inventory value and available quantities
- QR code scanning to instantly identify items

### ✂️ Full Production Cycle
```
📝 Draft  →  ✂️ Cutting  →  🏭 Production  →  ✅ Ready  →  📤 Shipped
```
- Create cutting orders with factory and model assignment
- Track rolls used and auto-calculate remaining stock
- Log manufacturing, dyeing, and packaging costs
- Calculate total cost per order

### 🛍️ Sales Management
- Separate sales orders from production orders
- Link orders to customers with per-piece selling price
- Manage finished goods inventory

### 📈 Advanced Reports
- Detailed reports by **Factory**, **Customer**, or **Supplier**
- Time filters: last week / month / year / custom range
- Overall summary across all entities
- **PDF export** with company header

### 🤖 AI Features
- **Auto Color Scan**: Upload a fabric roll photo and AI (Gemini API) identifies colors automatically
- High accuracy even through transparent wrapping

### 🔄 Sync & Offline
- **Offline-First**: All data saved locally first (IndexedDB + localStorage)
- Delta Sync via Supabase (only changed records synced)
- **Last-Write-Wins** conflict resolution with local pending protection
- Real-time connection status indicator

### 👥 Users & Permissions
- Role system: **Admin** and **Regular User**
- Customizable section access per user
- Offline login with encrypted credential backup
- QR Code-based license activation

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| **React 18** (CDN) | UI components with no build step |
| **Supabase** | Cloud database and real-time sync |
| **IndexedDB** | Local storage for large data (>5MB) |
| **Service Worker** | Caching and offline support |
| **jsPDF + html2canvas** | PDF report generation |
| **jsQR + qrcode.js** | QR code reading and generation |
| **Gemini API** | AI-powered fabric color analysis |
| **Cairo Font** | Professional Arabic typeface |

### Project Structure

```
STOC-PWA/
├── index.html              # Entry point — Arabic RTL
├── manifest.json           # PWA configuration
├── sw.js                   # Service Worker (Cache v11)
├── icon-192.png
├── icon-512.png
├── css/
│   ├── base.css            # Base styles (Dark theme)
│   ├── components.css      # Reusable UI components
│   └── reports.css         # Report & print styles
├── js/
│   ├── config.js           # Constants and shared utilities
│   ├── db.js               # Data layer (IDB + Sync Engine)
│   ├── sync.js             # Supabase Realtime Sync Layer
│   ├── auth.js             # License & authentication system
│   ├── i18n.js             # Multilingual support (AR/FR/EN)
│   ├── ui.js               # Shared React components
│   ├── pdf.js              # PDF generation logic
│   ├── qr.js               # QR read/generate
│   ├── pwa.js              # PWA install logic
│   ├── loader.js           # Splash screen with progress bar
│   ├── error-handler.js    # Global error handling
│   └── pages/
│       ├── app.js          # Root component + routing
│       ├── dashboard.js    # Main dashboard
│       ├── inventory.js    # Inventory management + AI Scan
│       ├── orders.js       # Cutting & production orders
│       ├── reports.js      # Reports center
│       └── settings.js     # Settings & catalog
└── libs/                   # Bundled libraries (offline-ready)
    ├── react.min.js
    ├── react-dom.min.js
    ├── supabase.min.js
    ├── jsqr.min.js
    ├── qrcode.min.js
    ├── jspdf.min.js
    └── html2canvas.min.js
```

---

## 🚀 Deployment

### Requirements
- A free [Supabase](https://supabase.com) account
- Any static HTTPS host (GitHub Pages, Netlify, Vercel...)
- No Node.js or build tools required ✅

### 1. Database Setup (Supabase)

Create a new Supabase project and run this SQL:

```sql
CREATE TABLE stk_data (
  id text NOT NULL,
  tbl text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  updated_at bigint NOT NULL DEFAULT 0,
  deleted_at bigint,
  PRIMARY KEY (id, tbl)
);

CREATE TABLE stk_config (key text PRIMARY KEY, value text);

CREATE TABLE stk_meta (
  id int PRIMARY KEY DEFAULT 1,
  ts bigint DEFAULT 0,
  reset_at bigint DEFAULT 0,
  order_seq int DEFAULT 0
);
INSERT INTO stk_meta (id) VALUES (1) ON CONFLICT DO NOTHING;

CREATE TABLE stoc_licenses (
  code text PRIMARY KEY,
  frozen boolean DEFAULT false,
  expires timestamptz
);
```

> **Important:** Enable **Realtime** on the `stk_data` table from the Supabase dashboard.

### 2. Deploy

**GitHub Pages (recommended):**
```bash
git clone https://github.com/Ayad-Mounir/STOC-PWA.git
cd STOC-PWA
git push origin main
```
Then enable GitHub Pages from the Repository settings.

### 3. First-Time Setup

1. Open the app → enter your **Supabase URL** and **Anon Key**
2. Get them from Supabase → Project Settings → API
3. Create a license in the `stoc_licenses` table and activate via QR
4. Log in and start managing your inventory 🎉

---

## 📱 Install as App

| Device | How to Install |
|--------|---------------|
| **Android** | Chrome → ⋮ → "Add to Home Screen" |
| **iPhone/iPad** | Safari → Share → "Add to Home Screen" |
| **Windows/Mac** | Chrome/Edge → install icon in address bar |

---

## 🌍 Language Support

| Language | Code | Status |
|----------|------|--------|
| Arabic 🇲🇦 | `ar` | ✅ Complete (default) |
| French 🇫🇷 | `fr` | ✅ Supported |
| English 🇬🇧 | `en` | ✅ Supported |

Change language from **Settings → Language tab**.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│                   UI Layer                   │
│           React 18 (Vanilla CDN)            │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│                 Data Layer                   │
│   IndexedDB (large) + localStorage (small)  │
│       ← Always the primary source →         │
└──────────────────┬──────────────────────────┘
                   │ Delta Sync (LWW)
┌──────────────────▼──────────────────────────┐
│              Supabase Cloud                  │
│     PostgreSQL + Realtime Subscriptions     │
└─────────────────────────────────────────────┘
```

**Sync flow:**
1. Any change → saved locally immediately + added to `pending_queue`
2. On connection → `push` pending to Supabase
3. `pull` Delta (only changes since last sync)
4. `merge` using Last-Write-Wins with local pending protection

---

## 🔐 Security

- Passwords hashed with SHA-256 before local storage
- License verified online via Supabase with offline fallback
- No plaintext passwords stored anywhere

---

## 🤝 Contact

This project is currently **closed source**. For inquiries:

- **GitHub:** [@Ayad-Mounir](https://github.com/Ayad-Mounir)
- **Email:** contact.ayad.mounir@gmail.com
- **WhatsApp:** [+212 6 53 86 76 67](https://wa.me/212653867667)

---

## 📄 License

This project is under a proprietary license. All rights reserved © 2025–2026 Ayad Mounir.

---

<div align="center">

**STOC v5 — Stock Manager PWA**

</div>

# ZKS Fragrances — Full-Stack E-Commerce Platform

A direct-to-consumer premium fragrance brand website for Pakistan. WhatsApp-native checkout, Google Sheets order logging, MongoDB persistence.

---

## 🗂️ Project Structure

```
zks-fragrances/
├── frontend/          ← Static site (deploy to Vercel)
│   ├── index.html     ← Homepage
│   ├── shop.html      ← Catalog with filters
│   ├── product.html   ← Product detail (dynamic via URL param)
│   ├── cart.html      ← Cart + WhatsApp checkout
│   ├── about.html     ← Brand story
│   ├── policies.html  ← Return, shipping, privacy, HAZMAT
│   ├── css/           ← main, components, animations, responsive
│   ├── js/            ← data, main, shop, product, cart, quiz, checkout, animations
│   └── assets/        ← images, brand logo SVG
│
├── backend/           ← Node.js API (deploy to Render)
│   ├── server.js
│   ├── routes/        ← orders.js, health.js
│   ├── controllers/   ← orderController.js
│   ├── models/        ← Order.js (Mongoose)
│   ├── services/      ← googleSheets.js
│   ├── middleware/    ← cors.js, errorHandler.js
│   ├── config/        ← db.js
│   └── .env.example
│
└── README.md
```

---

## ⚡ Local Development

### Frontend (no build needed)
Open `frontend/index.html` in a browser, or use VS Code Live Server:
```bash
# Using npm's serve package
npx serve frontend
# Visit: http://localhost:3000
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (see Environment Variables section)
npm run dev
# API runs at http://localhost:3000
```

---

## 🔑 Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Full JSON of service account credentials (stringified) |
| `GOOGLE_SHEET_ID` | Spreadsheet ID from Google Sheets URL |
| `FRONTEND_URL` | Your Vercel deployment URL (e.g. `https://zks.vercel.app`) |
| `PORT` | Server port (default: 3000, auto-set by Render) |
| `NODE_ENV` | Set to `production` for deployment |

---

## 🚀 Deployment

### Frontend → Vercel
1. Push the `frontend/` folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set **Root Directory** to `frontend`
4. Deploy — `vercel.json` handles clean URLs and caching

### Backend → Render
1. Push the entire repo to GitHub
2. Go to [render.com](https://render.com) → New Web Service → Import repo
3. Set Build Command: `cd backend && npm install`
4. Set Start Command: `node backend/server.js`
5. Add all environment variables from `.env.example` in Render's dashboard
6. Deploy — `render.yaml` has the full config

### Database → MongoDB Atlas
1. Create a free M0 cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user and get the connection string
3. Set IP whitelist to `0.0.0.0/0` (Render uses dynamic IPs)
4. Paste connection string as `MONGODB_URI`

### Google Sheets Setup
1. Create a Google Sheets spreadsheet with a tab named **"Orders"**
2. Row 1 headers: `Order ID | Date & Time | Item Names | Qty Each | Total Price | Status`
3. Go to [Google Cloud Console](https://console.cloud.google.com)
4. Enable **Google Sheets API**
5. Create a **Service Account** and download the JSON key
6. Share the spreadsheet with the service account email (Editor access)
7. Set `GOOGLE_SERVICE_ACCOUNT_JSON` = the full JSON contents (stringified, one line)
8. Set `GOOGLE_SHEET_ID` = the ID from the Sheets URL

---

## 📱 Product Images

Place product images in `frontend/assets/images/products/`:

| Slug | Primary | Hover |
|---|---|---|
| `aqua-ember` | `aqua-ember.webp` | `aqua-ember-hover.webp` |
| `aqua-bloom` | `aqua-bloom.webp` | `aqua-bloom-hover.webp` |
| `dark-ember` | `dark-ember.webp` | `dark-ember-hover.webp` |
| `golden-hours` | `golden-hours.webp` | `golden-hours-hover.webp` |
| `illusion` | `illusion.webp` | `illusion-hover.webp` |
| `zks-tulip` | `zks-tulip.webp` | `zks-tulip-hover.webp` |
| `ultra-man` | `ultra-man.webp` | `ultra-man-hover.webp` |
| `velvet-soul` | `velvet-soul.webp` | `velvet-soul-hover.webp` |

Hero background: `frontend/assets/images/hero/hero-bg.webp` (compress to < 200KB)

> **Tip:** If images are missing, the site gracefully shows styled initials placeholders.

---

## 🛒 Checkout Flow

1. Customer adds items to cart (localStorage)
2. Clicks "Checkout via WhatsApp" → pre-checkout modal appears
3. Customer confirms → WhatsApp opens with pre-filled order message
4. Simultaneously, order POST to `/api/orders` saves to MongoDB + Google Sheets
5. Cart is cleared, thank-you screen appears

---

## 🔌 API Reference

### `POST /api/orders`
Create a new order.

**Request body:**
```json
{
  "orderId": "ZKS-1726000000000",
  "items": [
    { "id": "aqua-ember", "name": "Aqua Ember", "price": 2200, "qty": 1, "lineTotal": 2200 }
  ],
  "total": 2200,
  "timestamp": "2024-09-10T12:00:00.000Z",
  "source": "whatsapp"
}
```

**Response (201):**
```json
{ "success": true, "message": "Order created successfully.", "orderId": "ZKS-1726000000000" }
```

### `GET /api/health`
Returns API status, DB connection state, and uptime.

---

## 📦 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | HTML5, Vanilla CSS, Bootstrap 5, Vanilla JS (ES6+) |
| Backend | Node.js 18+, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Order Log | Google Sheets API v4 |
| Checkout | WhatsApp Business deep-link |
| Deploy (FE) | Vercel |
| Deploy (BE) | Render (free tier) |

---

## 📞 Contact & Support

- **WhatsApp**: +92 340 7122385
- **Instagram**: [@muhammadzakria917](https://www.instagram.com/muhammadzakria917?igsh=emF3MmJnbjA3Zjdp)

---

*© 2024 ZKS Fragrances. Crafted with intention.*

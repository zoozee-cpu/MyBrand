# ZKS Fragrances — Full-Stack E-Commerce Platform

Premium fragrance **direct-to-consumer e-commerce platform** built with a lightweight frontend and Node.js backend.
Orders are placed via **WhatsApp checkout** and automatically stored in **MongoDB and Google Sheets**.

---

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express.js-Backend-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple)
![Vercel](https://img.shields.io/badge/Vercel-Frontend-black)
![Render](https://img.shields.io/badge/Render-Backend-blue)

---

# Features

* Product catalog with filters
* Dynamic product pages
* Local cart using browser storage
* WhatsApp-based checkout
* Automatic order logging
* MongoDB database persistence
* Google Sheets order dashboard
* Mobile responsive design
* SEO friendly static pages

---

# Architecture

```
Customer Browser
       │
       │
       ▼
Frontend (HTML + JS)
       │
       │ Checkout Request
       ▼
Node.js API (Express)
       │
       ├── MongoDB Atlas
       │
       └── Google Sheets API
```

Frontend handles UI and cart logic while the backend records orders and syncs them to external services.

---

# Project Structure

```
zks-fragrances/
│
├── frontend/
│   ├── index.html
│   ├── shop.html
│   ├── product.html
│   ├── cart.html
│   ├── about.html
│   ├── policies.html
│   ├── css/
│   ├── js/
│   └── assets/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── services/
│   ├── middleware/
│   ├── config/
│   └── .env.example
│
└── README.md
```

---

# Local Development

## Frontend

Serve the static site:

```bash
npx serve frontend
```

Open:

```
http://localhost:3000
```

---

## Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

API runs at:

```
http://localhost:3000
```

---

# Environment Variables

Create `.env` in the backend folder.

| Variable                    | Description                        |
| --------------------------- | ---------------------------------- |
| MONGODB_URI                 | MongoDB Atlas connection string    |
| GOOGLE_SERVICE_ACCOUNT_JSON | Google service account credentials |
| GOOGLE_SHEET_ID             | Google Sheets spreadsheet ID       |
| FRONTEND_URL                | Frontend deployment URL            |
| PORT                        | Server port                        |
| NODE_ENV                    | Environment                        |

---

# Deployment

## Frontend (Vercel)

1. Push repository to GitHub
2. Import project on Vercel
3. Set root directory to:

```
frontend
```

4. Deploy

---

## Backend (Render)

Build command:

```bash
cd backend && npm install
```

Start command:

```bash
node backend/server.js
```

Add all environment variables in the Render dashboard.

---

## Database (MongoDB Atlas)

1. Create cluster
2. Create database user
3. Whitelist IP access
4. Add connection string to `MONGODB_URI`

---

# Google Sheets Setup

1. Create spreadsheet with sheet name:

```
Orders
```

Headers:

```
Order ID | Date & Time | Item Names | Qty Each | Total Price | Status
```

2. Enable **Google Sheets API**
3. Create **Service Account**
4. Share sheet with service account email
5. Add credentials to environment variables

---

# API

## POST `/api/orders`

Create a new order.

Example request:

```json
{
  "orderId": "ZKS-1726000000000",
  "items": [
    {
      "id": "aqua-ember",
      "name": "Aqua Ember",
      "price": 2200,
      "qty": 1,
      "lineTotal": 2200
    }
  ],
  "total": 2200,
  "timestamp": "2024-09-10T12:00:00.000Z",
  "source": "whatsapp"
}
```

Response:

```json
{
  "success": true,
  "orderId": "ZKS-1726000000000"
}
```

---

## GET `/api/health`

Returns API health status and database connectivity.

---

# Tech Stack

| Layer         | Technology                                 |
| ------------- | ------------------------------------------ |
| Frontend      | HTML5, CSS3, Bootstrap, Vanilla JavaScript |
| Backend       | Node.js, Express.js                        |
| Database      | MongoDB Atlas                              |
| Order Logging | Google Sheets API                          |
| Checkout      | WhatsApp deep link                         |
| Deployment    | Vercel + Render                            |

---

# Roadmap

Future improvements:

* Admin dashboard
* Payment gateway integration
* Email order confirmation
* Inventory management
* Analytics dashboard

---

# License

MIT License


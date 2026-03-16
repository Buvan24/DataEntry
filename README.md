# 📚 Biography Management System
### Full-Stack MERN Application

---

## 🚀 Quick Setup

### Prerequisites
- Node.js v16+ → https://nodejs.org
- MongoDB Community → https://www.mongodb.com/try/download/community
- VS Code

---

## Step 1 — Start MongoDB
Make sure MongoDB is running locally on port 27017.
- Windows: MongoDB runs as a service automatically after install
- Mac/Linux: run `mongod` in terminal

## Step 2 — Backend
```bash
cd backend
npm install
npm run dev
```
✅ Backend runs at: http://localhost:5000

## Step 3 — Frontend (new terminal)
```bash
cd frontend
npm install
npm start
```
✅ Frontend runs at: http://localhost:3000

---

## 🔑 Default Admin Login
| Field    | Value                  |
|----------|------------------------|
| Email    | admin@biography.com    |
| Password | Admin@123              |

---

## 📁 Project Structure

```
biography-management/
├── backend/
│   ├── middleware/auth.js          JWT token verification
│   ├── models/
│   │   ├── Member.js               Member schema (18 fields)
│   │   └── Masters.js              District/Union/Assembly/Area/Admin/Position schemas
│   ├── routes/
│   │   ├── auth.js                 POST /api/auth/login
│   │   ├── members.js              CRUD /api/members
│   │   ├── districts.js            CRUD /api/districts
│   │   ├── unions.js               CRUD /api/unions
│   │   ├── assemblies.js           CRUD /api/assemblies
│   │   ├── areas.js                CRUD /api/areas
│   │   ├── administrations.js      CRUD /api/administrations
│   │   ├── positions.js            CRUD /api/positions
│   │   └── reports.js              GET /api/reports/biography|category|stats
│   ├── server.js                   Express app entry point
│   ├── .env                        Environment config
│   └── package.json
│
└── frontend/
    ├── public/index.html
    └── src/
        ├── components/Layout/
        │   ├── AdminLayout.js      Sidebar + topbar layout
        │   └── AdminLayout.css
        ├── context/
        │   └── AuthContext.js      JWT auth state management
        ├── pages/
        │   ├── HomePage.js/css     Role selector landing page
        │   ├── AdminLoginPage.js/css  Secure admin login
        │   ├── AdminDashboard.js/css  Stats + navigation hub
        │   ├── MasterPage.js/css   Generic CRUD for all 6 master modules
        │   ├── DataEntryPage.js/css   Full biography form with search
        │   └── ReportsPage.js/css  Biography + Category reports with print
        ├── utils/api.js            Axios API helpers
        ├── App.js                  Router + protected routes
        ├── index.js                React entry point
        └── index.css               Global design system (CSS variables)
```

---

## 🗄️ Database Collections

| Collection      | Fields |
|-----------------|--------|
| members         | name, fatherName, dob, phone, address, partNumber, voterSerial, voterId, aadharNumber, partyMembership, district, union, assembly, area, administration, position, joinDate, resignDate |
| districts       | name |
| unions          | name, district (ref) |
| assemblies      | name |
| areas           | name |
| administrations | name |
| positions       | name |

---

## 🌐 API Endpoints

| Method | Endpoint                   | Auth | Description            |
|--------|----------------------------|------|------------------------|
| POST   | /api/auth/login            | ❌   | Admin login            |
| GET    | /api/members               | ❌   | List/search members    |
| POST   | /api/members               | ❌   | Create member          |
| PUT    | /api/members/:id           | ❌   | Update member          |
| DELETE | /api/members/:id           | ❌   | Delete member          |
| GET    | /api/districts             | ❌   | List districts         |
| POST   | /api/districts             | ✅   | Add district           |
| PUT    | /api/districts/:id         | ✅   | Update district        |
| DELETE | /api/districts/:id         | ✅   | Delete district        |
| ...    | (same pattern for unions, assemblies, areas, administrations, positions) | | |
| GET    | /api/reports/biography     | ✅   | Biography report       |
| GET    | /api/reports/category      | ✅   | Category wise report   |
| GET    | /api/reports/stats         | ✅   | Dashboard statistics   |

---

## 🎨 UI Features
- ✅ Dark forest-green + gold design theme
- ✅ Playfair Display + DM Sans fonts
- ✅ Responsive (mobile-friendly)
- ✅ Sticky header on all pages
- ✅ Animated sidebar with hamburger on mobile
- ✅ Toast notifications for all actions
- ✅ Modal confirmations for delete
- ✅ Section-tabbed data entry form
- ✅ Live search in data entry
- ✅ Print-ready reports
- ✅ Member status badges (Active / Resigned)
- ✅ District-wise member bar chart on dashboard

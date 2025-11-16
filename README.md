# 🧭 WanderLust — Full-Stack Travel Stay Marketplace
An Airbnb-inspired full-stack web application that allows users to explore, book, and list travel accommodations. WanderLust provides an interactive map experience, secure authentication, image uploads, responsive UI, and a complete end-to-end booking workflow.

👉 **Live Demo:** https://wanderlust-wis2.onrender.com/
👉 **GitHub Repo:** https://github.com/AmitPrasad212003/WanderLust-FULL_STACK-

---

## 📘 Table of Contents
1. Project Overview
2. Features
3. Tech Stack
4. Project Structure
5. Getting Started
6. Environment Variables
7. Folder Descriptions
8. How It Works
9. Deployment
10. Contributing

---

## 1. 🚀 Project Overview
WanderLust is designed to make searching and hosting stays easy and intuitive:

- **Guests:** Browse, filter, and book stays across locations.
- **Hosts:** List properties, upload images, set pricing, manage listings.
- **Map Integration:** Visualize exact property locations using Mapbox.
- **Complete Backend:** Handles sessions, storage, data validation, and more.

---

## 2. ⭐ Features
- User Authentication (Signup/Login)
- Add/Edit/Delete Property Listings
- Full Booking System
- Cloud Image Upload (Cloudinary)
- Interactive Maps (Mapbox)
- Search + Filter
- Responsive Frontend (Bootstrap)
- Flash Messages for UX
- Form Validation

---

## 3. 🛠 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | EJS, Bootstrap, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Maps | Mapbox |
| File Storage | Cloudinary |
| Deployment | Render |

---

## 4. 📂 Project Structure

```
WanderLust/
├── controllers/
├── models/
├── routes/
├── views/
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── utils/
├── init/
├── app.js
├── cloudConfig.js
├── middleware.js
├── schema.js
└── package.json
```

---

## 5. ⚙️ Getting Started

### ✔️ Prerequisites
Install the following:

- Node.js (v14+)
- npm
- MongoDB / MongoDB Atlas
- Cloudinary account
- Mapbox account

---

### ✔️ Installation

1. **Clone Repository**
```bash
git clone https://github.com/AmitPrasad212003/WanderLust-FULL_STACK-.git
cd WanderLust-FULL_STACK-
```

2. **Install Dependencies**
```bash
npm install
```

3. **Create `.env` file**
(See next section)

4. **Run Project**
```bash
node app.js | nodemon app.js
```

Server starts on:
```
http://localhost:3000
```

---

## 6. 🔐 Environment Variables (`.env`)

Create a `.env` file in root:

```
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/wanderlust

SESSION_SECRET=your_session_secret_here

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

MAPBOX_TOKEN=your_mapbox_access_token
```

### What each variable means:

| Variable | Description |
|----------|-------------|
| `PORT` | Port to run server |
| `MONGODB_URI` | MongoDB database URI |
| `SESSION_SECRET` | Cookie/session security key |
| `CLOUDINARY_*` | Credentials for image uploads |
| `MAPBOX_TOKEN` | Mapbox API token |

⚠️ **Do NOT commit `.env` to GitHub**
Add `.env` to your `.gitignore`.

---

## 7. 📁 Folder Descriptions

- **controllers/** → Handles logic for listings, users, reviews.
- **models/** → MongoDB schemas (Listing, User, Review).
- **routes/** → Express routes for API endpoints.
- **views/** → EJS templates for frontend.
- **public/** → Static files (CSS, JS, images).
- **utils/** → Helper functions (Cloudinary, validation).
- **middleware.js** → Custom middleware for auth, validation.
- **cloudConfig.js** → Cloudinary config.

---

## 8. 🔄 How It Works

### User Flow:
1. User visits homepage
2. Views listings / searches locations
3. Clicks listing → Map + images + details
4. To book → Login required
5. Booking saved in database

### Host Flow:
1. Login
2. Create listing
3. Upload images
4. Set price + description
5. Listing becomes visible

### Backend Flow:
- Express routes → Controller → MongoDB model
- Images stored on Cloudinary
- Error handling + validation via middleware

---

## 9. 🚀 Deployment

You can deploy using:

- Render
- Railway
- Vercel (backend + frontend split)
- Heroku

Add all environment variables in hosting dashboard.

---

## 10. 🤝 Contributing

1. Fork repo
2. Create new branch
3. Commit changes
4. Push branch
5. Open Pull Request

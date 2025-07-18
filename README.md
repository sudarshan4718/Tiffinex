
# Tiffinex  
🍱 **Tiffin Management System - Backend**

This is the backend for a Tiffin Management System that connects users with local food providers. It supports secure OTP-based registration, food listing by providers, and order placement by users. Built using Node.js and MongoDB with Cloudinary integration for image uploads.

---

## 🚀 Features

- **User & Provider Registration/Login** with OTP-based verification  
- **JWT + Cookies** authentication for secure sessions  
- **Role-based access** (User vs Provider)  
- **Providers** can:
  - Post & manage food items
  - View orders received  
- **Users** can:
  - Browse available tiffins
  - Place and manage orders  
- **Image upload** support for food items via Cloudinary  
- **RESTful API** structure  

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (with Mongoose)  
- **Authentication**: OTP-based verification, JWT tokens, HTTP-only cookies  
- **File Uploads**: Cloudinary  
- **Environment Variables**: `dotenv`  

---

## 📁 Folder Structure

```
server/
│
├── controllers/         # Route handler logic
├── models/              # Mongoose schemas
├── routes/              # Express routes (User, Provider, Orders, Auth)
├── middleware/          # Auth & Error handlers
├── utils/               # OTP generator, email sender etc.
├── config/              # Cloudinary, DB setup
├── .env                 # Environment variables (not uploaded)
└── server.js            # Entry point
```

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sudarshan4718/tiffin-backend.git
   cd tiffin-backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Environment Variables**  
   Create a `.env` file in the root directory and add:

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start the Server**
   ```bash
   npm run server
   ```

---

## 📬 Sample API Endpoints

###  User
- `POST /api/user/register` – Register user
- `POST /api/user/verify-email` – Verify OTP and complete registration
- `POST /api/user/login` – Login with credentials
- `GET /api/user/logout` – Logout and clear cookies

### Provider
- `POST /api/provider/register` – Register Provider
- `GET /api/provider/login` – Login Provider

---

## 🔐 Security

- OTP-based verification for secure sign-up  
- JWT tokens stored as **HTTP-only cookies**  
- Role-based route protection with middleware  

---

## 🖼️ Cloudinary

All images uploaded by providers (e.g., food pictures) are securely stored in Cloudinary. Make sure your Cloudinary credentials are correctly added to your `.env` file.

---

## 📌 Todo

- Payment Integration
- Admin Dashboard  
- Order Delivery Tracking System  


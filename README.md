# CrediKhaata - Networth Tracker Backend

CrediKhaata is a RESTful backend service built using Node.js, Express, and MongoDB. It allows shopkeepers to manage customers, record credit sales (loans), track repayments, and receive overdue payment alerts.

## 🚀 Features

- User registration and authentication (JWT)
- CRUD operations for customers
- Loan creation, tracking, and status management
- Repayment tracking with partial payment handling
- Summary reports and overdue alerts
- Secure and scalable REST API

## 🧑‍💻 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcryptjs
- **Utilities:** dotenv, validator, moment.js

---

## 📁 Project Structure

```
credikhaata/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/ (optional)
│
├── .env
├── .gitignore
├── index.js (or app.js)
└── package.json
```

---

## 🔧 Installation and Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/credikhaata.git
   cd credikhaata
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory and add:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. **Run the application**
   ```bash
   npm start
   ```

---

## 📌 API Endpoints

### 🔐 Auth Routes

| Method | Endpoint     | Description         |
|--------|--------------|---------------------|
| POST   | `/register`  | Register a new user |
| POST   | `/login`     | Login and get token |

### 👥 Customer Routes (Protected)

| Method | Endpoint             | Description            |
|--------|----------------------|------------------------|
| POST   | `/customers`         | Add a new customer     |
| GET    | `/customers`         | Get all customers      |
| GET    | `/customers/:id`     | Get a customer by ID   |
| PUT    | `/customers/:id`     | Update customer details|
| DELETE | `/customers/:id`     | Delete a customer      |

### 💸 Loan Routes (Protected)

| Method | Endpoint         | Description               |
|--------|------------------|---------------------------|
| POST   | `/loans`         | Create a new loan         |
| GET    | `/loans`         | Get all user loans        |

### 💳 Repayment Routes (Protected)

| Method | Endpoint                  | Description               |
|--------|---------------------------|---------------------------|
| POST   | `/repayments/:loanId`     | Record a repayment        |

### 📊 Summary & Alerts (Protected)

| Method | Endpoint     | Description                        |
|--------|--------------|------------------------------------|
| GET    | `/summary`   | Get loan summary                   |
| GET    | `/overdue`   | List all customers with overdue loans |

---

## 🧪 Example Request & Response

### Register

**POST** `/register`
```json
{
  "email": "shop@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here"
}
```

---

## ✅ TODOs

- [ ] Add unit tests (optional)
- [ ] Integrate PDF receipts (bonus)
- [ ] Add SMS/WhatsApp notifications (mock or real)

---

## 📌 Deployment

This project can be deployed on platforms like **Render**, **Railway**, **Heroku**, etc.

### Example Steps (Render)
- Create a new web service
- Connect your GitHub repo
- Add environment variables in the Render dashboard
- Set start command: `node index.js`

---

## 📄 License

This project is for educational purposes as part of NxtWave’s CCBP 2.0 curriculum.

---

## 📬 Contact

For queries, contact the developer via GitHub or your assignment mentor.

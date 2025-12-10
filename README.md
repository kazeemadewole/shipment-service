# 🚚 Shipment Service API

A production-ready **Shipment Management API** built with **Node.js, TypeScript, Express, MongoDB (Mongoose)** and **InversifyJS**.  
This service allows you to create, update, retrieve, and delete shipment records with proper validation and pagination support.

---

## 🌍 Live Base URL --- https://shipment-service-ml08.onrender.com


---

## 📘 API Documentation (Postman)

You can explore and test all endpoints using the Postman documentation below:

🔗 **Postman Docs:**  
https://documenter.getpostman.com/view/12821764/2sB3dSP8Q4

---

## 🧪 How to Test the Endpoints

### ✅ Option 1: Using Postman (Recommended)

1. Open the Postman documentation link:
https://documenter.getpostman.com/view/12821764/2sB3dSP8Q4
2. Click **"Run in Postman"**
3. Select your environment or create a new one.
4. Update the `baseUrl` variable to: https://shipment-service-ml08.onrender.com
5. 5. Start testing all available endpoints:
- Create Shipment
- Get All Shipments (with pagination)
- Get Single Shipment
- Update Shipment
- Delete Shipment

---

### ✅ Option 2: Using cURL

#### Create a Shipment
```bash
curl -X POST https://shipment-service-ml08.onrender.com/shipments \
-H "Content-Type: application/json" \
-d '{
 "trackingNumber": "TRK123456",
 "senderName": "John Doe",
 "receiverName": "Jane Doe",
 "origin": "Lagos",
 "destination": "Abuja",
 "status": "pending"
}'
```

Get All Shipments (Paginated)
```bash
curl "https://shipment-service-ml08.onrender.com/shipments?page=1&limit=10"
```
Get a Single Shipment
```bash
curl "https://shipment-service-ml08.onrender.com/shipments/{shipmentId}"
```
Update a Shipment
```bash
curl -X PUT https://shipment-service-ml08.onrender.com/shipments/{shipmentId} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "delivered"
  }'
```

Delete a Shipment
```bash
curl -X DELETE https://shipment-service-ml08.onrender.com/shipments/{shipmentId}
```

Tech Stack

Node.js

TypeScript

Express.js

MongoDB + Mongoose

InversifyJS (Dependency Injection)

Jest (Testing)

Zod & Joi (Validation)

Render (Deployment)

Running the Project Locally
1️⃣ Clone the Repository
```bash
git clone https://github.com/kazeemadewole/shipment-service.git
cd shipment-service
```

2️⃣ Install Dependencies
```bash
npm install
```

3️⃣ Setup Environment Variables

Create a .env file in the root:
```bash
APP_ENV=development
PORT=4000
MONGO_URI=your_mongodb_connection_string
```

4️⃣ Run in Development Mode
npm run dev

5️⃣ Run Tests
```bash
npm test
```

✅ Features

Shipment CRUD operations

Pagination support

Input validation with Zod

Dependency Injection with Inversify

MongoDB with Mongoose

Centralized error handling

Unit testing with Jest

Production-ready deployment on Render




# 🏠 EazyPG

A full-stack web-based PG (Paying Guest) management system that allows **Owners**, **Tenants**, and **Admins** to manage and monitor day-to-day PG operations. Built using microservices with Spring Boot and React.

---

## 📌 Objective

To digitize the end-to-end management of PG accommodations — including room listings, bookings, payments, complaints, and communication — for tenants and owners, while providing administrative oversight.

---

## 🧩 Tech Stack

### 🔧 Backend
- **Language**: Java 17+
- **Framework**: Spring Boot 3.x
- **Database**: MySQL / PostgreSQL
- **ORM**: Hibernate (JPA)
- **Security**: Spring Security + JWT
- **Build Tool**: Maven
- **API Style**: RESTful APIs
- **Containerization**: Docker

### 💻 Frontend
- **Library**: React 18+
- **Routing**: React Router
- **Styling**: TailwindCSS / Bootstrap / Material-UI
- **HTTP Client**: Axios (with JWT Interceptors)
- **State Management**: Context API / Redux Toolkit (optional)

---

## 👥 User Roles

- **Admin**
- **PG Owner**
- **Tenant (User)**

---

## 📁 Modules & Features

### 1. 🔐 Authentication & Authorization
- User Registration (role-based)
- Login with JWT
- Role-based Access Control (Admin, Owner, Tenant)
- Forgot/Reset Password (optional)

### 2. 👤 User Management
- View/Add/Edit/Delete Users (Admin)
- View/Edit Profile (All Users)
- Change Password

### 3. 🏠 PG Property Management (Owner)
- Add/Edit/Delete PGs
- PG Details: Name, Type, Address, City, State, Pin, Contact Info
- Room Management (No., Type, Rent, Availability)
- Upload Room Images

### 4. 📆 Booking Management (Tenant)
- Search PGs by Location, Gender, Budget, etc.
- View PG Details and Rooms
- Book Room / Cancel Booking
- View Booking History

### 5. 💳 Payment Management
- Pay Rent Online via Payment Gateway (e.g., Razorpay/Stripe)
- Generate Invoice/Receipt
- View Payment History

### 6. 📢 Notice Board
- Owners post notices to tenants
- Tenants view announcements

### 7. 🛠 Complaint / Service Request System
- Tenants raise complaints or requests
- Admins/Owners manage status (Pending, In Progress, Resolved)

### 8. 📊 Reports (Admin/Owner)
- Total Tenants, Rooms, PGs
- Occupancy Report
- Payment Report
- Complaints Summary

---

## ⚙ Non-Functional Requirements

- JWT-Based Authorization
- Input Validation (Frontend & Backend)
- Pagination for List APIs
- Logging (Backend Logs + Frontend Errors)
- Optional: Caching, Docker, CI/CD pipeline

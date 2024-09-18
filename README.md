# resturantManagement
# 🍽️ Restaurant Listing Platform

## Overview 🌟

This is a **Restaurant Listing Platform** that allows users to discover, book tables, and leave reviews for restaurants. Business owners can list their restaurants, and admin users have full control over the platform. The app includes features such as **restaurant menus**, **images**, **addresses**, **pricing**, **user-reviews**, and more! 📋

### Features 🎯
- **JWT Authentication** 🔑 for secure access.
- **Role-based access** for three types of users: 
  - Business Owner 🍴
  - Regular User 👤
  - Admin 🔧
- **CRUD Operations** for managing business listings and reviews. 📝
- **Review System** with average ratings and responses from business owners. ⭐️

---

## 🎯 Objectives

1. **User Authentication**
   - 🔐 Implement JWT Authentication.
   - 👥 Create 3 user roles:
     - **Business Owner** 🍴
     - **User** 👤
     - **Admin** 🔧

2. **Business Listing Management**
   - 🏢 CRUD Operations for business listings.
   - Details include:
     - Listing Name 📛
     - Business Phone 📞
     - City, Address 📍
     - Images 🖼️

3. **Review Management**
   - 💬 Only logged-in users can write reviews.
   - 🍴 Business owners can respond to reviews.

---

## 📜 Listing Access Grid

| **Role**         | **Create** | **Read** | **Update** | **Delete** |
|------------------|------------|----------|------------|------------|
| **Business Owner**| Yes        | Yes      | Yes        | No         |
| **User**          | No         | Yes      | No         | No         |
| **Admin**         | Yes        | Yes      | Yes        | Yes        |

---

## 📝 Review Access Grid

| **Role**         | **Create** | **Read** | **Update** | **Delete** |
|------------------|------------|----------|------------|------------|
| **Business Owner**| No         | Yes      | Yes        | No         |
| **User**          | Yes        | Yes      | Yes        | Yes        |
| **Admin**         | Yes        | Yes      | Yes        | Yes        |

---

## 📦 Deliverables

1. 🔑 **JWT Authentication** with role-based access.
2. 👥 **Role-based Authorization** for listings and reviews.
3. 📋 Fully functional **CRUD Operations** for business listings and reviews.
4. 📈 **Review System** with average ratings and responses from business owners.

---

## ✅ Evaluation Criteria

1. 🎯 Correct implementation of **CRUD operations**, **user authentication**, and **role-based access**.
2. ⭐️ Effective **review system** with average ratings and business responses.
3. 💻 Visually appealing and feature-rich **dashboards** for business owners and users.
4. 📖 Clear **documentation**, including API documentation and a comprehensive README.
5. 🏆 Excellent **code quality**, organization, and adherence to **best practices**.
6. 📬 Fully functional API for testing endpoints in Postman.


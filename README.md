# 🧠 Skill-NodeJS

**Skill-NodeJS** is a REST API built with Node.js (v8), TypeScript, Express, SQLite2, and TypeORM.  
This project was developed as a personal portfolio sample to demonstrate my backend development skills.

> 📌 _Note: This project is not intended for production use. It is part of my technical portfolio._

---

## 🚀 Features

- Manage users and projects
- Assign skills to projects
- Token-based authentication with custom payloads

---

## 🛠️ Technologies Used

- **Node.js v8**
- **TypeScript**
- **Express**
- **SQLite2**
- **TypeORM**

---

## ⚙️ Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd skill-nodejs
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

---

## 📡 API Endpoints

### ➕ Initialize Sample Data

Create sample users with associated projects:

```http
GET http://localhost:3001/init
```

### 🔐 Generate Token

Generate an authentication token for a specific user:

```http
POST http://localhost:3001/token
Content-Type: application/json

{
    "userId": 1,
    "username": "Zoro"
}
```

---

## ▶️ Usage

After starting the development server, the API will be available at:

```
http://localhost:3001/
```

You can test the endpoints using tools like Postman or curl.

---

## 📄 License & Permissions

This project is licensed under the  
**Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)**.

**You may:**

- ✅ View, fork, and share this repository for personal or educational purposes

**You may not:**

- ❌ Use it for commercial purposes
- ❌ Modify or distribute derivative versions of this code

Full license details: [https://creativecommons.org/licenses/by-nc-nd/4.0/](https://creativecommons.org/licenses/by-nc-nd/4.0/)  
See the [`LICENSE`](./LICENSE) file in this repository.

---

## 👤 About the Author

Hi, I’m Alessio Baldini, a backend developer passionate about clean architecture, well-structured APIs, and modern TypeScript.  
Feel free to reach out on https://www.linkedin.com/in/alessio-baldini/ if you'd like to connect or collaborate.

---

**Thanks for checking out this project!**

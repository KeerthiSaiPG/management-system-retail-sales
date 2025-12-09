# Retail Sales Management System

## 1. Overview
A cloud-hosted full-stack Retail Sales Analytics System built using PostgreSQL, Express, and React.  
It provides advanced full-text search, multi-select filtering, sorting, and server-side pagination.  
Backend runs on **Render**, database on **Neon PostgreSQL**, and frontend on **Vercel**.  
The system is optimized for performance, correctness, and production deployment.


## 2. Tech Stack

### **Frontend**
- React (Vite)
- Axios
- React Hooks
- CSS-based responsive UI

### **Backend**
- Node.js + Express
- PostgreSQL (Neon)
- pg (node-postgres)
- express-validator
- compression
- cors

### **Deployment**
- **Frontend:** Vercel  
- **Backend:** Render  
- **Database:** Neon PostgreSQL  


## 3. Search Implementation Summary
- Full-text search on **Customer Name** and **Phone Number**.
- Case-insensitive using PostgreSQL `ILIKE`.
- Token-based search (all tokens must match).
- Runs on backend for accuracy and performance.
- Works together with filters, sorting, and pagination.



## 4. Filter Implementation Summary
Supports multi-select and range filters for:
- Customer Region  
- Gender  
- Age Range  
- Product Category  
- Tags  
- Payment Method  
- Date Range  

Filter features:
- Case-insensitive comparisons  
- Normalized and trimmed values  
- Fully server-side filtering  
- Combined using logical AND  
- Works seamlessly with search and sorting  


## 5. Sorting Implementation Summary
- Backend-powered SQL `ORDER BY` sorting.
- Supports:
  - Date  
  - Quantity  
  - Final Amount  
  - Customer Name  
- ASC or DESC mode.
- Applied after filtering and search, before pagination.



## 6. Pagination Implementation Summary
- Server-side pagination using SQL `LIMIT` and `OFFSET`.
- Uses `page` + `pageSize` to fetch slices.
- API returns:
  - `items`
  - `total`
  - `page`
  - `pageSize`
  - `totalPages`

Works consistently with all filters, sorting, and search inputs.



## 7. Setup Instructions

### **Backend Setup**

#### **Local Backend Setup**
```bash
cd backend
npm install
npm start
```
### **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

> **Note:**  
> The initial page load may take a few seconds.  
> This happens because the backend (Render) and the database (Neon) automatically enter an idle state when inactive.  
> On the first request, both services wake up, resulting in a brief delay.  
> After waking up, all subsequent requests perform normally.


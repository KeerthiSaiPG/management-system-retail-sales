# Retail Sales Management System

## 1. Overview

A full-stack Sales Analytics Dashboard built with React and Node.js. Features include full-text search, multi-select filtering, sorting, pagination, and CSV export. Backend handles all data operations efficiently using a precomputed search index and an optimized in-memory pipeline.

## 2. Tech Stack

**Frontend:** React, Vite, Axios, React Hooks
**Backend:** Node.js, Express, csv-parser, compression, AbortController-compatible pipeline
**Tools:** URLSearchParams, express-validator, in-memory caching, debouncing

## 3. Search Implementation Summary

* Full-text search on *Customer Name* and *Phone Number*.
* Case-insensitive tokenized match (`every()` token must match).
* Integrated with filters, sorting, and pagination.

## 4. Filter Implementation Summary

* Multi-select and range filters for: Region, Gender, Age Range, Category, Tags, Payment Method, Date Range.
* Case-insensitive matching, trimmed values, and CSV-safe parsing.
* Filters compose via AND logic and work alongside search and sorting.
* Backend authoritative: no client-side filtering duplication.

## 5. Sorting Implementation Summary

* Supports ASC/DESC ordering.
* Handles numeric fields, dates, and string fields with automatic detection.
* Sorting happens **after** search & filters but **before** pagination.

## 6. Pagination Implementation Summary

* Server-side pagination using page + pageSize.
* Pagination clamp ensures valid ranges and safe slicing.
* Response returns: `total`, `page`, `pageSize`, `totalPages`, and `items`.
* Works with search, filters, and sorting.

## 7. Setup Instructions

### Backend

```bash
cd backend
npm install
npm start
```

* Runs at: `http://localhost:4000`
* CSV file expected at: `backend/src/data/sales.csv`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

* Runs at: `http://localhost:5173` 

### Environment Variables

Create `.env` in frontend:

```
VITE_API_BASE=http://localhost:4000
```

# Project Architecture

## Overview

This document describes the architecture of the Retail Sales Management System project: backend, frontend, data flow, folder structure, and module responsibilities. It is intended to provide a clear, maintainable blueprint for development, testing, and operations.

---

## Backend architecture

### High-level

* **Runtime**: Node.js (ESM)
* **Framework**: Express
* **Data storage**: CSV file loaded into memory at startup. The codebase is designed to be easily swapped to a real DB (Postgres) if needed.
* **Main responsibilities**: authoritative handling of filtering, searching, sorting, pagination, and CSV export.

### Request lifecycle

1. HTTP request received by Express routes (e.g. `/api/sales`).
2. Validation middleware runs (query params validated and normalized).
3. Controller receives validated params and calls service layer.
4. Service layer constructs normalized query object and runs pipeline:

   * applySearch()
   * applyFilters()
   * applySorting()
   * applyPagination()
5. Controller formats response and returns JSON (or CSV for `/api/sales/export`).

### Key design decisions

* **Backend authoritative**: All filtering/sorting/pagination occur server-side to avoid duplication and ensure consistent results.
* **Stateless controllers**: Controllers are thin and deterministic; services contain the logic.
* **Testable app**: `app.js` exports the Express `app` so that tests can import it without starting the HTTP listener.

---

## Frontend architecture

### High-level

* **Framework**: React (Vite)
* **State**: local hook `useSalesQuery` centralizes all query state (search, filters, sort, page, pageSize) and synchronizes state to the URL so the UI is bookmarkable and shareable.
* **Data fetching**: single source `fetchSales()` (Axios wrapper) communicates with backend; supports AbortController for cancellable requests.
* **UI composition**: `DashboardLayout` (shell) composes `FilterPanel`, `TransactionsTable`, and header/controls. Components are small and focused.

### UX / performance features

* Debounced requests with AbortController to prevent flurries of requests while typing.

---

## Data flow

1. On load, frontend initializes `useSalesQuery` from `window.location.search`.
2. `useSalesQuery` builds the API query (search, filters, sort, page, pageSize) and triggers a debounced fetch.
3. The backend receives the request and applies validation.
4. Backend service runs search→filters→sort→paginate pipeline and returns a paginated response:

   ```json
   { success: true, total, page, pageSize, totalPages, items: [...] }
   ```
5. Frontend updates UI with `items` and meta values (total, totalPages). UI uses `items` for display and `total` to render summary cards.
6. User interactions (filters, date/age range, sort, page changes) update `useSalesQuery` which syncs to URL and re-fetches.

---

## Folder structure

```
Retail Sales Management System
    backend/
    src/    
        controllers/
            salesController.js  
        data/
            sales.csv  
        middleware/
            errorHandler.js 
            validateSalesQuery.js   
        routes/
            metadataRoutes.js
            salesRoutes.js
        services/  
            metadataService.js
            salesService.js
        utils/
            csvLoader.js
            queryHelpers.js
        app.js              
        index.js
    README.md

    frontend/
    src/
        api/
            salesApi.js
        components/
            FilterPanel.jsx
            PaginationControls.jsx
            ResponsiveShell.jsx
            SearchBar.jsx
            SortingDropdown.jsx
            TransactionsTable.jsx
        hooks/
            useSalesQuery.js     
        utils/
            options.js
            qsUtils.js
        App.css
        App.jsx
        index.css
        main.jsx      
        styles.css
    index.html
    README.md

    docs/
    architecture.md
README.md
```

---

## Module responsibilities

### backend/src/routes/

* **salesRoutes.js**: maps `/api/sales` and `/api/sales/export` to controllers. Applies validation middleware.
* **metadataRoutes.js**: returns unique values for filter dropdowns (productCategories, tags, paymentMethods, regions, genders).

### backend/src/controllers/

* **salesController.js**: thin adapters that call `salesService.getSales()` and `salesService.runPipelineNoPagination()` and format responses.

### backend/src/services/

* **salesService.js**: orchestration layer. Normalizes query params, uses `csvLoader.getSalesData()` and `queryHelpers` to compute and return paginated results. Implements caching (TTL) for repeated requests.
* **metadataService.js**: computes unique filter values from loaded data and caches them.

### backend/src/utils/

* **csvLoader.js**: reads `data/sales.csv`, normalizes fields, parses dates/numbers, precomputes `__searchText`, and exposes `getSalesData()`.
* **queryHelpers.js**: pure functions to apply search, filters, sorting, and pagination. Unit-test target.

### backend/src/middleware/

* **validateSalesQuery.js**: express-validator rules with `optional({checkFalsy:true})`, cross-field checks (ageMin ≤ ageMax, dateFrom ≤ dateTo).
* **errorHandler.js**: centralized error handling and 404 middleware.

### frontend/src/hooks/

* **useSalesQuery.js**: central hook that

  * initializes state from URL,
  * synchronizes state to URL,
  * debounces and cancels requests using AbortController,
  * exposes setters that reset page when filters/sort/search change.

### frontend/src/api/

* **salesApi.js**: axios GET wrapper that accepts an optional `signal` and builds a canonical query string.

### frontend/src/components/

* **FilterPanel.jsx**: renders glassy controls (multi-selects, date pickers, age slider/inputs) and calls `onFilterChange`.
* **TransactionsTable.jsx**: renders either table (desktop) or cards (mobile), handles pagination controls.
* **ResponsiveShell.jsx**: responsive layout + drawer behavior.


---

## Notes & Next Steps

* For production or large datasets: migrate CSV to Postgres and create indexes on search columns. Replace in-memory pipeline with DB queries.
* Consider streaming CSV export and adding server-side rate-limiting.

---


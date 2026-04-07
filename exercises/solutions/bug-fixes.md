# Bug Fixes Reference — Sample Project

This document lists all intentional bugs in the sample project and their fixes.
**For trainer reference only — do not distribute to participants.**

---

## Bug 1: Hardcoded Credentials (config.js)

**Location:** `src/config.js:9-10`
**Severity:** 🔴 Critical (Security)
**Issue:** Database password and API key are hardcoded in source code.

**Fix:** Use environment variables with defaults:
```javascript
const config = {
  port: process.env.PORT || 3000,
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: parseInt(process.env.DB_PORT) || 5432,
  dbUser: process.env.DB_USER || "admin",
  dbPassword: process.env.DB_PASSWORD,     // No default!
  apiKey: process.env.API_KEY,             // No default!
  maxPageSize: 100,
  defaultPageSize: 20,
};
```

---

## Bug 2: Missing Validation (utils.js)

**Location:** `src/utils.js:12-16`
**Severity:** 🟡 Warning (Logic)
**Issue:** `validateVehicle` doesn't check for `model` or validate `year` range.

**Fix:**
```javascript
function validateVehicle(vehicle) {
  if (!vehicle) return { valid: false, error: "Vehicle is required" };
  if (!vehicle.make) return { valid: false, error: "Make is required" };
  if (!vehicle.model) return { valid: false, error: "Model is required" };
  if (!vehicle.year || vehicle.year < 1886 || vehicle.year > new Date().getFullYear() + 1) {
    return { valid: false, error: "Year must be between 1886 and next year" };
  }
  return { valid: true };
}
```

---

## Bug 3: Non-Unique ID Generation (utils.js)

**Location:** `src/utils.js:22-24`
**Severity:** 🟡 Warning (Logic)
**Issue:** `Math.random() * 10000` can easily produce collisions.

**Fix:** Use `crypto.randomUUID()`:
```javascript
const crypto = require("crypto");

function generateId() {
  return crypto.randomUUID();
}
```

---

## Bug 4: Division by Zero + Missing Mileage (utils.js)

**Location:** `src/utils.js:30-35`
**Severity:** 🔴 Critical (Logic)
**Issue:** Crashes on empty array (NaN). Doesn't handle missing `mileage` field.

**Fix:**
```javascript
function calculateAverageMileage(vehicles) {
  if (!vehicles || vehicles.length === 0) return 0;
  let total = 0;
  let count = 0;
  for (const v of vehicles) {
    if (typeof v.mileage === "number") {
      total += v.mileage;
      count++;
    }
  }
  return count === 0 ? 0 : total / count;
}
```

---

## Bug 5: Off-by-One in Year Filter (utils.js)

**Location:** `src/utils.js:41`
**Severity:** 🟡 Warning (Logic)
**Issue:** Uses `<` instead of `<=` for endYear, excluding the boundary.

**Fix:**
```javascript
function filterByYearRange(vehicles, startYear, endYear) {
  return vehicles.filter(v => v.year >= startYear && v.year <= endYear);
}
```

---

## Bug 6: Wrong HTTP Status Code + Missing Sanitization (api.js)

**Location:** `src/api.js:68`
**Severity:** 🟡 Warning (Best Practice)
**Issue:** Returns 200 instead of 201 for resource creation. No input sanitization.

**Fix:**
```javascript
function createVehicle(req, res) {
  const validation = validateVehicle(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const newVehicle = {
    id: generateId(),
    make: String(req.body.make).trim(),
    model: String(req.body.model).trim(),
    year: parseInt(req.body.year),
    mileage: parseInt(req.body.mileage) || 0,
  };

  vehicles.push(newVehicle);
  res.status(201).json({ data: formatVehicle(newVehicle), message: "Vehicle created" });
}
```

---

## Summary

| # | Bug | File | Severity | Category |
|---|-----|------|----------|----------|
| 1 | Hardcoded credentials | config.js | 🔴 Critical | Security |
| 2 | Missing validation | utils.js | 🟡 Warning | Logic |
| 3 | Non-unique IDs | utils.js | 🟡 Warning | Logic |
| 4 | Division by zero + NaN | utils.js | 🔴 Critical | Logic |
| 5 | Off-by-one error | utils.js | 🟡 Warning | Logic |
| 6 | Wrong status code | api.js | 🟡 Warning | Best Practice |

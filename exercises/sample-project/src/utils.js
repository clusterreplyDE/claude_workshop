/**
 * Utility functions for the Workshop Sample API
 */

const crypto = require("crypto");

function validateVehicle(vehicle) {
  if (!vehicle) return { valid: false, error: "Vehicle is required" };
  if (!vehicle.make) return { valid: false, error: "Make is required" };
  if (!vehicle.model) return { valid: false, error: "Model is required" };
  const currentYear = new Date().getFullYear();
  if (typeof vehicle.year !== "number" || vehicle.year < 1886 || vehicle.year > currentYear + 1) {
    return { valid: false, error: `Year must be between 1886 and ${currentYear + 1}` };
  }
  return { valid: true };
}

function generateId() {
  return crypto.randomUUID();
}

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

/**
 * Filter vehicles by year range (inclusive)
 */
function filterByYearRange(vehicles, startYear, endYear) {
  return vehicles.filter(v => v.year >= startYear && v.year <= endYear);
}

/**
 * Sort vehicles by a given field
 */
function sortVehicles(vehicles, field, order = "asc") {
  return [...vehicles].sort((a, b) => {
    if (order === "asc") return a[field] > b[field] ? 1 : -1;
    return a[field] < b[field] ? 1 : -1;
  });
}

/**
 * Format vehicle for API response
 */
function formatVehicle(vehicle) {
  return {
    id: vehicle.id,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    mileage: vehicle.mileage,
    displayName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
  };
}

/**
 * Parse pagination parameters
 */
function parsePagination(query) {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  return { page, limit, offset: (page - 1) * limit };
}

module.exports = {
  validateVehicle,
  generateId,
  calculateAverageMileage,
  filterByYearRange,
  sortVehicles,
  formatVehicle,
  parsePagination,
};

/**
 * Utility functions for the Workshop Sample API
 */

/**
 * Validate a vehicle object
 * BUG 2: Missing validation for required fields (year can be negative, model can be empty)
 */
function validateVehicle(vehicle) {
  if (!vehicle) return { valid: false, error: "Vehicle is required" };
  if (!vehicle.make) return { valid: false, error: "Make is required" };
  // Missing: model validation
  // Missing: year range validation
  return { valid: true };
}

/**
 * Generate a unique ID
 * BUG 3: Not actually unique — Math.random() can produce collisions
 */
function generateId() {
  return Math.floor(Math.random() * 10000).toString();
}

/**
 * Calculate average mileage from a list of vehicles
 * BUG 4: Division by zero when array is empty, also doesn't handle missing mileage
 */
function calculateAverageMileage(vehicles) {
  let total = 0;
  for (const v of vehicles) {
    total += v.mileage;
  }
  return total / vehicles.length;
}

/**
 * Filter vehicles by year range
 * BUG 5: Off-by-one error — excludes endYear
 */
function filterByYearRange(vehicles, startYear, endYear) {
  return vehicles.filter(v => v.year >= startYear && v.year < endYear);
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

const {
  validateVehicle, generateId, calculateAverageMileage,
  filterByYearRange, sortVehicles, formatVehicle, parsePagination
} = require("./utils");

// In-memory data store (simulates a database)
const vehicles = [
  { id: "1", make: "BMW", model: "X5", year: 2023, mileage: 15000 },
  { id: "2", make: "BMW", model: "3 Series", year: 2022, mileage: 28000 },
  { id: "3", make: "BMW", model: "iX", year: 2024, mileage: 5000 },
  { id: "4", make: "Audi", model: "Q7", year: 2021, mileage: 42000 },
  { id: "5", make: "Mercedes", model: "GLE", year: 2023, mileage: 18000 },
];

/**
 * GET /api/vehicles
 * List vehicles with optional filtering and pagination
 */
function listVehicles(req, res) {
  let result = [...vehicles];

  // Filter by make
  if (req.query.make) {
    result = result.filter(v => v.make.toLowerCase() === req.query.make.toLowerCase());
  }

  // Filter by year range
  if (req.query.startYear && req.query.endYear) {
    result = filterByYearRange(result, parseInt(req.query.startYear), parseInt(req.query.endYear));
  }

  // Sort
  if (req.query.sort) {
    result = sortVehicles(result, req.query.sort, req.query.order);
  }

  // Paginate
  const { page, limit, offset } = parsePagination(req.query);
  const paged = result.slice(offset, offset + limit);

  res.json({
    data: paged.map(formatVehicle),
    pagination: { page, limit, total: result.length },
  });
}

/**
 * GET /api/vehicles/:id
 * Get a single vehicle by ID
 */
function getVehicle(req, res) {
  const vehicle = vehicles.find(v => v.id === req.params.id);
  if (!vehicle) {
    return res.status(404).json({ error: "Vehicle not found" });
  }
  res.json({ data: formatVehicle(vehicle) });
}

/**
 * POST /api/vehicles
 * Add a new vehicle
 */
function createVehicle(req, res) {
  const validation = validateVehicle(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const newVehicle = {
    id: generateId(),
    make: String(req.body.make).trim(),
    model: String(req.body.model).trim(),
    year: parseInt(req.body.year, 10),
    mileage: parseInt(req.body.mileage, 10) || 0,
  };

  vehicles.push(newVehicle);

  res.status(201).json({ data: formatVehicle(newVehicle), message: "Vehicle created" });
}

/**
 * DELETE /api/vehicles/:id
 * Delete a vehicle
 */
function deleteVehicle(req, res) {
  const index = vehicles.findIndex(v => v.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Vehicle not found" });
  }

  vehicles.splice(index, 1);
  res.json({ message: "Vehicle deleted" });
}

/**
 * GET /api/stats
 * Get vehicle statistics
 */
function getStats(req, res) {
  const makes = {};
  vehicles.forEach(v => {
    makes[v.make] = (makes[v.make] || 0) + 1;
  });

  res.json({
    totalVehicles: vehicles.length,
    averageMileage: calculateAverageMileage(vehicles),
    vehiclesByMake: makes,
    oldestYear: Math.min(...vehicles.map(v => v.year)),
    newestYear: Math.max(...vehicles.map(v => v.year)),
  });
}

module.exports = { listVehicles, getVehicle, createVehicle, deleteVehicle, getStats };

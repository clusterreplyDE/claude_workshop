const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  validateVehicle, generateId, calculateAverageMileage,
  filterByYearRange, sortVehicles, formatVehicle, parsePagination
} = require("../src/utils");

describe("validateVehicle", () => {
  it("should reject null input", () => {
    const result = validateVehicle(null);
    assert.equal(result.valid, false);
  });

  it("should reject vehicle without make", () => {
    const result = validateVehicle({ model: "X5", year: 2023 });
    assert.equal(result.valid, false);
  });

  it("should accept valid vehicle", () => {
    const result = validateVehicle({ make: "BMW", model: "X5", year: 2023 });
    assert.equal(result.valid, true);
  });

  // This test exposes BUG 2: missing model validation
  it("should reject vehicle without model", () => {
    const result = validateVehicle({ make: "BMW", year: 2023 });
    assert.equal(result.valid, false, "Vehicle without model should be invalid");
  });

  // This test exposes BUG 2: missing year validation
  it("should reject vehicle with invalid year", () => {
    const result = validateVehicle({ make: "BMW", model: "X5", year: -5 });
    assert.equal(result.valid, false, "Vehicle with negative year should be invalid");
  });
});

describe("generateId", () => {
  it("should return a string", () => {
    const id = generateId();
    assert.equal(typeof id, "string");
  });

  // This test may occasionally pass — but it exposes BUG 3 (collision risk)
  it("should generate unique IDs", () => {
    const ids = new Set();
    for (let i = 0; i < 100; i++) {
      ids.add(generateId());
    }
    assert.equal(ids.size, 100, "All 100 IDs should be unique");
  });
});

describe("calculateAverageMileage", () => {
  it("should calculate average correctly", () => {
    const vehicles = [
      { mileage: 10000 },
      { mileage: 20000 },
      { mileage: 30000 },
    ];
    assert.equal(calculateAverageMileage(vehicles), 20000);
  });

  // This test exposes BUG 4: division by zero
  it("should handle empty array", () => {
    const result = calculateAverageMileage([]);
    assert.equal(Number.isNaN(result), false, "Should not return NaN for empty array");
  });

  // This test exposes BUG 4: missing mileage
  it("should handle vehicles with missing mileage", () => {
    const vehicles = [{ mileage: 10000 }, {}];
    const result = calculateAverageMileage(vehicles);
    assert.equal(Number.isNaN(result), false, "Should not return NaN for missing mileage");
  });
});

describe("filterByYearRange", () => {
  const vehicles = [
    { year: 2020 }, { year: 2021 }, { year: 2022 }, { year: 2023 },
  ];

  it("should filter vehicles in range", () => {
    const result = filterByYearRange(vehicles, 2021, 2023);
    assert.equal(result.length, 3, "Should include 2021, 2022, and 2023");
  });

  // This test exposes BUG 5: off-by-one (excludes endYear)
  it("should include endYear in results", () => {
    const result = filterByYearRange(vehicles, 2021, 2023);
    const years = result.map(v => v.year);
    assert.ok(years.includes(2023), "endYear (2023) should be included");
  });
});

describe("sortVehicles", () => {
  const vehicles = [
    { make: "BMW", year: 2023 },
    { make: "Audi", year: 2021 },
    { make: "Mercedes", year: 2022 },
  ];

  it("should sort ascending by default", () => {
    const result = sortVehicles(vehicles, "year");
    assert.equal(result[0].year, 2021);
    assert.equal(result[2].year, 2023);
  });

  it("should sort descending", () => {
    const result = sortVehicles(vehicles, "year", "desc");
    assert.equal(result[0].year, 2023);
    assert.equal(result[2].year, 2021);
  });
});

describe("formatVehicle", () => {
  it("should format vehicle correctly", () => {
    const result = formatVehicle({ id: "1", make: "BMW", model: "X5", year: 2023, mileage: 15000 });
    assert.equal(result.displayName, "2023 BMW X5");
    assert.equal(result.id, "1");
  });
});

describe("parsePagination", () => {
  it("should use defaults", () => {
    const result = parsePagination({});
    assert.equal(result.page, 1);
    assert.equal(result.limit, 20);
    assert.equal(result.offset, 0);
  });

  it("should parse custom values", () => {
    const result = parsePagination({ page: "3", limit: "10" });
    assert.equal(result.page, 3);
    assert.equal(result.limit, 10);
    assert.equal(result.offset, 20);
  });
});

// Configuration for the Workshop Sample API

const config = {
  port: process.env.PORT || 3000,
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: parseInt(process.env.DB_PORT, 10) || 5432,
  dbUser: process.env.DB_USER || "admin",
  dbPassword: process.env.DB_PASSWORD,
  apiKey: process.env.API_KEY,
  maxPageSize: 100,
  defaultPageSize: 20,
};

module.exports = config;

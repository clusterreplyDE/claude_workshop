// Configuration for the Workshop Sample API
// BUG 1: Hardcoded credentials (security issue — should use env vars)

const config = {
  port: process.env.PORT || 3000,
  dbHost: "localhost",
  dbPort: 5432,
  dbUser: "admin",
  dbPassword: "supersecret123",   // TODO: Move to environment variable!
  apiKey: "sk-1234567890abcdef",  // TODO: This should not be in code!
  maxPageSize: 100,
  defaultPageSize: 20,
};

module.exports = config;

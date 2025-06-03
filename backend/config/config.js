// config/config.js

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`
});


module.exports = {
  port: process.env.PORT || 8080,
  db: {
    host: process.env.DB_HOST || "switchyard.proxy.rlwy.net",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "HwHIRXdQHQHmqNwoNOrSuolhXHmKGhLB",
    name: process.env.DB_NAME || "railway",
    port: process.env.DB_PORT || 3306,
  },
  secretKey: process.env.SECRET_KEY || "default_secret",
};
console.log("Host: ", process.env.DB_HOST);
console.log("User: ", process.env.DB_USER);
console.log
("Password: ", process.env.DB_PASSWORD);
console.log("Name: ", process.env.DB_NAME);
console.log("Port: ", process.env.DB_PORT);
console.log("Secret Key: ", process
.env.SECRET_KEY);
console.log("Port: ", process.env.PORT);

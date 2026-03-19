const app  = require('./src/app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5001;

console.log("Starting server...");

app.listen(PORT, () => {
  console.log('─────────────────────────────────────────');
  console.log(`  CampusCare API started successfully`);
  console.log(`  Environment : ${process.env.NODE_ENV}`);
  console.log(`  Port        : ${PORT}`);
  console.log(`  Health check: http://localhost:${PORT}/api/health`);
  console.log('─────────────────────────────────────────');
});

// 🔥 IMPORTANT FIX
setInterval(() => {}, 1000);
const prisma = require('../config/db');

const generateComplaintNo = async () => {
  const year  = new Date().getFullYear();
  const count = await prisma.complaint.count();
  const seq   = String(count + 1).padStart(5, '0');
  return `CC-${year}-${seq}`;
};

module.exports = { generateComplaintNo };
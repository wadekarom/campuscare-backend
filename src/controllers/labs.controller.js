const prisma = require('../config/db');

exports.getLabs = async (req, res) => {
  const labs = await prisma.lab.findMany({
    where:   { isActive: true },
    select:  { id: true, name: true, location: true, building: true },
    orderBy: { name: 'asc' }
  });

  res.json({ labs });
};
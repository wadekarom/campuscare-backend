const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const passwordHash = await bcrypt.hash('Test@1234', 10);

  const admin = await prisma.user.upsert({
    where:  { email: 'admin@college.edu' },
    update: {},
    create: {
      name:         'Admin User',
      email:        'admin@college.edu',
      passwordHash,
      role:         'admin',
      department:   'Administration'
    }
  });

  const technician = await prisma.user.upsert({
    where:  { email: 'ramesh@college.edu' },
    update: {},
    create: {
      name:         'Ramesh Kumar',
      email:        'ramesh@college.edu',
      passwordHash,
      role:         'technician',
      department:   'IT Support'
    }
  });

  const student = await prisma.user.upsert({
    where:  { email: 'riya@college.edu' },
    update: {},
    create: {
      name:         'Riya Sharma',
      email:        'riya@college.edu',
      passwordHash,
      role:         'student',
      department:   'Computer Science'
    }
  });

  console.log('✅ Users created:');
  console.log(`   Admin      → ${admin.email}`);
  console.log(`   Technician → ${technician.email}`);
  console.log(`   Student    → ${student.email}`);

  const labsData = [
    { name: 'Computer Lab 1',  location: 'Block A, Ground Floor', building: 'Block A' },
    { name: 'Computer Lab 2',  location: 'Block A, First Floor',  building: 'Block A' },
    { name: 'Computer Lab 3',  location: 'Block A, Second Floor', building: 'Block A' },
    { name: 'Electronics Lab', location: 'Block B, Ground Floor', building: 'Block B' },
  ];

  for (const lab of labsData) {
    await prisma.lab.upsert({
      where:  { name: lab.name },
      update: {},
      create: lab
    });
  }

  console.log('✅ Labs created:');
  labsData.forEach(l => console.log(`   ${l.name} — ${l.location}`));

  console.log('\n🎉 Seeding complete!');
  console.log('─────────────────────────────────────');
  console.log('Test credentials (all passwords: Test@1234)');
  console.log('  admin@college.edu');
  console.log('  ramesh@college.edu');
  console.log('  riya@college.edu');
  console.log('─────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
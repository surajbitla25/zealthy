import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.prescription.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.user.deleteMany();
  await prisma.medication.deleteMany();
  await prisma.dosage.deleteMany();

  // Seed medications
  const medications = [
    'Diovan',
    'Lexapro',
    'Metformin',
    'Ozempic',
    'Prozac',
    'Seroquel',
    'Tegretol',
  ];

  for (const med of medications) {
    await prisma.medication.create({
      data: { name: med },
    });
  }

  console.log('Seeded medications');

  // Seed dosages
  const dosages = [
    '1mg',
    '2mg',
    '3mg',
    '5mg',
    '10mg',
    '25mg',
    '50mg',
    '100mg',
    '250mg',
    '500mg',
    '1000mg',
  ];

  for (const dosage of dosages) {
    await prisma.dosage.create({
      data: { value: dosage },
    });
  }

  console.log('Seeded dosages');

  // Hash the password for users
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // Create User 1: Mark Johnson
  const user1 = await prisma.user.create({
    data: {
      name: 'Mark Johnson',
      email: 'mark@some-email-provider.net',
      passwordHash,
    },
  });

  // Create User 1's appointments
  await prisma.appointment.createMany({
    data: [
      {
        userId: user1.id,
        provider: 'Dr Kim West',
        datetime: new Date('2026-02-05T16:30:00.000-07:00'),
        repeatSchedule: 'weekly',
      },
      {
        userId: user1.id,
        provider: 'Dr Lin James',
        datetime: new Date('2026-02-10T18:30:00.000-07:00'),
        repeatSchedule: 'monthly',
      },
    ],
  });

  // Create User 1's prescriptions
  await prisma.prescription.createMany({
    data: [
      {
        userId: user1.id,
        medication: 'Lexapro',
        dosage: '5mg',
        quantity: 2,
        refillOn: new Date('2026-02-05'),
        refillSchedule: 'monthly',
      },
      {
        userId: user1.id,
        medication: 'Ozempic',
        dosage: '1mg',
        quantity: 1,
        refillOn: new Date('2026-02-08'),
        refillSchedule: 'monthly',
      },
    ],
  });

  console.log('Seeded Mark Johnson');

  // Create User 2: Lisa Smith
  const user2 = await prisma.user.create({
    data: {
      name: 'Lisa Smith',
      email: 'lisa@some-email-provider.net',
      passwordHash,
    },
  });

  // Create User 2's appointments
  await prisma.appointment.createMany({
    data: [
      {
        userId: user2.id,
        provider: 'Dr Sally Field',
        datetime: new Date('2026-02-03T18:15:00.000-07:00'),
        repeatSchedule: 'monthly',
      },
      {
        userId: user2.id,
        provider: 'Dr Lin James',
        datetime: new Date('2026-02-12T20:00:00.000-07:00'),
        repeatSchedule: 'weekly',
      },
    ],
  });

  // Create User 2's prescriptions
  await prisma.prescription.createMany({
    data: [
      {
        userId: user2.id,
        medication: 'Metformin',
        dosage: '500mg',
        quantity: 2,
        refillOn: new Date('2026-02-04'),
        refillSchedule: 'monthly',
      },
      {
        userId: user2.id,
        medication: 'Diovan',
        dosage: '100mg',
        quantity: 1,
        refillOn: new Date('2026-02-07'),
        refillSchedule: 'monthly',
      },
    ],
  });

  console.log('Seeded Lisa Smith');
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

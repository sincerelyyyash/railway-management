
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      name: 'Yash Thakur',
      email: 'yash@gmail.com',
      password: 'admin123',
      role: UserRole.ADMIN,
    },
    {
      name: 'Aditya Singh',
      email: 'aditya@mail.com',
      password: 'aditya123',
      role: UserRole.USER,
    },
    {
      name: 'Harman Singh',
      email: 'harman@mail.com',
      password: 'harman123',
      role: UserRole.USER,
    },
  ];

  const hashedUsers = await Promise.all(
    users.map(async (user) => ({
      name: user.name,
      email: user.email,
      password: await bcrypt.hash(user.password, 10),
      role: user.role,
    }))
  );

  await prisma.user.createMany({
    data: hashedUsers,
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());



import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const seed = async () => {
  const adminUser = {
    name: 'Yash Thakur',
    email: 'yash@mail.com',
    password: 'admin123',
    role: UserRole.ADMIN,
  };
  const users = [
    {
      name: 'Aditya Singh',
      email: 'aditya@example.com',
      password: 'aditya123',
      role: UserRole.USER,
    },
    {
      name: 'Harman Singh',
      email: 'harman@example.com',
      password: 'harman123',
      role: UserRole.USER,
    },
  ];

  const hashedAdminPassword = await bcrypt.hash(adminUser.password, 10);
  const hashedUserPasswords = await Promise.all(
    users.map(user => bcrypt.hash(user.password, 10))
  );

  try {
    await prisma.user.create({
      data: {
        name: adminUser.name,
        email: adminUser.email,
        password: hashedAdminPassword,
        role: adminUser.role,
      },
    });

    for (let i = 0; i < users.length; i++) {
      await prisma.user.create({
        data: {
          name: users[i].name,
          email: users[i].email,
          password: hashedUserPasswords[i],
          role: users[i].role,
        },
      });
    }

  } finally {
    await prisma.$disconnect();
  }
};

seed();


/**
 * User Queries
 *
 * Read operations for users from the database
 */

import { prisma } from "../db";

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

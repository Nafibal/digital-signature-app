/**
 * User Mutations
 *
 * Write operations for users in the database
 */

import { prisma } from "../db";

/**
 * Update user profile
 */
export async function updateUser(
  userId: string,
  data: {
    name?: string;
    email?: string;
  }
) {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.email !== undefined && { email: data.email }),
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

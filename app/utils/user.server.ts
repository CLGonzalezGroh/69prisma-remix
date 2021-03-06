import { prisma } from "./prisma.server"
import bcrypt from "bcryptjs"
import type { RegisterForm } from "./types.server"
import type { User } from "@prisma/client"

export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 10)
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordHash,
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    },
  })
  return { id: newUser.id, email: user.email }
}

export const getOtherUsers = async (userId: string) => {
  return prisma.user.findMany({
    where: {
      id: { not: userId },
    },
    orderBy: { profile: { firstName: "asc" } },
  })
}

export const getUserById = async (userId: string): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { id: userId } })
}

// app/utils/auth.server.ts
import type { RegisterForm, LoginForm } from "./types.server"
import { json } from "@remix-run/node"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma.server"
import { createUser } from "./user.server"

export async function register(user: RegisterForm) {
  const exist = await prisma.user.count({ where: { email: user.email } })
  if (exist) {
    return json(
      { error: "User already exists with this email" },
      { status: 400 }
    )
  }

  const newUser = await createUser(user)

  if (!newUser) {
    return json(
      {
        error: "Something went wrong trying to create a new user",
        fields: { email: user.email, password: user.password },
      },
      { status: 400 }
    )
  }

  return null
}

export async function login(form: LoginForm) {
  const user = await prisma.user.findUnique({ where: { email: form.email } })

  if (!user || !(await bcrypt.compare(form.password, user.password))) {
    return json({ error: "Incorrect login" }, { status: 400 })
  }

  return null
}

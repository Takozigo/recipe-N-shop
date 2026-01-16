import { eq } from 'drizzle-orm'
import { db } from '../db'
import { user } from '../db/schema'

export const createUser = ({
  email,
  username,
  password,
  salt,
}: {
  email: string
  username: string
  password: string
  salt: string
}) => {
  return db
    .insert(user)
    .values({ email, password, salt, username })
    .returning({ id: user.id, email: user.email, username: user.username })
}

export const getUserFromDbById = (id: string) => {
  return db.query.user.findFirst({
    where: eq(user.id, id),
    columns: {
      password: false,
      salt: false,
      updatedAt: false,
    },
  })
}

export const getUserFromDbByEmail = (email: string) => {
  return db.query.user.findFirst({
    where: eq(user.email, email),
    columns: {
      updatedAt: false,
    },
  })
}

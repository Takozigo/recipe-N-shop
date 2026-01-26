import { db } from '../db'
import { users } from '../db/schema'

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
    .insert(users)
    .values({ email, password, salt, username })
    .returning({ id: users.id, email: users.email, username: users.username })
}

export const getUserFromDbById = (id: string) => {
  return db.query.users.findFirst({
    where: { id },
    columns: {
      password: false,
      salt: false,
      updatedAt: false,
    },
  })
}

export const getUserFromDbByEmail = (email: string) => {
  return db.query.users.findFirst({
    where: { email },
    columns: {
      updatedAt: false,
    },
  })
}

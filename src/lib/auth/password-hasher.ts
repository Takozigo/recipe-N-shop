import crypto from 'node:crypto'

export const hashPassword = (
  password: string,
  salt: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password.normalize(), salt, 64, (error, hash) => {
      if (error) reject(error)
      resolve(hash.toString('hex').normalize())
    })
  })
}

export const comparePasswords = async ({
  hashedPassword,
  password,
  salt,
}: {
  hashedPassword: string
  password: string
  salt: string
}) => {
  const inputHashedPassword = await hashPassword(password, salt)

  return crypto.timingSafeEqual(
    Buffer.from(inputHashedPassword, 'hex'),
    Buffer.from(hashedPassword, 'hex'),
  )
}

export const generatedSalt = () => {
  return crypto.randomBytes(16).toString('hex').normalize()
}

import { PrismaClient } from '../../app/generated/prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn']
  })

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}
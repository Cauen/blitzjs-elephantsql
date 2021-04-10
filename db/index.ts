import { Prisma } from 'db';
import {enhancePrisma} from "blitz"
import {PrismaClient} from "@prisma/client"

declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaType;
    }
  }
}

interface EnhancedPrismaClientAddedMethods {
  $reset: () => Promise<void>;
}

type PrismaType = PrismaClient<Prisma.PrismaClientOptions, unknown, unknown> & EnhancedPrismaClientAddedMethods

const EnhancedPrisma = enhancePrisma(PrismaClient)
let prisma: PrismaType
let total: number = 0

console.log({ globalPrisma: global.prisma })
global.prisma = (() => {
  if (global.prisma) {
    total = total + 1
    console.log("GETTING FROM CACHE " + total)
  }
  return global.prisma
})() || (() => {
  total = total + 1
  console.log("CREATING PRISMA ENHANCED " + total)
  return new EnhancedPrisma()
})()
prisma = global.prisma

export * from "@prisma/client"
export default prisma

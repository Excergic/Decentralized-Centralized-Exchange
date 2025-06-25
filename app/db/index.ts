// app/db/index.ts
import { PrismaClient } from '@/app/generated/prisma';

//NextJs is making request everytime it restarts the server, PSQL have 100 request limit
const prismaClientSingleton = () => {
    return new PrismaClient();
  };
  
  type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;
  
  // eslint-disable-next-line
  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
  };
  
  const prisma = globalForPrisma.prisma ?? prismaClientSingleton();
  
  export default prisma;
  
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:wq58Sl5o8mAaNXbD@db.pctjfcktcmowhyltggzc.supabase.co:5432/postgres"
    }
  }
})
async function main() {
  try {
    await prisma.$connect()
    console.log("Connected!")
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}
main()

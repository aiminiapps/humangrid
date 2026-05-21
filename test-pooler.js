const { PrismaClient } = require('@prisma/client')

const regions = [
  'aws-0-eu-central-1',
  'aws-0-us-east-1',
  'aws-0-us-west-1',
  'aws-0-ap-southeast-1',
  'aws-1-ap-northeast-1',
  'aws-0-eu-west-1',
  'aws-0-eu-west-2',
  'aws-0-ap-south-1',
  'aws-0-sa-east-1'
]

async function testRegion(region) {
  const url = `postgresql://postgres.pctjfcktcmowhyltggzc:wq58Sl5o8mAaNXbD@${region}.pooler.supabase.com:6543/postgres?pgbouncer=true&connect_timeout=3`
  const prisma = new PrismaClient({
    datasources: { db: { url } }
  })
  
  try {
    await prisma.$connect()
    console.log(`Connected to region: ${region}`)
    await prisma.$disconnect()
    return true
  } catch (e) {
    // console.log(`Failed for ${region}: ${e.message}`)
  } finally {
    await prisma.$disconnect()
  }
  return false
}

async function main() {
  for (const region of regions) {
    console.log(`Testing ${region}...`)
    if (await testRegion(region)) {
      console.log(`FOUND REGION: ${region}`)
      process.exit(0)
    }
  }
  console.log("None connected.")
}
main()

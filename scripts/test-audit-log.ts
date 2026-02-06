import { prisma } from "../lib/prisma";

async function main() {
  console.log("Testing AuditLog creation...");
  try {
    const log = await prisma.auditLog.create({
      data: {
        action: "TEST_ACTION",
        description: "This is a test log entry",
        userId: "TEST_USER",
        ip: "127.0.0.1"
      }
    });
    console.log("AuditLog created successfully:", log);
    
    const logs = await prisma.auditLog.findMany({
      take: 1
    });
    console.log("Fetched logs:", logs);
  } catch (error) {
    console.error("Error testing AuditLog:", error);
  }
}

main();
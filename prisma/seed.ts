import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env before running the seed script."
    );
  }

  console.log("Seeding database...\n");

  const passwordHash = await hash(password, 10);

  const superAdmin = await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      name: "Super Admin PSI",
      email,
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  console.log(`[Admin] Seeded ${superAdmin.email} successfully (id: ${superAdmin.id}).`);

  // University seed removed — universities are now managed manually via /admin/universities

  console.log("\nSeed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

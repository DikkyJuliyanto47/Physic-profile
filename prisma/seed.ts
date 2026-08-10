import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...\n");

  // 1. Create Super Admin user
  const passwordHash = await hash("Admin123!", 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@psi-surabaya.or.id" },
    update: {},
    create: {
      name: "Super Admin PSI",
      email: "admin@psi-surabaya.or.id",
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  console.log(`[User] Super Admin created: ${superAdmin.email} (id: ${superAdmin.id})`);

  // 2. Seed Universities
  const universities = [
    { name: "Universitas Negeri Surabaya", shortName: "UNESA" },
    { name: "Universitas Airlangga", shortName: "UNAIR" },
    { name: "Institut Teknologi Sepuluh Nopember", shortName: "ITS" },
    { name: "UPN Veteran Jawa Timur", shortName: "UPN" },
    { name: "Universitas Katolik Widya Mandala Surabaya", shortName: "UKWMS" },
    { name: "Universitas Jember", shortName: "UNEJ" },
    { name: "Universitas Islam Madura", shortName: "UIM" },
    { name: "Universitas Bilfath", shortName: "UNIBA" },
    { name: "Universitas NU Pasuruan", shortName: "UNU Pasuruan" },
  ];

  for (const uni of universities) {
    const created = await prisma.university.upsert({
      where: { name: uni.name },
      update: { shortName: uni.shortName },
      create: {
        name: uni.name,
        shortName: uni.shortName,
      },
    });
    console.log(`[University] ${created.name} (${created.shortName})`);
  }

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

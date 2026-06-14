import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@1234", 12);

  // Super admin account
  await prisma.user.upsert({
    where: { email: "admin@greenfieldhs.ac" },
    update: {},
    create: {
      name: "System Administrator",
      email: "admin@greenfieldhs.ac",
      password: passwordHash,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  // Sample staff account
  await prisma.user.upsert({
    where: { email: "staff@greenfieldhs.ac" },
    update: {},
    create: {
      name: "Jane Mwangi",
      email: "staff@greenfieldhs.ac",
      password: await bcrypt.hash("Staff@1234", 12),
      role: UserRole.STAFF,
      isActive: true,
    },
  });

  // Default site settings
  const settings = [
    { key: "school_name",    value: "Greenfield High School" },
    { key: "school_motto",   value: "Excellence in Learning, Character in Life" },
    { key: "school_email",   value: "info@greenfieldhs.ac" },
    { key: "school_phone",   value: "+254 700 000 000" },
    { key: "school_address", value: "P.O. Box 1234, Nairobi, Kenya" },
    { key: "school_founded", value: "1985" },
    { key: "facebook_url",   value: "" },
    { key: "twitter_url",    value: "" },
    { key: "instagram_url",  value: "" },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  console.log("Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

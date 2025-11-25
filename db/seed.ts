import { db } from "./index";
import { users } from "@shared/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

const SALT_ROUNDS = 10;

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, "demo@example.com"))
      .limit(1);

    if (existingUser.length > 0) {
      console.log("✓ Demo user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("demo123", SALT_ROUNDS);

    await db.insert(users).values({
      email: "demo@example.com",
      username: "Demo User",
      password: hashedPassword,
    });

    console.log("✓ Created demo user: demo@example.com / demo123");
    console.log("🎉 Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();

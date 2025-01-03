import { hashPassword } from "../server/utils/password";
import { db } from "../db";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";

async function updatePasswords() {
  const passwords = {
    "admin@3rtechnologie.com": "admin123",
    "invite@3rtechnologie.com": "invite123",
    "technicien@3rtechnologie.com": "tech123"
  };

  for (const [email, password] of Object.entries(passwords)) {
    const hashedPassword = await hashPassword(password);
    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, email));
    console.log(`Updated password for ${email}`);
  }
}

updatePasswords().catch(console.error);

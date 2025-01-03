import { Router } from "express";
import { db } from "@db";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

const router = Router();

// Get all users
router.get("/", async (_req, res) => {
  try {
    const allUsers = await db.select().from(users);
    res.json(allUsers.map(user => ({
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    })));
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});

// Create new user
router.post("/", async (req, res) => {
  try {
    const { email, password, role, status } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [newUser] = await db.insert(users).values({
      email,
      password: hashedPassword,
      role,
      status
    }).returning();

    res.json({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    });
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === '23505') { // unique violation
      res.status(400).send("Email already exists");
    } else {
      res.status(500).send("Error creating user");
    }
  }
});

// Update user
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role, status } = req.body;

    const [updatedUser] = await db.update(users)
      .set({
        email,
        role,
        status,
        updatedAt: new Date()
      })
      .where(eq(users.id, parseInt(id)))
      .returning();

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.json({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    });
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.code === '23505') {
      res.status(400).send("Email already exists");
    } else {
      res.status(500).send("Error updating user");
    }
  }
});

// Reset password
router.post("/:id/reset-password", async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [updatedUser] = await db.update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.id, parseInt(id)))
      .returning();

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).send("Error resetting password");
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [deletedUser] = await db.delete(users)
      .where(eq(users.id, parseInt(id)))
      .returning();

    if (!deletedUser) {
      return res.status(404).send("User not found");
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Error deleting user");
  }
});

export default router;

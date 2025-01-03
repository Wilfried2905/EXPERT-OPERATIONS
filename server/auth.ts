import passport from "passport";
import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";
import { type Express } from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import bcrypt from 'bcrypt';
import { users } from "@db/schema";
import { db } from "@db";
import { eq } from "drizzle-orm";

// Password hashing configuration
const SALT_ROUNDS = 10;

const crypto = {
  hash: async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },
  compare: async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
  }
};

export function setupAuth(app: Express) {
  const MemoryStore = createMemoryStore(session);
  const sessionSettings: session.SessionOptions = {
    secret: process.env.REPL_ID || "3r-expert-operations",
    resave: false,
    saveUninitialized: false,
    cookie: {},
    store: new MemoryStore({
      checkPeriod: 86400000,
    }),
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    sessionSettings.cookie = {
      secure: true,
    };
  }

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

          if (!user) {
            return done(null, false, { message: "Email incorrect" });
          }

          const isMatch = await crypto.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: "Mot de passe incorrect" });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Reset passwords for development (temporary)
  const resetPasswords = async () => {
    const password = 'test';
    const hash = await crypto.hash(password);

    await db.update(users)
      .set({ password: hash })
      .where(eq(users.role, 'admin'));
  };

  resetPasswords().catch(console.error);

  // Login endpoint
  app.post("/api/login", (req, res, next) => {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    passport.authenticate("local", (err: any, user: Express.User | false, info: IVerifyOptions) => {
      if (err) {
        console.error('Erreur d\'authentification:', err);
        return res.status(500).json({ message: "Erreur interne du serveur" });
      }

      if (!user) {
        return res.status(400).json({ message: info.message ?? "La connexion a échoué" });
      }

      req.logIn(user, (err) => {
        if (err) {
          console.error('Erreur lors de la connexion:', err);
          return res.status(500).json({ message: "Erreur lors de la connexion" });
        }

        return res.json({
          message: "Connexion réussie",
          user: {
            id: (user as any).id,
            email: (user as any).email,
            role: (user as any).role
          }
        });
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "La déconnexion a échoué" });
      }
      res.json({ message: "Déconnexion réussie" });
    });
  });

  // User info endpoint
  app.get("/api/me", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    res.json({ 
      user: {
        id: (req.user as any).id,
        email: (req.user as any).email,
        role: (req.user as any).role
      }
    });
  });
}
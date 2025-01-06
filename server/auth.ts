import passport from "passport";
import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";
import { type Express } from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import bcrypt from 'bcrypt';
import { users, authLogs } from "@db/schema";
import { db } from "@db";
import { eq } from "drizzle-orm";

// Configuration du hachage des mots de passe
const SALT_ROUNDS = 10;

// Fonctions de cryptographie simplifiées
const crypto = {
  hash: async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  },
  compare: async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
  }
};

// Fonction pour enregistrer les logs d'authentification
async function logAuthEvent(event: string, details: any, userId?: number, req?: Express.Request) {
  try {
    await db.insert(authLogs).values({
      userId: userId,
      event: event,
      details: details,
      ipAddress: req?.ip,
      userAgent: req?.headers['user-agent'],
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du log:', error);
  }
}

export function setupAuth(app: Express) {
  const MemoryStore = createMemoryStore(session);

  // Configuration avancée des sessions
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || process.env.REPL_ID || "3r-expert-operations",
    resave: false,
    saveUninitialized: false,
    name: '3r_session', // Nom personnalisé du cookie
    cookie: {
      httpOnly: true,
      secure: app.get("env") === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 heures
      sameSite: 'lax'
    },
    store: new MemoryStore({
      checkPeriod: 86400000, // Nettoyage des sessions expirées
    }),
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    sessionSettings.cookie!.secure = true;
  }

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configuration de la stratégie locale
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
            await logAuthEvent('login_failure', { 
              reason: 'user_not_found',
              email 
            });
            return done(null, false, { message: "Email incorrect" });
          }

          const isMatch = await crypto.compare(password, user.password);
          if (!isMatch) {
            await logAuthEvent('login_failure', { 
              reason: 'invalid_password',
              email 
            });
            return done(null, false, { message: "Mot de passe incorrect" });
          }

          await logAuthEvent('login_success', { 
            userId: user.id,
            email: user.email,
            role: user.role 
          }, user.id);

          return done(null, user);
        } catch (err) {
          await logAuthEvent('login_error', { 
            error: err instanceof Error ? err.message : 'Unknown error',
            email 
          });
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

  // Route de connexion améliorée
  app.post("/api/login", async (req, res, next) => {
    try {
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({ 
          message: "Email et mot de passe requis",
          details: {
            email: !req.body.email ? "Email manquant" : null,
            password: !req.body.password ? "Mot de passe manquant" : null
          }
        });
      }

      passport.authenticate("local", async (err: any, user: Express.User | false, info: IVerifyOptions) => {
        if (err) {
          return res.status(500).json({ 
            message: "Erreur interne du serveur",
            details: app.get("env") === "development" ? err.message : undefined
          });
        }

        if (!user) {
          return res.status(400).json({ 
            message: info.message ?? "La connexion a échoué",
            code: "AUTH_FAILED"
          });
        }

        req.logIn(user, async (err) => {
          if (err) {
            return res.status(500).json({ 
              message: "Erreur lors de la connexion",
              details: app.get("env") === "development" ? err.message : undefined
            });
          }

          // Enregistrement du succès de connexion
          await logAuthEvent('login_success', {
            userId: (user as any).id,
            email: (user as any).email,
            role: (user as any).role,
            timestamp: new Date()
          }, (user as any).id, req);

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
    } catch (error) {
      next(error);
    }
  });

  // Route de déconnexion sécurisée
  app.post("/api/logout", (req, res) => {
    const userId = (req.user as any)?.id;

    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "La déconnexion a échoué" });
      }

      // Destruction de la session
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Erreur lors de la destruction de la session" });
        }

        // Log de la déconnexion
        if (userId) {
          logAuthEvent('logout_success', {
            userId,
            timestamp: new Date()
          }, userId, req);
        }

        res.clearCookie('3r_session');
        res.json({ message: "Déconnexion réussie" });
      });
    });
  });

  // Route pour vérifier l'état de l'authentification
  app.get("/api/me", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ 
        message: "Non authentifié",
        code: "NOT_AUTHENTICATED"
      });
    }

    res.json({ 
      user: {
        id: (req.user as any).id,
        email: (req.user as any).email,
        role: (req.user as any).role
      }
    });
  });

  // Middleware de protection des routes
  const requireAuth = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ 
        message: "Authentification requise",
        code: "AUTH_REQUIRED"
      });
    }
    next();
  };

  // Middleware de vérification des rôles
  const requireRole = (roles: string[]) => {
    return (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ 
          message: "Authentification requise",
          code: "AUTH_REQUIRED"
        });
      }

      const userRole = (req.user as any).role;
      if (!roles.includes(userRole)) {
        return res.status(403).json({ 
          message: "Accès non autorisé",
          code: "FORBIDDEN"
        });
      }
      next();
    };
  };

  // Exporter les middlewares
  return {
    requireAuth,
    requireRole
  };
}

// Reset passwords for development (temporary)
const resetPasswords = async () => {
  const password = 'test';
  const hash = await crypto.hash(password);

  await db.update(users)
    .set({ password: hash })
    .where(eq(users.role, 'admin'));
};

resetPasswords().catch(console.error);
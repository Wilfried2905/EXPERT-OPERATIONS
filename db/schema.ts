import { pgTable, text, serial, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  role: text("role", { enum: ['guest', 'technician', 'admin'] }).default('guest').notNull(),
  status: text("status", { enum: ['active', 'inactive'] }).default('active').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Nouvelle table pour les logs d'authentification
export const authLogs = pgTable("auth_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  event: text("event").notNull(), // 'profile_selected', 'login_attempt', 'login_success', 'login_failure'
  details: jsonb("details").default({}).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Operations table
export const operations = pgTable("operations", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  subtype: text("subtype").notNull(),
  clientName: text("client_name").notNull(),
  site: text("site"),
  status: text("status").default('pending').notNull(),
  progress: integer("progress").default(0).notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  assignedTo: integer("assigned_to").references(() => users.id),
  data: jsonb("data").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Documents/Evidence table
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  operationId: integer("operation_id").references(() => operations.id, {
    onDelete: "cascade",
  }).notNull(),
  type: text("type").notNull(), // 'image', 'document', etc.
  name: text("name").notNull(),
  path: text("path").notNull(),
  uploadedBy: integer("uploaded_by").references(() => users.id).notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  metadata: jsonb("metadata").default({}).notNull(),
});

// KPIs/Metrics table
export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  operationId: integer("operation_id").references(() => operations.id, {
    onDelete: "cascade",
  }).notNull(),
  category: text("category").notNull(),
  name: text("name").notNull(),
  value: text("value").notNull(),
  unit: text("unit"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  metadata: jsonb("metadata").default({}).notNull(),
});

// Comments/Notes table
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  operationId: integer("operation_id").references(() => operations.id, {
    onDelete: "cascade",
  }).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Equipment related tables
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const manufacturers = pgTable("manufacturers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const equipments = pgTable("equipments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "cascade"
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Junction table for many-to-many relationship between equipments and manufacturers
export const equipmentManufacturers = pgTable("equipment_manufacturers", {
  equipmentId: integer("equipment_id").references(() => equipments.id, {
    onDelete: "cascade"
  }).notNull(),
  manufacturerId: integer("manufacturer_id").references(() => manufacturers.id, {
    onDelete: "cascade"
  }).notNull(),
});

// Define relationships
export const userRelations = relations(users, ({ many }) => ({
  operations: many(operations),
  documents: many(documents),
  comments: many(comments)
}));

export const operationRelations = relations(operations, ({ one, many }) => ({
  user: one(users, {
    fields: [operations.userId],
    references: [users.id],
  }),
  assignedTo: one(users, {
    fields: [operations.assignedTo],
    references: [users.id],
  }),
  documents: many(documents),
  metrics: many(metrics),
  comments: many(comments),
}));

// Relations
export const categoryRelations = relations(categories, ({ many }) => ({
  equipments: many(equipments),
}));

export const manufacturerRelations = relations(manufacturers, ({ many }) => ({
  equipments: many(equipmentManufacturers),
}));

export const equipmentRelations = relations(equipments, ({ one, many }) => ({
  category: one(categories, {
    fields: [equipments.categoryId],
    references: [categories.id],
  }),
  manufacturers: many(equipmentManufacturers),
}));

export const equipmentManufacturerRelations = relations(equipmentManufacturers, ({ one }) => ({
  equipment: one(equipments, {
    fields: [equipmentManufacturers.equipmentId],
    references: [equipments.id],
  }),
  manufacturer: one(manufacturers, {
    fields: [equipmentManufacturers.manufacturerId],
    references: [manufacturers.id],
  }),
}));


// Create Zod schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertOperationSchema = createInsertSchema(operations);
export const selectOperationSchema = createSelectSchema(operations);
export const insertDocumentSchema = createInsertSchema(documents);
export const selectDocumentSchema = createSelectSchema(documents);
export const insertMetricSchema = createInsertSchema(metrics);
export const selectMetricSchema = createSelectSchema(metrics);
export const insertCommentSchema = createInsertSchema(comments);
export const selectCommentSchema = createSelectSchema(comments);

// Add new schema and types for auth logs
export const insertAuthLogSchema = createInsertSchema(authLogs);
export const selectAuthLogSchema = createSelectSchema(authLogs);
export const insertCategorySchema = createInsertSchema(categories);
export const selectCategorySchema = createSelectSchema(categories);
export const insertManufacturerSchema = createInsertSchema(manufacturers);
export const selectManufacturerSchema = createSelectSchema(manufacturers);
export const insertEquipmentSchema = createInsertSchema(equipments);
export const selectEquipmentSchema = createSelectSchema(equipments);

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Operation = typeof operations.$inferSelect;
export type InsertOperation = typeof operations.$inferInsert;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;
export type Metric = typeof metrics.$inferSelect;
export type InsertMetric = typeof metrics.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;
export type AuthLog = typeof authLogs.$inferSelect;
export type InsertAuthLog = typeof authLogs.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;
export type Manufacturer = typeof manufacturers.$inferSelect;
export type InsertManufacturer = typeof manufacturers.$inferInsert;
export type Equipment = typeof equipments.$inferSelect;
export type InsertEquipment = typeof equipments.$inferInsert;
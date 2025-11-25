import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  username: text("username").notNull(),
  password: text("password"),
  oauthProvider: text("oauth_provider"),
  oauthId: text("oauth_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Login schema
export const loginSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type LoginRequest = z.infer<typeof loginSchema>;

export type LoginResponse = {
  success: boolean;
  message: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
  errors?: Array<{ message: string; path: string[] }>;
};

// Register schema
export const registerSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  username: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type RegisterRequest = z.infer<typeof registerSchema>;

export type RegisterResponse = {
  success: boolean;
  message: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
  errors?: Array<{ message: string; path: string[] }>;
};

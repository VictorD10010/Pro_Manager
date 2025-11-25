import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, registerSchema, type LoginResponse, type RegisterResponse } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Login endpoint
  app.post("/api/login", async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: "Dados inválidos",
          errors: result.error.errors,
        } as LoginResponse);
      }

      const { email, password } = result.data;
      const user = await storage.validateCredentials(email, password);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Email ou senha incorretos",
        } as LoginResponse);
      }

      return res.status(200).json({
        success: true,
        message: "Login realizado com sucesso",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      } as LoginResponse);
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      } as LoginResponse);
    }
  });

  // Register endpoint
  app.post("/api/register", async (req, res) => {
    try {
      const result = registerSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: "Dados inválidos",
          errors: result.error.errors,
        } as RegisterResponse);
      }

      const { email, username, password } = result.data;

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Este email já está cadastrado",
        } as RegisterResponse);
      }

      const user = await storage.createUser({
        email,
        username,
        password,
      });

      return res.status(201).json({
        success: true,
        message: "Conta criada com sucesso",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      } as RegisterResponse);
    } catch (error) {
      console.error("Register error:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      } as RegisterResponse);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

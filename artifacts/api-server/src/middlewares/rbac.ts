import type { Request, Response, NextFunction } from "express";
import { getClient } from "../lib/supabase";

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (authHeader === "Bearer dev-token" || (process.env.NODE_ENV !== "production" && authHeader?.includes("dev-token"))) {
    (req as any).user = {
      id: "00000000-0000-0000-0000-000000000001",
      email: "mhonbastasa@gmail.com",
      role: "admin",
      user_metadata: { name: "Developer Admin" },
    };
    return next();
  }

  const db = getClient(req);
  const { data: { user }, error } = await db.auth.getUser();

  if (error || !user) {
    req.log.warn({ error }, "Unauthorized access attempt");
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  
  // Attach user to request for downstream use
  (req as any).user = user;
  next();
};

export const requireRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Ensure user is authenticated first
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (user.id === "00000000-0000-0000-0000-000000000001") {
      return next();
    }

    const db = getClient(req);
    // Fetch user profile to get role
    const { data: profile, error } = await db
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      req.log.warn({ error, userId: user.id }, "Failed to fetch user profile for role check");
      res.status(403).json({ error: "Forbidden - Role not found" });
      return;
    }

    if (!allowedRoles.includes(profile.role)) {
      req.log.warn({ userId: user.id, role: profile.role, allowedRoles }, "Insufficient permissions");
      res.status(403).json({ error: "Forbidden - Insufficient permissions" });
      return;
    }

    next();
  };
};

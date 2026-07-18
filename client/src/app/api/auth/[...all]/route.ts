import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Official Better Auth Next.js route handler
// Handles all auth requests at /api/auth/*
export const { POST, GET } = toNextJsHandler(auth);

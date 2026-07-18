import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

// POST /api/seed — Seeds demo user and admin accounts on first run
// Call this once during development: fetch('/api/seed', { method: 'POST' })
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI!);
    const db = client.db();

    const results: string[] = [];

    // Seed demo user
    const existingUser = await db.collection("user").findOne({ email: "user@shoppilot.com" });
    if (!existingUser) {
      await auth.api.signUpEmail({
        body: {
          name: "Demo User",
          email: "user@shoppilot.com",
          password: "Password123!",
        },
      });
      results.push("Demo user created.");
    } else {
      results.push("Demo user already exists.");
    }

    // Seed demo admin
    const existingAdmin = await db.collection("user").findOne({ email: "admin@shoppilot.com" });
    if (!existingAdmin) {
      await auth.api.signUpEmail({
        body: {
          name: "Demo Admin",
          email: "admin@shoppilot.com",
          password: "Password123!",
        },
      });
      await db.collection("user").updateOne(
        { email: "admin@shoppilot.com" },
        { $set: { role: "admin" } }
      );
      results.push("Demo admin created and promoted.");
    } else {
      results.push("Demo admin already exists.");
    }

    await client.close();
    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

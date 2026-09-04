import { NextResponse } from "next/server";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, createAdminSession, ADMIN_COOKIE_OPTIONS } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Check env-based admin first
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = await createAdminSession({
        userId: 0,
        username,
        role: "superadmin",
      });

      const response = NextResponse.json({ success: true });
      response.cookies.set(ADMIN_COOKIE_OPTIONS.name, token, ADMIN_COOKIE_OPTIONS);
      return response;
    }

    // Check DB admin
    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await createAdminSession({
      userId: user.id,
      username: user.username,
      role: user.role || "admin",
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE_OPTIONS.name, token, ADMIN_COOKIE_OPTIONS);
    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_OPTIONS.name, "", {
    ...ADMIN_COOKIE_OPTIONS,
    maxAge: 0,
  });
  return response;
}

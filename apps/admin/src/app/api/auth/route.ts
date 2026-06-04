import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "@repo/env/admin";
import { prisma } from "@repo/db/prisma";

// Secret key used to sign JWT tokens
const SECRET = env.JWT_SECRET;

// POST method (LOGIN)
export async function POST(req: Request) {
  const formData = await req.formData(); // read login form data

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Find admin user by email
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // Check user exists
  if (!user) {
    return NextResponse.redirect(
      new URL("/?error=invalid", req.url)
    );
  }

  // secure password comparison using bcrypt
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return NextResponse.redirect(
      new URL("/?error=invalid", req.url)
    );
  }

  // Create a JWT token with payload { user: "admin" }
  const token = jwt.sign(
    {
      user: user.email, // data stored in the token
      role: "ADMIN", // Admin role
    },
    SECRET, // Secret used to sign token
    { expiresIn: "3m" } // token expiration - 3 min to 15 min is good for security
  );

  // Redirect to post list after successful login
  const res = NextResponse.redirect(new URL("/", req.url));

  // Store token in a cookie called "auth_token"
  res.cookies.set("auth_token", token, {
    httpOnly: true, // Prevents JavaScript from accessing the cookie
    path: "/", // Cookie is valid for the entire site
    sameSite: "lax", // Prevent CSRF attacks
  });

  return res;
}

// DELETE method (LOGOUT)
export async function DELETE(req: Request) {
  // Create a redirect response to the home page
  const res = NextResponse.redirect(new URL("/", req.url));

  // Delete the auth_token cookie by expiring it immediately
  res.cookies.set("auth_token", "", {
    expires: new Date(0), // delete cookie
    path: "/",
  });

  return res;
}
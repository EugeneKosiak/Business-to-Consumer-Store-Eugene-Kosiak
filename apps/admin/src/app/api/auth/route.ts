import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "@repo/env/admin";
import { prisma } from "@repo/db/prisma";

// Secret key used to sign JWT tokens
const SECRET = env.JWT_SECRET;

// POST method (LOGIN)
export async function POST(req: Request) {
  let email: string | null = null;
  let password: string | null = null; // store incoming password

  // Get request content type (e.g. JSON or form)
  const contentType = req.headers.get("content-type") || "";

  // Check if request body is JSON
  if (contentType.includes("application/json")) {
    const body = await req.json(); // Parse (breakdown) JSON body
    email = body.email;
    password = body.password; // extract password from JSON body
  } else {
    const formData = await req.formData(); // // Parse (breakdown) form data
    email = formData.get("email") as string | null;
    password = formData.get("password") as string | null; // extract password from form data
  }

  if (!email || !password) {
    return new Response("Missing credentials", { status: 400 });
  }

  // Find admin user by email
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // Check admin exists
  if (!user || user.role !== "ADMIN") {
    return new Response("Invalid credentials", { status: 401 });
  }

  // secure password comparison using bcrypt
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return new Response("Invalid credentials", { status: 401 }); // 401 - unauthorized
  }

  // Create a JWT token with payload { user: "admin" }
  const token = jwt.sign(
    {
      user: user.email,
      role: user.role,
    },
    SECRET, // Secret used to sign token
    { expiresIn: "15m" } // token expiration - 3 min to 15 min is good for security
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
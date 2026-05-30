import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@repo/db/prisma";

export async function POST(req: Request) {
  const formData = await req.formData();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate fields
  if (!email || !password) {
    return new Response("Email and password are required", {
      status: 400,
    });
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return new Response("User already exists", {
      status: 409,
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  return NextResponse.redirect(
    new URL("/register?success=true", req.url)
  );
}
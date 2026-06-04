import { NextResponse } from "next/server";
import { prisma } from "@repo/db/prisma";

export async function POST(req: Request) {
  // Get id from request body (JSON data sent from frontend to backend)
  const { id } = await req.json();

  // Go to Product table and find product with specific id
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!product) {
    return new Response("Product not found", { status: 404 }); // 404 - not found
  }

  // Update product active status
  const updated = await prisma.product.update({
    where: { id: Number(id) },
    data: {
      active: !product.active,
    },
  });

  // Return updated product
  return NextResponse.json(updated);
}
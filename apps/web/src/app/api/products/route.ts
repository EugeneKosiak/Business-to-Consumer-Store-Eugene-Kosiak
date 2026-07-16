import { prisma } from "@repo/db/prisma";

// Calls on the database to get all active products
export async function GET() {
  const products = await prisma.product.findMany({
    where: {
      active: true,
    },
  });

  return Response.json(products);
}
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@repo/db/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "user-secret-key";

export async function POST(req: Request) {
  try {
    // Create stripe INSIDE function
    const stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY || "",
      {
        apiVersion: "2026-05-27.dahlia",
      }
    );

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe key missing" },
        { status: 500 }
      );
    }

    // Reads JWT token from browser
    const token = (await cookies()).get(
      "user_auth_token"
    )?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    // Verify JWT token
    const decoded = jwt.verify(token, SECRET) as {
      id: number;
    };

    const { sessionId } = await req.json();

    // Retrieve session from Stripe to get line items
    const session =
      await stripe.checkout.sessions.retrieve(
        sessionId,
        {
          expand: [
            "line_items",
            "line_items.data.price.product",
          ], // include purchased products
        }
      );

    // Get all purchased products, return nothing if no products purchased
    const lineItems = session.line_items?.data || [];

    // Create purchase row in purchase database with user ID, total price, and associated items
    const purchase = await prisma.$transaction(async (tx) => {

      // Update stock for each purchased product
      for (const item of lineItems) {
        // Read the original product ID that was stored in the
        // Stripe Product metadata when the checkout session was created.
        const productId = Number(
          (item.price?.product as Stripe.Product)
            ?.metadata?.productId ?? 1
          );

        // Stripe stores quantity separately. Default to 1 if no quantity is provided.
        const quantity = item.quantity || 1;

        // Retrieve the latest product information from the database.
        const product = await tx.product.findUnique({
          where: { id: productId },
        });

        if (!product) {
          throw new Error("Product not found");
        }

        // Verify there is enough stock available before reducing it. If there isn't enough stock, the entire transaction is cancelled.
        if (product.stock < quantity) {
          throw new Error(
            `${product.title} does not have enough stock`
          );
        }

        // Reduce the available stock by the quantity purchased.
        await tx.product.update({
          where: {
            id: productId,
          },
          data: {
            stock: {
              decrement: quantity,
            },
          },
        });
      }

      // Once every stock update succeeds, create the purchase record.
      return tx.purchase.create({
        data: {
          userId: decoded.id, // Save the authenticated user's ID

          total: (session.amount_total || 0) / 100, // stripe stores money in cents. so convert to dollars

          // Create a PurchaseItem record for every Stripe line item.
          items: {
            create: lineItems.map((item: any) => ({

              // Save the original product ID from Stripe metadata.
              productId: Number(
                (item.price?.product as Stripe.Product)
                  ?.metadata?.productId ?? 1
              ),

              // Save the product image that was stored in Stripe metadata.
              imageUrl:
                (item.price?.product as Stripe.Product)
                  ?.metadata?.imageUrl || "",

              // Save the product title shown during checkout.
              title: item.description || "Unknown Product",

              // Stripe stores prices in cents, so convert them back to dollars.
              price: (item.price?.unit_amount || 0) / 100,

              // Save the quantity purchased.
              quantity: item.quantity || 1,
            })),
          },
        },
      });
    });
  
  // Return completed purchase
  return NextResponse.json(purchase);

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}
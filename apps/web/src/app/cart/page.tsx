"use client";

import { useCart } from "@/components/Cart/CartContext";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [checkedOut, setCheckedOut] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function handleCheckout() {
    setCheckedOut(true);
    clearCart();
  }

  if (checkedOut) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Payment Successful 🎉</h1>
        <p>Mock checkout complete.</p>
        <Link href="/">Back to store</Link>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border p-4 mb-2"
            >
              <div>
                <p className="font-semibold">{item.title}</p>
                <p>
                  ${item.price} x {item.quantity}
                </p>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6 font-bold text-xl">Total: ${total}</div>

          <button
            onClick={handleCheckout}
            className="mt-4 bg-black text-white px-4 py-2 rounded"
          >
            Mock Checkout
          </button>
        </>
      )}
    </div>
  );
}
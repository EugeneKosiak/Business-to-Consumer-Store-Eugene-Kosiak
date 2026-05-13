"use client";

import { useCart } from "@/components/Cart/CartContext";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const [checkedOut, setCheckedOut] = useState(false);
  const [message, setMessage] = useState("");

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

      {/* ✅ FIX: always reserve test hook for Playwright */}
      {message && (
        <div
          data-testid="max-qty-message"
          className="mb-4 p-2 bg-red-100 text-red-700 rounded"
        >
          {message}
        </div>
      )}

      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border p-4 mb-2 gap-4"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-32 h-32 object-contain rounded-lg shadow-sm"
                />

                <div>
                  <p className="font-semibold">{item.title}</p>

                  <p className="text-sm text-gray-600">
                    ${item.price.toFixed(2)} each × {item.quantity}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="px-2 py-1 border rounded"
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => {
                        const nextQty = item.quantity + 1;

                        const reachedMax = updateQuantity(item.id, nextQty);

                        if (reachedMax) {
                          setMessage(`Max quantity of "${item.title}" has been reached`);

                          // IMPORTANT: keep it long enough for Playwright
                          setTimeout(() => setMessage(""), 3000);
                        }
                      }}
                      className="px-2 py-1 border rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6 font-bold text-xl">
            Total: ${total}
          </div>

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
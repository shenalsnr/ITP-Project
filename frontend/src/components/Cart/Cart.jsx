// src/pages/Cart.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart } from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000/api";

const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
};
const setCart = (items) => localStorage.setItem("cart", JSON.stringify(items || []));

function Card({ className = "", children }) {
  return (
    <div className={`rounded-2xl border border-rose-200/60 bg-white/90 shadow-sm dark:border-rose-900/40 dark:bg-zinc-900/70 ${className}`}>
      {children}
    </div>
  );
}

function GradientBtn({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-md hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}

function OutlineBtn({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300/70 bg-amber-100/70 px-4 py-3 text-sm font-medium text-amber-900 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:border-amber-800/50 dark:bg-amber-900/40 dark:text-amber-100 ${className}`}
    >
      {children}
    </button>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const { state } = useLocation(); // { productId, qty } from Product.jsx
  const [items, setItems] = useState(getCart());
  const hasProcessedAdd = useRef(false);

  // Add incoming product once (from Product page)
  useEffect(() => {
    const addIncoming = async () => {
      if (hasProcessedAdd.current) return;
      const incomingId = state?.productId;
      const incomingQty = Number(state?.qty || 1);
      if (!incomingId) return;

      try {
        const { data: p } = await axios.get(`${API_BASE}/products/${incomingId}`);
        const next = [...getCart()];
        const idx = next.findIndex((i) => i.productId === incomingId);
        if (idx >= 0) {
          next[idx].qty += incomingQty;
        } else {
          next.push({
            productId: incomingId,
            name: p.Product_Name || p.name || "Product",
            price: Number(p.Price ?? p.price ?? 0),
            qty: incomingQty,
            image: p.Product_Images?.length
              ? `${API_BASE.replace("/api", "")}/uploads/${p.Product_Images[0]}`
              : undefined,
            currency: "LKR",
          });
        }
        setCart(next);
        setItems(next);
      } catch (e) {
        console.error("Failed to auto-add to cart:", e?.response?.data || e.message);
      } finally {
        hasProcessedAdd.current = true;
        navigate("/cart", { replace: true });
      }
    };
    addIncoming();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.productId, state?.qty]);

  const fmt = useMemo(() => new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }), []);
  const total = useMemo(
    () => items.reduce((s, it) => s + Number(it.price || 0) * Number(it.qty || 0), 0),
    [items]
  );

  const updateQty = (productId, qty) => {
    const next = items.map((it) =>
      it.productId === productId ? { ...it, qty: Math.max(1, qty) } : it
    );
    setItems(next);
    setCart(next);
  };

  const inc = (productId) => {
    const item = items.find((i) => i.productId === productId);
    if (!item) return;
    updateQty(productId, Number(item.qty || 1) + 1);
  };
  const dec = (productId) => {
    const item = items.find((i) => i.productId === productId);
    if (!item) return;
    updateQty(productId, Math.max(1, Number(item.qty || 1) - 1));
  };

  const removeItem = (productId) => {
    const next = items.filter((it) => it.productId !== productId);
    setItems(next);
    setCart(next);
  };

  const clearAll = () => {
    setItems([]);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50 px-4 py-8 dark:from-rose-950/30 dark:via-zinc-950 dark:to-amber-950/20">
      {/* Header */}
      <div className="mx-auto mb-6 max-w-5xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-rose-700 hover:underline dark:text-amber-200"
        >
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>

        <div className="mt-3 rounded-2xl border border-amber-200/60 bg-gradient-to-r from-amber-400 to-rose-500 p-[1px] shadow-lg dark:border-rose-800/30">
          <div
            className="rounded-2xl bg-white/90 backdrop-blur-sm dark:bg-zinc-900/80
                       flex items-center justify-between min-h-[88px] sm:min-h-[112px] px-5"
          >
            <div className="text-left">
              <h2 className="text-2xl font-semibold tracking-tight text-rose-900 dark:text-amber-100">
                Your Cart
              </h2>
              <p className="text-sm text-rose-800/70 dark:text-amber-200/70">
                Review items and proceed to checkout.
              </p>
            </div>
            <ShoppingCart className="hidden sm:block text-rose-700/80 dark:text-amber-200/80" size={28} />
          </div>
        </div>
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div className="mx-auto max-w-3xl">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 h-16 w-16 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 opacity-90" />
              <h3 className="text-lg font-semibold text-rose-900 dark:text-amber-100">Your cart is empty</h3>
              <p className="mt-1 text-sm text-rose-800/70 dark:text-amber-200/70">
                Add products to continue.
              </p>
              <GradientBtn className="mt-4" onClick={() => navigate("/")}>
                Browse Products
              </GradientBtn>
            </div>
          </Card>
        </div>
      ) : (
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[1.4fr_0.6fr]">
          {/* Items */}
          <Card>
            <div className="max-h-[70vh] overflow-auto">
              <table className="w-full table-fixed text-sm">
                <colgroup>
                  <col className="w-[48%]" /> {/* Product */}
                  <col className="w-[14%]" /> {/* Price */}
                  <col className="w-[18%]" /> {/* Qty */}
                  <col className="w-[14%]" /> {/* Subtotal */}
                  <col className="w-[6%]" />  {/* Action */}
                </colgroup>
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="text-left text-gray-700 bg-gradient-to-r from-amber-50 to-white">
                    <th className="p-3 font-semibold">Product</th>
                    <th className="p-3 font-semibold">Price</th>
                    <th className="p-3 font-semibold">Qty</th>
                    <th className="p-3 font-semibold">Subtotal</th>
                    <th className="p-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => {
                    const unit = Number(it.price || 0);
                    const sub = unit * Number(it.qty || 0);
                    return (
                      <tr key={it.productId} className="border-t last:border-b-0 hover:bg-amber-50/40">
                        <td className="p-3 align-middle">
                          <div className="flex items-center gap-3">
                            {it.image ? (
                              <img
                                src={it.image}
                                alt={it.name}
                                className="h-14 w-14 rounded-xl object-cover ring-1 ring-amber-200/60"
                              />
                            ) : (
                              <div className="h-14 w-14 rounded-xl bg-gradient-to-r from-rose-100 to-amber-100" />
                            )}
                            <div className="min-w-0">
                              <div className="truncate font-medium text-gray-900">{it.name}</div>
                              {it.sku && (
                                <div className="font-mono text-xs text-gray-500">SKU: {it.sku}</div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="p-3 align-middle font-medium text-gray-900">
                          {fmt.format(unit)}
                        </td>

                        <td className="p-3 align-middle">
                          <div className="inline-flex items-center rounded-xl border border-amber-300/70 bg-white">
                            <button
                              onClick={() => dec(it.productId)}
                              className="p-2 hover:bg-amber-50"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <input
                              type="number"
                              min={1}
                              value={it.qty}
                              onChange={(e) => updateQty(it.productId, Number(e.target.value))}
                              className="w-16 border-x border-amber-300/70 bg-white px-2 py-1 text-center outline-none focus:ring-2 focus:ring-amber-300"
                            />
                            <button
                              onClick={() => inc(it.productId)}
                              className="p-2 hover:bg-amber-50"
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </td>

                        <td className="p-3 align-middle font-semibold text-gray-900">
                          {fmt.format(sub)}
                        </td>

                        <td className="p-3 align-middle text-right">
                          <button
                            onClick={() => removeItem(it.productId)}
                            className="rounded-lg border border-rose-200 bg-white p-2 text-rose-600 hover:bg-rose-50"
                            title="Remove"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-amber-200/60 p-4">
              <OutlineBtn onClick={clearAll}>Clear Cart</OutlineBtn>
              <div className="text-sm text-gray-600">
                Items: <span className="font-semibold text-gray-900">
                  {items.reduce((a, b) => a + Number(b.qty || 0), 0)}
                </span>
              </div>
            </div>
          </Card>

          {/* Summary */}
          <Card className="h-fit p-5">
            <h3 className="mb-3 text-lg font-semibold text-rose-900 dark:text-amber-100">Order Summary</h3>

            <div className="space-y-2 rounded-xl bg-amber-50 p-4 text-sm dark:bg-amber-950/20">
              <div className="flex items-center justify-between text-rose-800 dark:text-amber-200">
                <span>Subtotal</span>
                <span className="font-medium">{fmt.format(total)}</span>
              </div>
              <div className="flex items-center justify-between text-rose-800/80 dark:text-amber-200/80">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="mt-2 h-px bg-gradient-to-r from-amber-200 to-rose-200 dark:from-rose-900/40 dark:to-amber-900/40" />
              <div className="flex items-center justify-between text-base font-semibold text-rose-900 dark:text-amber-100">
                <span>Total</span>
                <span>{fmt.format(total)}</span>
              </div>
            </div>

            <GradientBtn className="mt-4 w-full" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </GradientBtn>
          </Card>
        </div>
      )}
    </div>
  );
}

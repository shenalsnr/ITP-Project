// src/pages/Checkout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  ShoppingBag,
  ShieldCheck,
  Wallet,
  Truck,
} from "lucide-react";

/* ========= API endpoint (hardcoded) ========= */
const PAYMENTS_ENDPOINT = "http://localhost:5000/api/payments";

/* ========= Currency: FIXED RATE (no live FX) =========
   1 USD = 300 LKR  =>  1 LKR = 1/300 USD
   We assume all base prices in the cart are stored in LKR.
*/
const BASE_CURRENCY = "LKR";
const FIXED_RATE = { // quote per 1 LKR
  LKR: 1,         // 1 LKR = 1 LKR
  USD: 1 / 300,   // 1 LKR = 0.003333... USD
};
const LKR_PER_USD = 300; // internal reference (not shown to buyer)

const convertLKR = (valueLKR, toCurrency) =>
  Number(valueLKR || 0) * (FIXED_RATE[toCurrency] ?? 1);

const localeFor = (cur) => (cur === "USD" ? "en-US" : "en-LK");

/* ========= Cart helpers ========= */
const getCart = () => {
  try { return JSON.parse(localStorage.getItem("cart")) || []; }
  catch { return []; }
};
const setCart = (items) => localStorage.setItem("cart", JSON.stringify(items || []));
const clearCart = () => setCart([]);
const totalLKR = (items = []) =>
  items.reduce((s, it) => s + Number(it.price || 0) * Number(it.qty || 0), 0);

const METHOD_PILLS = [
  { key: "Credit Card", icon: CreditCard },
  { key: "Online Wallet", icon: Wallet },
  { key: "Bank Transfer", icon: ShieldCheck },
  { key: "COD", icon: Truck },
  { key: "PayHere", icon: ShoppingBag },
  { key: "Razorpay", icon: ShoppingBag },
  { key: "Stripe", icon: ShoppingBag },
];

export default function Checkout() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // form
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    currency: "LKR",       // display/charge currency
    method: "Credit Card",
  });

  // load cart
  useEffect(() => {
    setItems(getCart() || []);
  }, []);

  // totals & validation
  const baseGrand = useMemo(() => totalLKR(items), [items]); // LKR
  const grand = useMemo(
    () => convertLKR(baseGrand, form.currency),
    [baseGrand, form.currency]
  );

  const isEmpty = items.length === 0;
  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(form.email || ""), [form.email]);
  const nameOk = useMemo(() => !!(form.name || "").trim(), [form.name]);
  const canSubmit = nameOk && emailOk && !isEmpty && baseGrand > 0 && !submitting;

  const fmt = useMemo(
    () => new Intl.NumberFormat(localeFor(form.currency), { style: "currency", currency: form.currency }),
    [form.currency]
  );

  const onPlaceOrder = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmitting(true);

      const payload = {
        // customer
        name: (form.name || "").trim(),
        email: (form.email || "").trim().toLowerCase(),
        phone: (form.phone || "").trim(),
        address: (form.address || "").trim(),

        // amounts
        amount: Number(grand),         // in selected currency
        currency: form.currency,       // selected currency
        amountBase: Number(baseGrand), // original LKR total

        // method
        method: form.method,

        // snapshot of cart items (base prices in LKR)
        items: items.map((i) => ({
          productId: i.productId || i._id || i.id,
          name: i.name,
          qty: Number(i.qty || 1),
          priceBase: Number(i.price || 0), // unit price in LKR
        })),

        // metadata with FIXED FX used (internal only)
        meta: {
          source: "checkout",
          fx: {
            fixed: true,
            rule: "1 USD = 300 LKR",
            base: BASE_CURRENCY,
            quote: form.currency,
            perLKR: FIXED_RATE[form.currency] ?? 1, // quote per 1 LKR
            LKRperUSD: LKR_PER_USD,
          },
        },
        // status omitted -> backend default (e.g., "pending")
      };

      const res = await axios.post(PAYMENTS_ENDPOINT, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const created = res?.data?.data ?? res?.data?.data?.data ?? res?.data;
      const payId = created?._id || created?.id;
      if (!payId) throw new Error("Payment id missing in response");

      nav(`/payment?id=${payId}`, { state: { payment: created } });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unknown error";
      console.error("Create payment failed:", err?.response?.data || err);
      alert(`Sorry, we couldn't place your order. ${msg}`);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-amber-50 via-white to-rose-50 px-4 py-8 dark:from-rose-950/30 dark:via-zinc-950 dark:to-amber-950/20">
      {/* Header */}
      <div className="mx-auto mb-6 max-w-5xl">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm text-rose-700 hover:underline dark:text-amber-200"
        >
          <ArrowLeft size={16} />
          Back to Cart
        </Link>
        <div className="mt-3 rounded-2xl border border-amber-200/60 bg-gradient-to-r from-amber-400 to-rose-500 p-[1px] shadow-lg dark:border-rose-800/30">
          <div className="rounded-2xl bg-white/90 p-5 backdrop-blur-sm dark:bg-zinc-900/80">
            <h2 className="text-2xl font-semibold tracking-tight text-rose-900 dark:text-amber-100">
              Checkout
            </h2>
            <p className="text-sm text-rose-800/70 dark:text-amber-200/70">
              Enter your details and confirm your order.
            </p>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[1.2fr_0.8fr]">
        {/* Left: form */}
        <form
          onSubmit={onPlaceOrder}
          className="rounded-2xl border border-rose-200/60 bg-white/90 p-5 shadow-sm dark:border-rose-900/40 dark:bg-zinc-900/70"
        >
          {/* Contact */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-rose-900 dark:text-amber-100">
              Contact details
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-rose-800/80 dark:text-amber-200/80">Full name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Dinusha Lakmal"
                  className="h-11 rounded-xl border border-amber-300/70 bg-white px-3 text-rose-900 outline-none focus:ring-2 focus:ring-amber-400 dark:border-amber-800/50 dark:bg-zinc-900 dark:text-amber-100"
                />
                {!nameOk && (
                  <span className="mt-1 text-xs text-rose-600 dark:text-amber-300">
                    Name is required.
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-rose-800/80 dark:text-amber-200/80">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="h-11 rounded-xl border border-amber-300/70 bg-white px-3 text-rose-900 outline-none focus:ring-2 focus:ring-amber-400 dark:border-amber-800/50 dark:bg-zinc-900 dark:text-amber-100"
                />
                {!emailOk && form.email && (
                  <span className="mt-1 text-xs text-rose-600 dark:text-amber-300">
                    Enter a valid email address.
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-rose-800/80 dark:text-amber-200/80">Phone (optional)</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+94 7X XXX XXXX"
                  className="h-11 rounded-xl border border-amber-300/70 bg-white px-3 text-rose-900 outline-none focus:ring-2 focus:ring-amber-400 dark:border-amber-800/50 dark:bg-zinc-900 dark:text-amber-100"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-rose-800/80 dark:text-amber-200/80">Currency</label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="h-11 rounded-xl border border-amber-300/70 bg-white px-3 text-rose-900 outline-none focus:ring-2 focus:ring-amber-400 dark:border-amber-800/50 dark:bg-zinc-900 dark:text-amber-100"
                >
                  <option value="LKR">LKR</option>
                  <option value="USD">USD</option>
                </select>
                {/* No buyer-facing FX text */}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-rose-900 dark:text-amber-100">
              Shipping / billing address
            </h3>
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Apartment, road, city, postal code"
              className="w-full rounded-xl border border-amber-300/70 bg-white px-3 py-2 text-rose-900 outline-none focus:ring-2 focus:ring-amber-400 dark:border-amber-800/50 dark:bg-zinc-900 dark:text-amber-100"
            />
          </div>

          {/* Method */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-rose-900 dark:text-amber-100">
              Payment method
            </h3>

            <div className="mb-3 flex flex-wrap gap-2">
              {METHOD_PILLS.map(({ key, icon: Icon }) => {
                const active = form.method === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setForm({ ...form, method: key })}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                      active
                        ? "border-transparent bg-gradient-to-r from-rose-600 to-amber-500 font-semibold text-white shadow"
                        : "border-amber-300/70 bg-white text-rose-800 hover:bg-amber-50 dark:border-amber-800/50 dark:bg-zinc-900 dark:text-amber-100"
                    }`}
                  >
                    <Icon size={16} />
                    {key}
                  </button>
                );
              })}
            </div>

            {/* Fallback select for enum safety */}
            <select
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value })}
              className="h-11 w-full rounded-xl border border-amber-300/70 bg-white px-3 text-rose-900 outline-none focus:ring-2 focus:ring-amber-400 dark:border-amber-800/50 dark:bg-zinc-900 dark:text-amber-100"
            >
              <option>Credit Card</option>
              <option>Online Wallet</option>
              <option>Bank Transfer</option>
              <option>COD</option>
              <option>PayHere</option>
              <option>Razorpay</option>
              <option>Stripe</option>
            </select>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Link
              to="/cart"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300/70 bg-amber-100/70 px-4 py-3 text-sm font-medium text-amber-900 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:border-amber-800/50 dark:bg-amber-900/40 dark:text-amber-100"
            >
              <ArrowLeft size={16} />
              Back to Cart
            </Link>

            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-md hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <Loader2 className="animate-spin" size={16} /> : <CreditCard size={16} />}
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          </div>

          {/* Inline guard messages */}
          {!isEmpty && baseGrand === 0 && (
            <div className="mt-3 rounded-lg border border-amber-300/40 bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:border-amber-800/40 dark:text-amber-200">
              Amount must be greater than 0 to proceed.
            </div>
          )}
          {isEmpty && (
            <div className="mt-3 rounded-lg border border-amber-300/40 bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:border-amber-800/40 dark:text-amber-200">
              Your cart is empty. Add items before placing the order.
            </div>
          )}
        </form>

        {/* Right: summary */}
        <aside className="h-fit rounded-2xl border border-rose-200/60 bg-white/90 p-5 shadow-sm dark:border-rose-900/40 dark:bg-zinc-900/70">
          <h3 className="mb-3 text-lg font-semibold text-rose-900 dark:text-amber-100">
            Order summary
          </h3>

          {isEmpty ? (
            <div className="rounded-xl border border-dashed border-rose-300/60 p-4 text-sm text-rose-700/70 dark:border-rose-800/50 dark:text-amber-200/80">
              Your cart is empty.
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((i) => {
                const qty = Number(i.qty || 1);
                const unitDisplay = convertLKR(Number(i.price || 0), form.currency);
                const lineTotal = unitDisplay * qty;
                return (
                  <li
                    key={i.productId || i._id || i.id || i.name}
                    className="flex items-center justify-between rounded-xl border border-amber-200/60 bg-white/80 px-3 py-2 dark:border-amber-800/40 dark:bg-zinc-900/50"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-rose-900 dark:text-amber-100">
                        {i.name}
                      </div>
                      <div className="text-xs text-rose-800/70 dark:text-amber-200/70">
                        Qty {qty} × {new Intl.NumberFormat(localeFor(form.currency), { style: "currency", currency: form.currency }).format(unitDisplay)}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-rose-900 dark:text-amber-100">
                      {fmt.format(lineTotal)}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-4 space-y-2 rounded-xl bg-amber-50 p-4 text-sm dark:bg-amber-950/20">
            <div className="flex items-center justify-between text-rose-800 dark:text-amber-200">
              <span>Subtotal</span>
              <span>{fmt.format(grand)}</span>
            </div>
            <div className="flex items-center justify-between text-rose-800/80 dark:text-amber-200/80">
              <span>Delivery</span>
              <span>Free</span>
            </div>
            <div className="mt-2 h-px bg-gradient-to-r from-amber-200 to-rose-200 dark:from-rose-900/40 dark:to-amber-900/40" />
            <div className="flex items-center justify-between text-base font-semibold text-rose-900 dark:text-amber-100">
              <span>Total</span>
              <span>{fmt.format(grand)}</span>
            </div>
            {/* No buyer-facing FX text */}
          </div>
        </aside>
      </div>
    </div>
  );
}

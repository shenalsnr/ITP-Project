// src/pages/Orders.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  RefreshCcw,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  RotateCcw,
  ChevronRight,
  ChevronDown,
  Hash,
  Truck,
  Phone,
  MapPin,
} from "lucide-react";

/* ---------------- Error Boundary (prevents blank screen) ---------------- */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("Orders page crashed:", error, info);
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-[90vh] bg-gradient-to-b from-amber-50 via-white to-rose-50 px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-rose-300/60 bg-white/90 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-rose-900">Something went wrong</h2>
          <p className="mt-2 text-sm text-rose-800/80">
            The Orders page hit an error. Check the browser console for details.
          </p>
          <pre className="mt-3 max-h-48 overflow-auto rounded-lg bg-rose-50 p-3 text-xs text-rose-700">
            {String(this.state.error?.message || this.state.error || "Unknown error")}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
}

/* ------------------------------ Config ------------------------------ */
const API_BASE =
  (import.meta && import.meta.env && import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
    : null) || "http://localhost:5000/api";

/* --------- API helper (tolerant to HTML/non-JSON & errors) ---------- */
async function listPayments({ page = 1, limit = 100 }) {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
  const res = await fetch(`${API_BASE}/payments?${qs}`, { credentials: "include" });
  const text = await res.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    // Return a consistent shape so UI never crashes
    json = { data: [] };
  }

  if (!res.ok) {
    const msg = typeof json === "object" ? JSON.stringify(json) : text;
    throw new Error(`List failed: ${res.status} ${msg}`);
  }
  return json;
}

/* ================================ Page =============================== */
function OrdersInner() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openRowId, setOpenRowId] = useState(null); // expand details
  const [q, setQ] = useState(""); // item / order search
  const loadIdRef = useRef(0); // race protection

  // Currency formatter per currency (defaults to LKR)
  const fmt = useMemo(
    () => (currency) =>
      new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: currency || "LKR",
      }),
    []
  );

  const badge = (status) => {
    const base =
      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border";
    switch (String(status || "").toLowerCase()) {
      case "completed":
      case "paid":
        return `${base} border-emerald-300/60 bg-emerald-100/70 text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-900/40 dark:text-emerald-100`;
      case "pending":
        return `${base} border-amber-300/60 bg-amber-100/70 text-amber-800 dark:border-amber-800/50 dark:bg-amber-900/40 dark:text-amber-100`;
      case "failed":
      case "canceled":
      case "cancelled":
        return `${base} border-rose-300/60 bg-rose-100/70 text-rose-800 dark:border-rose-800/50 dark:bg-rose-900/40 dark:text-rose-100`;
      case "refunded":
        return `${base} border-sky-300/60 bg-sky-100/70 text-sky-800 dark:border-sky-800/50 dark:bg-sky-900/40 dark:text-sky-100`;
      default:
        return `${base} border-zinc-300/60 bg-zinc-100/70 text-zinc-800 dark:border-zinc-700/50 dark:bg-zinc-800/60 dark:text-zinc-100`;
    }
  };

  const shipBadge = (ship) => {
    const base =
      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium border";
    switch (String(ship || "").toLowerCase()) {
      case "delivered":
        return `${base} border-emerald-300/60 bg-emerald-100/70 text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-900/40 dark:text-emerald-100`;
      case "shipped":
        return `${base} border-sky-300/60 bg-sky-100/70 text-sky-800 dark:border-sky-800/50 dark:bg-sky-900/40 dark:text-sky-100`;
      case "processing":
        return `${base} border-amber-300/60 bg-amber-100/70 text-amber-800 dark:border-amber-800/50 dark:bg-amber-900/40 dark:text-amber-100`;
      default:
        return `${base} border-zinc-300/60 bg-zinc-100/70 text-zinc-800 dark:border-zinc-700/50 dark:bg-zinc-800/60 dark:text-zinc-100`;
    }
  };

  const StatusIconOf = (st) => {
    const s = String(st || "").toLowerCase();
    if (s === "completed" || s === "paid") return CheckCircle2;
    if (s === "pending") return Clock;
    return XCircle;
  };

  // --------- PDF Receipt (client-side) ----------
  const downloadPdf = async (pmt) => {
    try {
      const { jsPDF } = await import("jspdf"); // npm i jspdf
      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text("Payment Receipt", 14, 18);

      doc.setFontSize(11);
      const linesTop = [
        ["Order / ID", String(pmt.orderId || pmt._id || "—")],
        ["Tracking", pmt.trackingNumber || "—"],
        ["Status", pmt.status || "—"],
        ["Shipping", pmt.shippingStatus || "—"],
        ["Amount", `${fmt(pmt.currency)(pmt.amount || 0)} ${pmt.currency || "LKR"}`],
        ["Method", pmt.method || "—"],
        ["Created", pmt.createdAt ? new Date(pmt.createdAt).toLocaleString() : "—"],
      ];
      let y = 28;
      linesTop.forEach(([k, v]) => {
        doc.text(`${k}:`, 14, y);
        doc.text(String(v), 60, y);
        y += 8;
      });

      y += 4;
      doc.setDrawColor(200);
      doc.line(14, y, 196, y);
      y += 8;

      const contact = [
        ["Customer", `${pmt.name || "—"} (${pmt.email || "—"})`],
        ["Phone", pmt.phone || "—"],
        ["Address", pmt.address || "—"],
        ["Reference", pmt.reference || "—"],
        ["Notes", pmt?.meta?.notes || "—"],
      ];
      contact.forEach(([k, v]) => {
        doc.text(`${k}:`, 14, y);
        doc.text(String(v), 60, y);
        y += 8;
      });

      // Items (no unit/line totals here per your preference)
      const items = Array.isArray(pmt.items) ? pmt.items : [];
      if (items.length) {
        y += 6;
        doc.setFontSize(12);
        doc.text("Items", 14, y);
        doc.setFontSize(11);
        y += 6;
        items.forEach((it, idx) => {
          const line = `${idx + 1}. ${it?.name || "Item"}  x${it?.qty || 1}`;
          doc.text(line, 18, y);
          y += 6;
        });
      }

      y += 8;
      doc.setDrawColor(200);
      doc.line(14, y, 196, y);
      y += 8;
      doc.setFontSize(9);
      doc.text("Generated by CeloSpice", 14, y);

      doc.save(`receipt_${pmt._id || "order"}.pdf`);
    } catch (e) {
      console.error(e);
      alert("Could not generate PDF. Make sure 'jspdf' is installed.");
    }
  };

  /* ------------------------- Load orders ------------------------- */
  const runLoad = async () => {
    const myId = ++loadIdRef.current; // mark this request
    try {
      setLoading(true);
      setError("");
      const payload = await listPayments({ page: 1, limit: 100 });

      // ignore stale/older responses
      if (myId !== loadIdRef.current) return;

      const list = Array.isArray(payload?.data?.data)
        ? payload.data.data
        : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
        ? payload
        : [];
      setRows(list);
    } catch (e) {
      console.error(e);
      setError("Could not load orders. Please try again.");
      // keep previous rows to avoid flicker/blank
    } finally {
      if (myId === loadIdRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    runLoad();
  }, []);

  // Persist search term (prevents “disappearing” filter on reload)
  useEffect(() => {
    const savedQ = localStorage.getItem("orders_q");
    if (savedQ) setQ(savedQ);
  }, []);
  useEffect(() => {
    localStorage.setItem("orders_q", q);
  }, [q]);

  /* -------------------- Client-side item/order filter ------------------- */
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return rows; // show all until 2+ chars
    return rows.filter((r) => {
      const inId =
        String(r.orderId || r._id || "").toLowerCase().includes(term) ||
        String(r.reference || "").toLowerCase().includes(term);
      const inItems = Array.isArray(r.items)
        ? r.items.some((it) => String(it?.name || "").toLowerCase().includes(term))
        : false;
      return inId || inItems;
    });
  }, [rows, q]);

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-amber-50 via-white to-rose-50 px-4 py-8 dark:from-rose-950/30 dark:via-zinc-950 dark:to-amber-950/20">
      {/* Back to cart */}
      <div className="mx-auto mb-3 max-w-5xl">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm text-rose-700 hover:underline dark:text-amber-200"
        >
          <ArrowLeft size={16} />
          Back to Cart
        </Link>
      </div>

      {/* Header */}
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-r from-amber-400 to-rose-500 p-[1px] shadow-lg dark:border-rose-800/30">
          <div className="rounded-2xl bg-white/90 p-6 backdrop-blur-md dark:bg-zinc-900/80">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-md">
                  <Package size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-rose-900 dark:text-amber-100">
                    Orders
                  </h2>
                  <p className="text-sm text-rose-800/70 dark:text-amber-200/70">
                    Browse and filter your orders by item or ID.
                  </p>
                </div>
              </div>

              {/* Refresh */}
              <button
                onClick={runLoad}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 px-3 py-2 text-xs font-medium text-white shadow hover:opacity-95"
                title="Refresh"
              >
                <RefreshCcw size={14} />
                Refresh
              </button>
            </div>

            {/* Item / Order search */}
            <div className="mt-4">
              <div className="relative w-full sm:max-w-md">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-rose-700/70 dark:text-amber-200/70">
                  <Search size={16} />
                </div>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search items or order ID (e.g., 'Sneakers', 'TX-12AB', '64f...')"
                  className="h-11 w-full rounded-xl border border-amber-300/70 bg-white pl-9 pr-3 text-rose-900 outline-none focus:ring-2 focus:ring-amber-400 dark:border-amber-800/50 dark:bg-zinc-900 dark:text-amber-100"
                />
              </div>
            </div>

            {error && (
              <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">{error}</p>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto mt-6 max-w-5xl">
        {loading ? (
          <div className="rounded-2xl border border-rose-200/60 bg-white/90 p-6 text-center dark:border-rose-900/40 dark:bg-zinc-900/70">
            <RefreshCcw className="mx-auto animate-spin text-rose-600" size={20} />
            <p className="mt-2 text-sm text-rose-800 dark:text-amber-200">Loading orders…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-rose-300/60 bg-white/70 p-8 text-center dark:border-rose-900/40 dark:bg-zinc-900/60">
            <XCircle className="mx-auto text-rose-500" size={22} />
            <p className="mt-2 text-sm text-rose-800/80 dark:text-amber-200/80">
              {q ? "No matching orders for your search." : "No orders to show yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-rose-200/60 bg-white/90 shadow-sm dark:border-rose-900/40 dark:bg-zinc-900/70">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-gradient-to-r from-amber-50 to-rose-50 dark:from-rose-950/40 dark:to-amber-950/20">
                  <tr className="text-left text-sm text-rose-800/80 dark:text-amber-200/80">
                    <th className="px-4 py-3 font-semibold">Order / ID</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Method</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Created</th>
                    <th className="px-4 py-3 font-semibold">Tracking</th>
                    <th className="px-4 py-3 font-semibold">Shipping</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, idx) => {
                    const st = String(r?.status || "").toLowerCase();
                    const StatusIcon = StatusIconOf(st);
                    const key = r._id || `row-${idx}`;
                    const open = openRowId === (r._id || idx);

                    return (
                      <React.Fragment key={key}>
                        <tr className="border-t border-rose-100/70 hover:bg-amber-50/50 dark:border-rose-900/40 dark:hover:bg-zinc-800/40">
                          <td className="px-4 py-3 text-sm text-rose-900 dark:text-amber-100">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setOpenRowId(open ? null : (r._id || idx))}
                                className="rounded-md border border-transparent p-1 hover:bg-amber-50 dark:hover:bg-zinc-800"
                                title={open ? "Hide details" : "Show details"}
                              >
                                {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                              </button>
                              <div className="flex flex-col">
                                <Link
                                  to={`/payment?id=${r._id}`}
                                  state={{ payment: r }}
                                  className="font-medium text-rose-700 hover:underline dark:text-amber-200"
                                  title="View / continue payment"
                                >
                                  {r.orderId || r._id}
                                </Link>
                                {r.reference && (
                                  <span className="text-xs text-rose-700/70 dark:text-amber-200/70">
                                    Ref: {r.reference}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3 text-sm text-rose-900 dark:text-amber-100">
                            {fmt(r.currency)((r.amount || 0))}
                            <span className="ml-1 text-xs text-rose-700/70 dark:text-amber-200/70">
                              {r.currency || "LKR"}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-sm text-rose-900 dark:text-amber-100">
                            {r.method}
                          </td>

                          <td className="px-4 py-3 text-sm">
                            <span className={badge(r.status)}>
                              <StatusIcon size={14} />
                              {r.status}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-sm text-rose-900 dark:text-amber-100">
                            {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                          </td>

                          <td className="px-4 py-3 text-sm text-rose-900 dark:text-amber-100">
                            <div className="inline-flex items-center gap-1">
                              <Hash size={14} className="opacity-70" />
                              {r.trackingNumber || "—"}
                            </div>
                          </td>

                          <td className="px-4 py-3 text-sm text-rose-900 dark:text-amber-100">
                            <span className={shipBadge(r.shippingStatus)}>
                              <Truck size={14} />
                              {r.shippingStatus || "—"}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-sm">
                            <div className="flex flex-wrap items-center gap-2">
                              {(["pending", "failed"].includes(st)) && (
                                <Link
                                  to={`/payment?id=${r._id}`}
                                  state={{ payment: r }}
                                  className="inline-flex items-center gap-1 rounded-lg border border-amber-300/70 bg-amber-100/70 px-2.5 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-100 dark:border-amber-800/50 dark:bg-amber-900/40 dark:text-amber-100"
                                  title="Retry / continue payment"
                                >
                                  <RotateCcw size={14} />
                                  Retry
                                </Link>
                              )}
                              <button
                                onClick={() => downloadPdf(r)}
                                className="inline-flex items-center gap-1 rounded-lg border border-rose-300/70 bg-rose-100/70 px-2.5 py-1.5 text-xs font-medium text-rose-900 hover:bg-rose-100 dark:border-rose-800/50 dark:bg-rose-900/40 dark:text-rose-100"
                                title="Download receipt PDF"
                              >
                                <Download size={14} />
                                PDF
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expandable details row */}
                        {open && (
                          <tr className="border-t border-rose-100/50 dark:border-rose-900/40">
                            <td colSpan={8} className="px-4 py-3 text-sm">
                              <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-3 dark:border-amber-800/40 dark:bg-amber-900/20">
                                <div className="grid gap-3 md:grid-cols-2">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-rose-900 dark:text-amber-100">
                                      <Phone size={14} className="opacity-70" />
                                      <span className="font-medium">Phone:</span>
                                      <span>{r.phone || "—"}</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-rose-900 dark:text-amber-100">
                                      <MapPin size={14} className="mt-0.5 opacity-70" />
                                      <span className="font-medium">Address:</span>
                                      <span className="whitespace-pre-wrap">{r.address || "—"}</span>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="font-medium text-rose-900 dark:text-amber-100 mb-1">
                                      Items
                                    </div>
                                    {Array.isArray(r.items) && r.items.length > 0 ? (
                                      <ul className="space-y-1">
                                        {r.items.map((it, iidx) => (
                                          <li
                                            key={iidx}
                                            className="flex items-center justify-between rounded-lg border border-rose-200/60 bg-white/60 px-3 py-1.5 dark:border-rose-900/40 dark:bg-zinc-900/50"
                                          >
                                            <div className="truncate">
                                              <span className="text-rose-900 dark:text-amber-100">
                                                {it?.name || `Item ${iidx + 1}`}
                                              </span>
                                              <span className="ml-2 text-xs text-rose-700/70 dark:text-amber-200/70">
                                                x{it?.qty || 1}
                                              </span>
                                            </div>
                                            <div className="text-sm text-rose-900 dark:text-amber-100">
                                              {fmt(r.currency)(Number(it?.price || 0))}
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <div className="rounded-lg border border-dashed border-rose-300/60 p-2 text-xs text-rose-700/70 dark:border-rose-800/50 dark:text-amber-200/70">
                                        No items available.
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between gap-3 border-t border-rose-100/70 bg-white/70 px-4 py-3 text-sm dark:border-rose-900/40 dark:bg-zinc-900/70">
              <div className="text-rose-800/70 dark:text-amber-200/70">
                Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </div>
              <button
                onClick={runLoad}
                className="inline-flex items-center gap-2 rounded-lg border border-amber-300/70 bg-amber-100/70 px-3 py-2 text-amber-900 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:border-amber-800/50 dark:bg-amber-900/40 dark:text-amber-100"
              >
                <RefreshCcw size={14} />
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Wrap with ErrorBoundary so the whole app never goes blank */
export default function Orders() {
  return (
    <ErrorBoundary>
      <OrdersInner />
    </ErrorBoundary>
  );
}

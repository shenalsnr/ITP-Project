// src/pages/Payment.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CreditCard,
  BadgeCheck,
  XCircle,
  Loader2,
  Printer,
  FileDown,
  RotateCcw,
  Info,
  RefreshCw,
} from "lucide-react";

/* ---------- Config ---------- */
const API_BASE =
  (import.meta?.env?.VITE_API_URL &&
    import.meta.env.VITE_API_URL.replace(/\/$/, "")) ||
  "http://localhost:5000/api";

/* ---------- Brand text for PDF header (plain) ---------- */
const SITE_NAME = "CeloSpice";                 // ← change to your site name
const SITE_URL = "https://celospice.example";  // ← optional (leave "" to hide)

/* ---------- Helpers ---------- */
const maskId = (id) => (id ? `${id.slice(0, 4)}…${id.slice(-4)}` : "—");

/** Prefer server doc → router state → localStorage('checkout:lastForm') */
const resolveAddress = (pDoc, pFromState) => {
  const pick = (p) =>
    p?.address ??
    p?.billingAddress ??
    p?.shippingAddress ??
    p?.meta?.address ??
    "";
  const fromDoc = pick(pDoc);
  if (fromDoc) return fromDoc;
  const fromState = pick(pFromState);
  if (fromState) return fromState;
  try {
    const last = JSON.parse(localStorage.getItem("checkout:lastForm") || "{}");
    if (last?.address) return String(last.address);
  } catch {}
  return "";
};

async function fetchPayment(id) {
  const res = await fetch(`${API_BASE}/payments/${id}`);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json(); // supports {data}, {data:{data}}, or raw doc
}
async function updatePayment(id, body, method = "PUT") {
  const res = await fetch(`${API_BASE}/payments/${id}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Update failed: ${res.status}`);
  return res.json();
}

const statusPill = (s = "") => {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border";
  switch ((s || "").toLowerCase()) {
    case "paid":
    case "completed":
    case "success":
      return `${base} border-emerald-300 bg-emerald-100 text-emerald-700`;
    case "pending":
    case "processing":
      return `${base} border-amber-300 bg-amber-100 text-amber-700`;
    case "failed":
    case "canceled":
    case "cancelled":
      return `${base} border-rose-300 bg-rose-100 text-rose-700`;
    default:
      return `${base} border-gray-300 bg-gray-100 text-gray-700`;
  }
};
const go = (x) =>
  typeof x === "number"
    ? window.history.go(x)
    : window.location.assign(x.startsWith("/") ? x : `/${x}`);

/* =================================================================== */
/* ===================== Success / Failed views ====================== */
/* =================================================================== */

function SuccessView({ payment, routedPayment, onMakePdf }) {
  const fmt = useMemo(
    () =>
      new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: payment?.currency || routedPayment?.currency || "LKR",
      }),
    [payment?.currency, routedPayment?.currency]
  );

  const address = useMemo(
    () => resolveAddress(payment, routedPayment),
    [payment, routedPayment]
  );

  const email = payment?.email || routedPayment?.email || "—";
  const method = payment?.method || routedPayment?.method || "—";
  const createdAt = payment?.createdAt || routedPayment?.createdAt || null;

  const onPrint = () => window.print();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 via-white to-rose-50 px-4">
      <div className="max-w-xl w-full space-y-5">
        {/* Header */}
        <div className="rounded-2xl border border-amber-200/60 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <CheckCircle className="text-emerald-600" size={56} />
            <h1 className="text-2xl font-semibold text-rose-900">Payment Successful</h1>
            <p className="text-sm text-rose-800/80 text-center">
              Thank you{payment?.name ? `, ${payment.name}` : ""}! Your order has been placed.
            </p>
          </div>
        </div>

        {/* Receipt summary card */}
        <div className="rounded-2xl border border-rose-200/60 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border bg-amber-50/60 p-3">
              <div className="text-rose-700/70">Status</div>
              <div className="mt-1 font-medium capitalize text-rose-900">
                {payment?.status || "pending"}
              </div>
            </div>
            <div className="rounded-xl border bg-amber-50/60 p-3">
              <div className="text-rose-700/70">Method</div>
              <div className="mt-1 font-medium text-rose-900">{method}</div>
            </div>
            <div className="rounded-xl border bg-amber-50/60 p-3">
              <div className="text-rose-700/70">Email</div>
              <div className="mt-1 truncate font-medium text-rose-900">{email}</div>
            </div>
            <div className="rounded-xl border bg-amber-50/60 p-3">
              <div className="text-rose-700/70">Created</div>
              <div className="mt-1 font-medium text-rose-900">
                {createdAt ? new Date(createdAt).toLocaleString() : "—"}
              </div>
            </div>
            <div className="col-span-2 rounded-xl border bg-amber-50/60 p-3">
              <div className="text-rose-700/70">Address</div>
              <div className="mt-1 font-medium text-rose-900 whitespace-pre-wrap">
                {address || "—"}
              </div>
            </div>
          </div>

          <div className="mt-4 h-px bg-rose-200" />

          <div className="mt-4 flex items-center justify-between text-base font-semibold text-rose-900">
            <span>Total</span>
            <span>{fmt.format(Number(payment?.amount || routedPayment?.amount || 0))}</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
            {/* Single place to generate PDF */}
            <button
              onClick={onMakePdf}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200/60 bg-white px-4 py-2.5 text-sm font-medium text-rose-900 hover:bg-amber-50"
              title="Download PDF receipt"
            >
              <FileDown size={16} /> Receipt (PDF)
            </button>
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200/60 bg-white px-4 py-2.5 text-sm font-medium text-rose-900 hover:bg-amber-50"
            >
              <Printer size={16} /> Print
            </button>
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 px-5 py-2.5 text-sm font-medium text-white shadow hover:opacity-95"
            >
              View Orders <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-xl border border-amber-200/60 bg-white px-5 py-2.5 text-sm font-medium text-rose-900 hover:bg-amber-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

function FailedView({ payment, reason }) {
  const finalReason =
    reason ||
    payment?.meta?.notes ||
    (payment?.status ? `status: ${payment.status}` : "Unknown error");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 via-white to-amber-50 px-4">
      <div className="max-w-lg w-full rounded-2xl border border-rose-300/60 bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center gap-3">
          <XCircle className="text-rose-600" size={56} />
          <h1 className="text-2xl font-semibold text-rose-900">Payment Failed</h1>
          <p className="text-sm text-rose-800/80 text-center">
            We couldn’t complete your payment.
          </p>

          <div className="mt-3 w-full rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            <div className="flex items-start gap-2">
              <Info size={16} className="mt-0.5" />
              <div>
                <div className="font-medium">Reason</div>
                <div className="text-rose-900/90">{finalReason}</div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/checkout"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 px-5 py-2.5 text-sm font-medium text-white shadow hover:opacity-95"
            >
              <RotateCcw size={16} /> Try Again
            </Link>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200/60 bg-white px-5 py-2.5 text-sm font-medium text-rose-900 hover:bg-amber-50"
            >
              Continue Shopping
            </Link>
          </div>

          <p className="mt-3 text-[11px] text-rose-800/70 text-center">
            If funds were deducted, they’ll be auto-reversed by your bank or the
            gateway.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =================================================================== */
/* =========================== Main Page ============================= */
/* =================================================================== */

export default function Payment() {
  const id = new URLSearchParams(window.location.search).get("id");
  const location = useLocation();
  const routedPayment =
    location?.state?.payment ||
    (window.history?.state && window.history.state.usr?.payment) ||
    null;

  const [doc, setDoc] = useState(routedPayment || null);
  const [loading, setLoading] = useState(!!id);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [view, setView] = useState("detail"); // 'detail' | 'success' | 'failed'

  /* ----------------------- Simple PDF Receipt ----------------------- */
  // Items section now ONLY shows Item + Qty.
  // Amount is printed once at the very end in a bold TOTAL section.
  const makeReceiptPdf = async (pmt) => {
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ unit: "mm", format: "a4" });

      const W = pdf.internal.pageSize.getWidth();
      let y = 14;

      const currency = pmt?.currency || routedPayment?.currency || "LKR";
      const fmt = new Intl.NumberFormat("en-LK", { style: "currency", currency });

      const amount = Number(pmt?.amount ?? routedPayment?.amount ?? 0);
      const address = resolveAddress(pmt, routedPayment) || "—";
      const receiptNo = pmt?.meta?.txId || maskId(pmt?._id);
      const createdAt = pmt?.createdAt
        ? new Date(pmt.createdAt).toLocaleString()
        : routedPayment?.createdAt
        ? new Date(routedPayment.createdAt).toLocaleString()
        : "—";
      const method = pmt?.method || routedPayment?.method || "—";
      const name = pmt?.name || routedPayment?.name || "—";
      const email = pmt?.email || routedPayment?.email || "—";
      const status = (pmt?.status || "paid").toString().toUpperCase();

      const writeKV = (k, v) => {
        pdf.setFont("helvetica", "bold"); pdf.text(`${k}:`, 14, y);
        pdf.setFont("helvetica", "normal"); pdf.text(String(v), 48, y);
        y += 7;
      };
      const hr = () => { pdf.setDrawColor(200); pdf.line(14, y, W - 14, y); y += 8; };

      // Header
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text("RECEIPT", 14, y);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      if (SITE_NAME) pdf.text(SITE_NAME, W - 14, y, { align: "right" });
      y += 6;
      if (SITE_URL) { pdf.text(SITE_URL, W - 14, y, { align: "right" }); y += 2; }
      y += 4;
      hr();

      // Meta
      pdf.setFontSize(11);
      writeKV("Receipt No", receiptNo || "—");
      writeKV("Date / Time", createdAt);
      writeKV("Status", status);
      hr();

      // Bill To
      pdf.setFont("helvetica", "bold");
      pdf.text("BILL TO", 14, y);
      y += 7;
      pdf.setFont("helvetica", "normal");
      writeKV("Name", name);
      writeKV("Email", email);

      pdf.setFont("helvetica", "bold");
      pdf.text("Address:", 14, y);
      pdf.setFont("helvetica", "normal");
      const addrLines = pdf.splitTextToSize(address, W - 28);
      y += 6;
      pdf.text(addrLines, 14, y);
      y += 7 * (Array.isArray(addrLines) ? addrLines.length : 1);
      y += 2;
      hr();

      // Payment info (no amount here)
      pdf.setFont("helvetica", "bold");
      pdf.text("PAYMENT", 14, y);
      y += 7;
      pdf.setFont("helvetica", "normal");
      writeKV("Method", method);
      writeKV("Currency", currency);
      hr();

      // ITEMS: Item + Qty only
      const items = Array.isArray(pmt?.items)
        ? pmt.items
        : Array.isArray(routedPayment?.items)
        ? routedPayment.items
        : [];

      if (items.length) {
        pdf.setFont("helvetica", "bold");
        pdf.text("ITEMS", 14, y);
        y += 7;

        // Headers
        pdf.setFont("helvetica", "bold");
        pdf.text("Item", 14, y);
        pdf.text("Qty", W - 14, y, { align: "right" });
        y += 6;
        pdf.setDrawColor(210); pdf.line(14, y, W - 14, y); y += 5;
        pdf.setFont("helvetica", "normal");

        items.forEach((it) => {
          const qty = Number(it.qty || 1);
          const nameLine = String(it.name || "Item");
          const nameLines = pdf.splitTextToSize(nameLine, W - 28);

          nameLines.forEach((ln, idx) => {
            pdf.text(ln, 14, y);
            if (idx === 0) {
              pdf.text(String(qty), W - 14, y, { align: "right" });
            }
            y += 6;
            if (y > 280) { pdf.addPage(); y = 14; }
          });
          y += 2;
        });

        pdf.setDrawColor(210); pdf.line(14, y, W - 14, y); y += 6;
      }

      // TOTAL at the end
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("TOTAL", 14, y);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(14);
      pdf.text(fmt.format(amount), W - 14, y, { align: "right" });
      y += 10;

      // Footer note
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(
        "This is a computer-generated receipt. Please keep it for your records.",
        14,
        y
      );

      const stamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const fnameSafe = (SITE_NAME || "shop").replace(/\s+/g, "_").toLowerCase();
      pdf.save(`${fnameSafe}_receipt_${stamp}.pdf`);
    } catch (e) {
      console.error(e);
      alert("Could not generate PDF. Make sure 'jspdf' is installed.");
    }
  };

  /* --------------------------- Loading data ------------------------- */
  const reload = async () => {
    if (!id) return;
    setLoading(true);
    setErr("");
    try {
      const r = await fetchPayment(id);
      const data = r?.data?.data || r?.data || r;
      setDoc((prev) => ({ ...(routedPayment || {}), ...(data || {}) })); // merge
    } catch (e) {
      setErr(e?.message || "Failed to load payment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!id) return;
      setLoading(true);
      setErr("");
      try {
        const r = await fetchPayment(id);
        const data = r?.data?.data || r?.data || r;
        if (alive) setDoc({ ...(routedPayment || {}), ...(data || {}) });
      } catch (e) {
        if (alive) setErr(e?.message || "Failed to load payment");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]); // routedPayment already used as initial

  // Auto-switch view if server already final
  useEffect(() => {
    const s = (doc?.status || "").toLowerCase();
    if (!s) return;
    if (["paid", "completed", "success"].includes(s)) setView("success");
    else if (["failed", "canceled", "cancelled"].includes(s)) setView("failed");
  }, [doc?.status]);

  const fmtAmount = useMemo(
    () =>
      new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: doc?.currency || routedPayment?.currency || "LKR",
      }),
    [doc?.currency, routedPayment?.currency]
  );
  const total = useMemo(
    () => Number(doc?.amount ?? routedPayment?.amount ?? 0),
    [doc?.amount, routedPayment?.amount]
  );

  const finalize = async (target) => {
    if (!id) return;
    setBusy(true);
    try {
      const body =
        target === "paid"
          ? {
              status: "paid",
              meta: {
                txId:
                  "TX-" +
                  Math.random().toString(36).slice(2, 8).toUpperCase(),
                notes: "Mock success",
              },
            }
          : { status: "failed", meta: { notes: "Mock failed" } };

      let nextDoc;
      try {
        const r = await updatePayment(id, body, "PUT");
        const serverDoc = r?.data?.data || r?.data || r;
        nextDoc = { ...(routedPayment || {}), ...(serverDoc || {}) };
      } catch (apiErr) {
        nextDoc = { ...(doc || {}), ...body };
        console.warn("API update failed, using local result:", apiErr);
      }

      setDoc(nextDoc);
      setView(target === "paid" ? "success" : "failed");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      console.error(e);
      alert(e?.message || `Couldn't complete action`);
    } finally {
      setBusy(false);
    }
  };

  // Missing ID
  if (!id) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-amber-50 via-white to-rose-50 text-rose-900">
        <div className="mx-auto w-full max-w-5xl px-6 py-8">Missing payment id.</div>
      </div>
    );
  }

  // Success / Failed
  if (view === "success")
    return (
      <SuccessView
        payment={doc}
        routedPayment={routedPayment}
        onMakePdf={() => makeReceiptPdf(doc)}
      />
    );
  if (view === "failed") return <FailedView payment={doc} />;

  // Default: detail + test actions
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-amber-50 via-white to-rose-50 text-rose-900">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => go(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-300/60 bg-white px-3 py-2 text-sm shadow-sm hover:bg-amber-50"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={reload}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 px-3 py-2 text-xs font-medium text-white shadow hover:opacity-95"
              title="Refresh"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
            {doc?.status && (
              <span className={statusPill(doc.status)}>{doc.status}</span>
            )}
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-amber-200/60 bg-white shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-amber-100/70 px-6 py-4">
            <h1 className="text-xl font-semibold text-rose-900">Payment Details</h1>
            {(doc?.method || routedPayment?.method) && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-amber-200/60 bg-amber-50/60 px-3 py-1 text-xs text-rose-900">
                <CreditCard size={14} />
                {doc?.method || routedPayment?.method}
              </div>
            )}
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 gap-8 px-6 py-6 md:grid-cols-2">
            {/* Left: details */}
            <div>
              {loading ? (
                <div className="flex items-center gap-2 text-rose-800/80">
                  <Loader2 className="animate-spin" size={18} /> Loading…
                </div>
              ) : err ? (
                <div className="rounded-xl border border-rose-300/60 bg-rose-50 p-4 text-rose-700">
                  {err}
                </div>
              ) : doc || routedPayment ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-4">
                    <div className="text-xs text-rose-700/70">Customer</div>
                    <div className="text-base font-medium">
                      {doc?.name || routedPayment?.name || "—"}{" "}
                      {doc?.email || routedPayment?.email ? (
                        <span className="text-rose-700/70">
                          ({doc?.email || routedPayment?.email})
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-4">
                    <div className="text-xs text-rose-700/70">Amount</div>
                    <div className="text-lg font-semibold">
                      {fmtAmount.format(total)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-4">
                    <div className="text-xs text-rose-700/70">Created</div>
                    <div className="text-base">
                      {doc?.createdAt || routedPayment?.createdAt
                        ? new Date(
                            doc?.createdAt || routedPayment?.createdAt
                          ).toLocaleString()
                        : "—"}
                    </div>
                  </div>

                  {resolveAddress(doc, routedPayment) && (
                    <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-4">
                      <div className="text-xs text-rose-700/70">Address</div>
                      <div className="text-base whitespace-pre-wrap">
                        {resolveAddress(doc, routedPayment)}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-rose-800/80">Payment not found.</p>
              )}
            </div>

            {/* Right: actions */}
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-200/60 bg-amber-50 p-5">
                <div className="mb-3 text-sm text-rose-800/80">
                  Mock gateway actions (for testing)
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    disabled={busy || loading}
                    onClick={() => finalize("paid")}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 px-4 py-2.5 text-sm font-medium text-white shadow hover:opacity-95 disabled:opacity-60"
                  >
                    <BadgeCheck size={18} /> Pay Now
                  </button>
                  <button
                    disabled={busy || loading}
                    onClick={() => finalize("failed")}
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-medium text-rose-700 shadow-sm hover:bg-rose-50 disabled:opacity-60"
                  >
                    <XCircle size={18} /> Fail Payment
                  </button>
                </div>

                <div className="mt-6 text-xs text-rose-700/70">
                  After success/failure, this page will show the receipt or the fail screen.
                </div>
              </div>
            </div>
          </div>

          {/* Footer (no order id) */}
          <div className="flex items-center justify-end border-t border-amber-100/70 px-6 py-4 text-sm text-rose-800/80" />
        </div>

        {/* Bottom nav */}
        <div className="mt-6 flex items-center justify-between">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-xl border border-amber-300/60 bg-white px-4 py-2 text-sm font-medium text-rose-900 hover:bg-amber-50"
          >
            Continue Shopping
          </Link>
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95"
          >
            View Orders <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

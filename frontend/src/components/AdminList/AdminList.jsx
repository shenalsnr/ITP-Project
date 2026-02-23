import React, { useEffect, useMemo, useState } from "react";
import { Edit, Trash2, ArrowLeft, Save, RefreshCw, Search } from "lucide-react";

const API_BASE =
  (import.meta.env.VITE_API_URL?.replace(/\/$/, "")) || "http://localhost:5000/api";

/* ---------------- helpers ---------------- */
function normalizePayments(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (payload && typeof payload === "object") return [payload];
  return [];
}

const StatusBadge = ({ value }) => {
  const v = String(value || "").toLowerCase();
  const map = {
    pending: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
    paid: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200",
    failed: "bg-rose-100 text-rose-800 ring-1 ring-rose-200",
    default: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
  };
  const cls = map[v] || map.default;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {v || "unknown"}
    </span>
  );
};

function Card({ children, className = "" }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function GradientBtn({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-500 ${className}`}
    >
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-600">{label}</div>
      {children}
    </label>
  );
}

function KV({ label, value, mono = false }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</div>
      <div className={`mt-1 ${mono ? "font-mono text-sm" : "text-gray-900"}`}>{value || "—"}</div>
    </div>
  );
}

/* ---------------- component ---------------- */
export default function AdminList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const [selected, setSelected] = useState(null); // row click opens this
  const [editMode, setEditMode] = useState(false);

  // UI controls
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  // fetch
  useEffect(() => {
    (async () => {
      setLoading(true);
      setErrMsg("");
      try {
        const res = await fetch(`${API_BASE}/payments`);
        const text = await res.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch {
          json = text;
        }
        if (!res.ok) throw new Error(typeof json === "string" ? json : JSON.stringify(json));
        setPayments(normalizePayments(json));
      } catch (e) {
        console.error("❌ Fetch failed:", e);
        setErrMsg(String(e?.message || e));
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshKey]);

  // delete
  const deletePayment = async (id) => {
    if (!window.confirm("Delete this payment?")) return;
    await fetch(`${API_BASE}/payments/${id}`, { method: "DELETE" });
    setPayments((prev) => prev.filter((p) => p._id !== id));
    setSelected(null);
  };

  // update
  const savePayment = async () => {
    if (!selected) return;
    await fetch(`${API_BASE}/payments/${selected._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected),
    });
    setPayments((prev) => prev.map((p) => (p._id === selected._id ? selected : p)));
    setEditMode(false);
  };

  // filter/search
  const filtered = useMemo(() => {
    let list = Array.isArray(payments) ? payments : normalizePayments(payments);
    if (status !== "all") list = list.filter((p) => String(p.status).toLowerCase() === status);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) =>
        [p.name, p.email, p.currency, p.status, p.amount?.toString()]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      );
    }
    return list;
  }, [payments, status, query]);

  /* ------------ layout wrapper (centered) ------------- */
  return (
    <div className="min-h-screen bg-gray-50/40">
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        {/* Header (centered title + single refresh button on the right) */}
        <div className="relative mb-2">
          <h1 className="text-center text-2xl font-bold tracking-tight text-gray-900">
            Payment Management
          </h1>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-500"
            title="Refresh"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* error */}
        {errMsg && (
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
            <div className="font-semibold">Couldn’t load payments</div>
            <div className="text-sm mt-1">{errMsg}</div>
            <GradientBtn className="mt-4" onClick={() => setRefreshKey((k) => k + 1)}>
              <RefreshCw size={16} /> Try again
            </GradientBtn>
          </div>
        )}

        {/* toolbar (centered), no extra header buttons */}
        {!selected && !errMsg && (
          <div className="mx-auto mt-6 flex w-full max-w-5xl flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email, amount, status…"
                className="w-full rounded-xl border border-gray-300 pl-10 pr-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        )}

        {/* loading / list / detail */}
        {!selected ? (
          <ListTable
            loading={loading}
            filtered={filtered}
            onRow={(p) => {
              setSelected(p);
              setEditMode(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onEdit={(p, e) => {
              e.stopPropagation();
              setSelected(p);
              setEditMode(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onDelete={(p, e) => {
              e.stopPropagation();
              deletePayment(p._id);
            }}
          />
        ) : (
          <DetailCard
            selected={selected}
            setSelected={setSelected}
            editMode={editMode}
            setEditMode={setEditMode}
            savePayment={savePayment}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------- sub-components ---------------- */
function ListTable({ loading, filtered, onRow, onEdit, onDelete }) {
  // Loading table
  if (loading) {
    return (
      <Card className="mx-auto mt-6 w-full max-w-5xl">
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full table-fixed text-sm">
            <colgroup>
              <col className="w-[32%]" />
              <col className="w-[28%]" />
              <col className="w-[16%]" />
              <col className="w-[12%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="text-left text-gray-700 bg-gradient-to-r from-amber-50 to-white">
                <th className="p-3 font-semibold">Customer</th>
                <th className="p-3 font-semibold">ID</th>
                <th className="p-3 font-semibold">Amount</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(4)].map((_, r) => (
                <tr key={r} className="border-b">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <td key={i} className="p-3 align-middle">
                      <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }

  // Real table
  return (
    <Card className="mx-auto mt-6 w-full max-w-5xl">
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full table-fixed text-sm">
          {/* lock widths so header & body always align */}
          <colgroup>
            <col className="w-[32%]" />   {/* Customer */}
            <col className="w-[28%]" />   {/* ID */}
            <col className="w-[16%]" />   {/* Amount */}
            <col className="w-[12%]" />   {/* Status */}
            <col className="w-[12%]" />   {/* Action */}
          </colgroup>

          <thead className="sticky top-0 z-10 bg-white">
            <tr className="text-left text-gray-700 bg-gradient-to-r from-amber-50 to-white">
              <th className="p-3 font-semibold">Customer</th>
              <th className="p-3 font-semibold">ID</th>
              <th className="p-3 font-semibold">Amount</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No payments found.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p._id}
                  className="border-b last:border-b-0 hover:bg-amber-50/40 cursor-pointer"
                  onClick={() => onRow(p)}
                >
                  {/* Customer */}
                  <td className="p-3 align-middle">
                    <div className="font-medium text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.email}</div>
                  </td>

                  {/* ID */}
                  <td className="p-3 align-middle font-mono text-xs break-all">{p._id}</td>

                  {/* Amount */}
                  <td className="p-3 align-middle font-semibold">
                    {Number(p.amount)?.toLocaleString()}{" "}
                    <span className="text-gray-500">{p.currency}</span>
                  </td>

                  {/* Status */}
                  <td className="p-3 align-middle">
                    <StatusBadge value={p.status} />
                  </td>

                  {/* Action */}
                  <td className="p-3 align-middle">
                    <div className="flex items-center justify-start gap-2">
                      <button
                        onClick={(e) => onEdit(p, e)}
                        className="rounded-lg border border-gray-200 bg-white p-2 hover:border-amber-300 hover:bg-amber-50"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={(e) => onDelete(p, e)}
                        className="rounded-lg border border-rose-200 bg-white p-2 text-rose-600 hover:bg-rose-50"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function DetailCard({ selected, setSelected, editMode, setEditMode, savePayment }) {
  return (
    <div className="mx-auto mt-6 w-full max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
          onClick={() => setSelected(null)}
        >
          <ArrowLeft size={18} /> Back to list
        </button>

        {!editMode ? (
          <GradientBtn onClick={() => setEditMode(true)}>
            <Edit size={16} /> Edit
          </GradientBtn>
        ) : (
          <GradientBtn onClick={savePayment}>
            <Save size={16} /> Save changes
          </GradientBtn>
        )}
      </div>

      <Card>
        {editMode ? (
          <div className="grid grid-cols-1 gap-4 p-5">
            <Field label="Name">
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                value={selected.name || ""}
                onChange={(e) => setSelected((prev) => ({ ...prev, name: e.target.value }))}
              />
            </Field>
            <Field label="Email">
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                value={selected.email || ""}
                onChange={(e) => setSelected((prev) => ({ ...prev, email: e.target.value }))}
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Amount">
                <input
                  type="number"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  value={selected.amount ?? 0}
                  onChange={(e) =>
                    setSelected((prev) => ({ ...prev, amount: Number(e.target.value || 0) }))
                  }
                />
              </Field>
              <Field label="Currency">
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  value={selected.currency || "LKR"}
                  onChange={(e) => setSelected((prev) => ({ ...prev, currency: e.target.value }))}
                />
              </Field>
              <Field label="Status">
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  value={selected.status || "pending"}
                  onChange={(e) => setSelected((prev) => ({ ...prev, status: e.target.value }))}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Phone">
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  value={selected.phone || ""}
                  onChange={(e) => setSelected((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </Field>
              <Field label="Payment ID">
                <div className="rounded-lg border bg-gray-50 px-3 py-2 text-sm font-mono text-gray-700">
                  {selected._id}
                </div>
              </Field>
              <Field label="User ID">
                <div className="rounded-lg border bg-gray-50 px-3 py-2 text-sm font-mono text-gray-700">
                  {selected.userId || "—"}
                </div>
              </Field>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-5">
            <KV label="Name" value={selected.name} />
            <KV label="Email" value={selected.email} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <KV
                label="Amount"
                value={`${Number(selected.amount)?.toLocaleString()} ${selected.currency}`}
              />
              <KV label="Status" value={<StatusBadge value={selected.status} />} />
              <KV label="Phone" value={selected.phone || "—"} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <KV label="Payment ID" value={selected._id} mono />
              <KV label="User ID" value={selected.userId || "—"} mono />
            </div>
            {selected.address && <KV label="Address" value={selected.address} />}
          </div>
        )}
      </Card>
    </div>
  );
}

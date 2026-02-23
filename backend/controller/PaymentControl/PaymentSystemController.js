const Payment = require("./../../model/PaymentModel/PaymentModel");

// helpers
const buildPagination = (req) => {
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || "10", 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// GET /api/payments
exports.listPayments = async (req, res, next) => {
  try {
    const { status, method, q, from, to, email } = req.query;
    const { page, limit, skip } = buildPagination(req);

    const filter = {};
    if (status) filter.status = status;
    if (method) filter.method = method;
    if (email) filter.email = email;

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    if (q) {
      filter.$or = [
        { email: new RegExp(q, "i") },
        { orderId: new RegExp(q, "i") },
        { "meta.txId": new RegExp(q, "i") },
        { name: new RegExp(q, "i") },
      ];
    }

    const [data, total] = await Promise.all([
      Payment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Payment.countDocuments(filter),
    ]);

    res.json({ data, page, pageSize: limit, total });
  } catch (err) {
    next(err);
  }
};

// GET /api/payments/:id
exports.getPayment = async (req, res, next) => {
  try {
    const doc = await Payment.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Payment not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

// POST /api/payments
exports.createPayment = async (req, res, next) => {
  try {
    const body = req.body || {};
    if (!body.name || !body.email || body.amount == null) {
      return res.status(400).json({ message: "name, email, amount are required" });
    }

    const created = await Payment.create({
      ...body,
      status: body.status || "pending",
      history: [{ from: "none", to: body.status || "pending", note: "Created" }],
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

// PUT /api/payments/:id (update status/notes/method/meta)
exports.updatePayment = async (req, res, next) => {
  try {
    const doc = await Payment.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Payment not found" });

    const before = doc.status;

    // only allow safe fields
    const { status, method, meta } = req.body || {};
    if (status) doc.status = status;
    if (method) doc.method = method;
    if (meta) {
      doc.meta = { ...(doc.meta || {}), ...meta };
    }

    if (status && status !== before) {
      doc.history.push({ from: before, to: status, by: "admin" });
    }
    await doc.save();
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/payments/:id
exports.deletePayment = async (req, res, next) => {
  try {
    const doc = await Payment.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Payment not found" });
    await doc.deleteOne();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// GET /api/payments/:id/receipt
exports.getReceipt = async (req, res, next) => {
  try {
    const doc = await Payment.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Payment not found" });

    const payload = {
      receiptNo: String(doc._id),
      orderId: doc.orderId || null,
      customer: { name: doc.name, email: doc.email },
      amount: { total: doc.amount, currency: doc.currency },
      method: doc.method,
      status: doc.status,
      txId: doc.meta?.txId || null,
      items: doc.items || [],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
    res.json(payload);
  } catch (err) {
    next(err);
  }
};

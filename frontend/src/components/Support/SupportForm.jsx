// src/components/Support/SupportForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function SupportForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    ticketID: "",
    subject: "",
    message: "",
    status: "open",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (id) fetchSupport(id);
  }, [id]);

  const fetchSupport = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/supports/${id}`);
      setFormData(res.data.support);
    } catch (err) {
      console.error("Error fetching support ticket:", err);
      alert("Failed to load ticket.");
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Restrict input based on field
    if (name === "name") {
      value = value.replace(/[^a-zA-Z\s]/g, ""); // only letters and spaces
    }

    if (name === "ticketID") {
      value = value.replace(/[^0-9]/g, ""); // only numbers
    }

    setFormData({ ...formData, [name]: value });

    // validate field if touched
    if (touched[name]) validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";

    if (name === "subject" && value.length < 10) {
      error = "Subject must be at least 10 characters.";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};

    if (formData.subject.length < 10) {
      newErrors.subject = "Subject must be at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // mark all fields as touched
    setTouched({
      name: true,
      ticketID: true,
      subject: true,
      message: true,
    });

    if (!validateAll()) return;

    try {
      if (id) {
        await axios.put(`http://localhost:5000/supports/${id}`, formData);
        alert("Ticket updated successfully!");
      } else {
        await axios.post(`http://localhost:5000/supports`, formData);
        alert("Ticket submitted successfully!");
      }
      navigate("/"); // Redirect to Dashboard after submit
    } catch (err) {
      console.error("Error saving ticket:", err);
      alert("Failed to save ticket.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {id ? "Edit Support Ticket" : "Submit a New Ticket"}
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Your Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Ticket ID */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Ticket ID:</label>
            <input
              type="text"
              name="ticketID"
              value={formData.ticketID}
              onChange={handleChange}
              onBlur={handleBlur}
              className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Subject */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Subject:</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            {touched.subject && errors.subject && (
              <span className="text-red-500 text-sm mt-1">{errors.subject}</span>
            )}
          </div>

          {/* Message */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Message:</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 h-32 resize-none"
            />
          </div>

          {/* Status */}
          {id && (
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="mt-6 px-6 py-3 bg-rose-500 text-white rounded-2xl hover:bg-rose-600 transition-colors font-semibold text-lg"
          >
            {id ? "Update Ticket" : "Submit Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SupportForm;

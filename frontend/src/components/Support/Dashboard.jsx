// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Home,
  Trash2,
  Edit,
  Search,
  MessageCircle,
} from "lucide-react";
import axios from "axios";
import jsPDF from "jspdf";

function Dashboard() {
  const navItems = [
    { name: "Home", path: "/add", icon: <Home size={18} /> },
    { name: "Dashboard", path: "/list", icon: <LayoutDashboard size={18} /> },
    { name: "Profile", path: "/profile", icon: <User size={18} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
  ];

  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/supports");
      setTickets(res.data.supports || []);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      alert("Failed to load tickets.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/supports/${id}`);
      setTickets(tickets.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Failed to delete ticket:", err);
      alert("Failed to delete ticket.");
    }
  };

  const handleOpenTicket = (ticket) => setSelectedTicket(ticket);
  const handleCloseModal = () => setSelectedTicket(null);

  const handleDownloadPDF = (ticket) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Ticket Details", 20, 20);
    doc.setFontSize(12);
    doc.text(`Ticket ID: ${ticket.ticketID || ticket._id}`, 20, 40);
    doc.text(`Name: ${ticket.name}`, 20, 50);
    doc.text(`Subject: ${ticket.subject}`, 20, 60);
    doc.text(`Status: ${ticket.status}`, 20, 70);
    doc.text(`Created On: ${ticket.created || "N/A"}`, 20, 80);
    doc.text(`Message: ${ticket.message}`, 20, 90);
    doc.save(`Ticket_${ticket.ticketID || ticket._id}.pdf`);
  };

  const handleStatusChange = async (ticketId, currentStatus) => {
    const nextStatus =
      currentStatus === "Open"
        ? "Closed"
        : currentStatus === "Closed"
        ? "Pending"
        : "Open";
    try {
      await axios.put(`http://localhost:5000/supports/${ticketId}`, { status: nextStatus });
      setTickets(
        tickets.map((t) => (t._id === ticketId ? { ...t, status: nextStatus } : t))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status.");
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const idMatch = (t.ticketID || t._id)?.toString().includes(searchTerm);
    const subjectMatch = t.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    return idMatch || subjectMatch;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-rose-500 to-amber-500 shadow-xl p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
            <MessageCircle size={20} /> Support Panel
          </h3>
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="flex items-center gap-3 text-white hover:opacity-90 transition-all duration-300 p-2 rounded-lg bg-white/10 hover:bg-white/20 hover:scale-105 hover:rotate-1"
                >
                  {item.icon} {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 border-t border-white/30 pt-6">
          <Link
            to="/logout"
            className="flex items-center gap-3 text-white hover:bg-white/20 transition-all duration-300 p-2 rounded-lg hover:scale-105"
          >
            <LogOut size={18} /> Log Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6">
        {/* Stats Cards */}
        <div className="flex justify-center mt-4 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-6xl">
            {["Open Tickets", "Closed Tickets", "Pending"].map((label, idx) => {
              const count =
                label === "Open Tickets"
                  ? tickets.filter((t) => t.status === "Open").length
                  : label === "Closed Tickets"
                  ? tickets.filter((t) => t.status === "Closed").length
                  : tickets.filter((t) => t.status === "Pending").length;

              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 hover:scale-105 flex flex-col justify-center items-center bg-gradient-to-b from-rose-500 to-amber-500 text-white"
                >
                  <h3 className="text-center font-semibold text-lg">{label}</h3>
                  <p className="text-3xl font-bold mt-2">{count}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search */}
        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-6xl flex items-center bg-white rounded-full shadow-md px-4 py-2">
            <Search className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by Ticket ID or Subject..."
              className="w-full outline-none px-2 py-1 rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tickets Table */}
        <div className="mt-6 flex justify-center">
          <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created On
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket._id || ticket.id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => handleOpenTicket(ticket)}
                  >
                    <td className="px-6 py-4 text-gray-800">{ticket.ticketID || ticket._id}</td>
                    <td className="px-6 py-4 text-gray-800">{ticket.name}</td>
                    <td className="px-6 py-4 text-gray-800">{ticket.subject}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ticket.status === "Open"
                            ? "bg-rose-100 text-rose-600"
                            : ticket.status === "Closed"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {ticket.status}
                      </span>
                      <Edit
                        size={16}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(ticket._id, ticket.status);
                        }}
                        title="Change Status"
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-800">{ticket.created || "N/A"}</td>
                    <td className="px-6 py-4 text-center flex justify-center gap-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(ticket._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-sm z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 relative scale-105 animate-fadeIn">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                onClick={handleCloseModal}
              >
                X
              </button>
              <h2 className="text-3xl font-bold mb-6">Ticket Details</h2>
              <p><strong>ID:</strong> {selectedTicket.ticketID || selectedTicket._id}</p>
              <p><strong>Name:</strong> {selectedTicket.name}</p>
              <p><strong>Subject:</strong> {selectedTicket.subject}</p>
              <p><strong>Status:</strong> {selectedTicket.status}</p>
              <p><strong>Created:</strong> {selectedTicket.created || "N/A"}</p>
              <p className="mt-3"><strong>Message:</strong> {selectedTicket.message}</p>
              <button
                className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                onClick={() => handleDownloadPDF(selectedTicket)}
              >
                Download PDF
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 mt-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[200px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

import React from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Package,
  BarChart2,
  TrendingUp,
  DollarSign,
  Bell,
  LayoutDashboard,
  Grid,
  ShoppingBag,
  Store,
  Settings,
  LogOut,
  ShoppingCart,
  AlertTriangle,
  Inbox,
} from "lucide-react";

import Image01 from "../../assets/chili.jpg";
import Image02 from "../../assets/cinnomon.jpg";
import Image03 from "../../assets/peper.jpg";
import Image04 from "../../assets/ginger.jpg";

const barData = [
  { name: "A", val1: 2, val2: 3 },
  { name: "B", val1: 4, val2: 6 },
  { name: "C", val1: 5, val2: 7 },
  { name: "D", val1: 3, val2: 9 },
  { name: "E", val1: 4, val2: 6 },
  { name: "F", val1: 6, val2: 5 },
];

const pieData = [
  { name: "First", value: 40 },
  { name: "Second", value: 30 },
  { name: "Third", value: 15 },
  { name: "Fourth", value: 15 },
  { name: "Five", value: 25 },
  { name: "Six", value: 10 },
];

const COLORS = ["#FF6B35", "#FFB830", "#D1495B", "#F77F00", "#6A0572", "#4B2E2E"];

const topCards = [
  { icon: Package, label: "All List Product", value: "150", bg: "#f5a385" },
  { icon: BarChart2, label: "Daily Sales", value: "5", bg: "#f5a385" },
  { icon: TrendingUp, label: "Monthly Sales", value: "110", bg: "#f5a385" },
  { icon: DollarSign, label: "Payment", value: "LKR 56,000", bg: "#f5a385" },
  { icon: Bell, label: "Notifications", value: "20", bg: "#f5a385" },
];

const stockOverview = [
  { label: "Item Categories", value: "06", color: "bg-red-100 text-red-700", icon: Package },
  { label: "Total Orders", value: "120", color: "bg-yellow-100 text-yellow-700", icon: ShoppingCart },
  { label: "Pending Orders", value: "12", color: "bg-orange-100 text-orange-700", icon: Inbox },
  { label: "Shipped Orders", value: "95", color: "bg-green-100 text-green-700", icon: TrendingUp },
  { label: "Refund Items", value: "03", color: "bg-pink-100 text-pink-700", icon: AlertTriangle },
  { label: "Low Stock Items", value: "08", color: "bg-purple-100 text-purple-700", icon: Package },
  { label: "Out of Stock", value: "02", color: "bg-gray-200 text-gray-700", icon: Store },
  { label: "Messages", value: "04", color: "bg-teal-100 text-teal-700", icon: Bell },
  { label: "Total Revenue", value: "LKR 1,250,000", color: "bg-green-200 text-green-800 col-span-2", icon: DollarSign },
];

const topProducts = [
  { name: "Chili Powder", img: Image01, sales: 250, color: "bg-red-500" },
  { name: "Cinnamon Powder", img: Image02, sales: 180, color: "bg-yellow-500" },
  { name: "Pepper Powder", img: Image03, sales: 150, color: "bg-gray-700" },
  { name: "Ginger", img: Image04, sales: 120, color: "bg-green-300" },
];

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#FFF7ED]">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#f5a385] to-[#f5a385] shadow-lg flex flex-col text-white">
        <div className="p-6 text-3xl font-bold border-b border-[#FF6B35]">Spice Admin</div>
        <nav className="flex-1 p-4 space-y-2">
  {[
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
     { icon: ShoppingBag, label: "Add Products", path: "/listdata" },
    { icon: Grid, label: "Categories", path: "/categories" },
    { icon: Store, label: "Add Seller", path: "/add-seller" },
    { icon: Store, label: "Purchase Items", path: "/purchase-items" },
    { icon: DollarSign, label: "Finance", path: "/finance" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ].map(({ icon: Icon, label, path }) => (
    <Link
      key={label}
      to={path}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FF6B35] transition"
    >
      <Icon className="w-5 h-5" /> {label}
    </Link>
  ))}
</nav>
        <div className="p-4 border-t border-[#d1495b]">
          <div className="w-full text-xl font-bold flex items-center  gap-3 px-4 py-2 rounded-lg bg-gray-300/60 hover:bg-red-400 text-white">
            <LogOut className="w-8 h-8 ml-8 "/> Log Out
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-[#4B2E2E]">Dashboard</h1>

        {/* Top Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {topCards.map(({ icon: Icon, label, value, bg }) => (
            <div
              key={label}
              className="p-4 rounded-xl shadow-md flex items-center gap-4 hover:shadow-lg transition"
              style={{ backgroundColor: bg, color: "white" }}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xl font-bold">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow-md p-4 rounded-lg flex justify-center">
            <BarChart width={600} height={250} data={barData} barCategoryGap={20}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <defs>
                <linearGradient id="colorVal1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6B35" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#FFB830" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorVal2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D1495B" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#F77F00" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <Bar dataKey="val1" fill="url(#colorVal1)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="val2" fill="url(#colorVal2)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg flex justify-center">
            <PieChart width={450} height={250}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </div>
        </div>

        {/* Bottom Panels */}
        <div className="grid grid-cols-2 gap-6">
          {/* Stock Overview */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="font-bold text-lg mb-6 text-gray-700">Stock Overview</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {stockOverview.map(({ label, value, color, icon: Icon }) => (
                <div key={label} className={`flex items-center gap-3 p-4 rounded-lg shadow-sm ${color}`}>
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/30">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide">{label}</p>
                    <p className="text-xl font-bold">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="font-bold text-lg mb-6 text-gray-700">Top Selling Products</h2>
            <div className="space-y-5">
              {topProducts.map(({ name, img, sales, color }, index) => (
                <div key={name} className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FFB830] text-white font-bold">
                    {index + 1}
                  </div>
                  <img src={img} alt={name} className="w-12 h-12 rounded object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{name}</p>
                    <p className="text-xs text-gray-500">{sales} packs sold</p>
                    <div className="w-full bg-gray-200 h-2 rounded mt-2">
                      <div
                        className={`h-2 rounded ${color}`}
                        style={{ width: `${(sales / 250) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

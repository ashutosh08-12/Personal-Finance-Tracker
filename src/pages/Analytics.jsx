import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../api/axios";

// Charts
import {
  PieChart,
  Pie,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  Legend,
} from "recharts";

export default function Analytics() {
  const [summary, setSummary] = useState({ income: 0, expense: 0 });
  const [monthly, setMonthly] = useState([]);
  const [yearly, setYearly] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    api.get("/analytics/summary").then((res) => setSummary(res.data));
    api.get("/analytics/monthly").then((res) => setMonthly(res.data));
    api.get("/analytics/yearly").then((res) => setYearly(res.data));
    api.get("/analytics/category").then((res) => {
        console.log("CATEGORY API RESPONSE:", res.data);
        setCategory(res.data)});
  }, []);

  const summaryChart = [
    { name: "Income", value: Number(summary.income) },
    { name: "Expense", value: Number(summary.expense) },
  ];

  const colors = ["#4CAF50", "#F44336", "#2196F3", "#FFC107", "#9C27B0"];

  const categoryData = category.map(item => ({
  category: item.category,
  total: Number(item.total)   // ← convert string → number
}));

  return (
    <>
      <Navbar />

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Full Analytics</h1>

        {/* SUMMARY PIE CHART */}
        <div className="bg-white p-6 shadow rounded mb-10">
          <h2 className="text-xl font-semibold mb-3">Income vs Expense</h2>

          <PieChart width={400} height={300}>
            <Pie
              data={summaryChart}
              dataKey="value"
              outerRadius={120}
              label
            >
              {summaryChart.map((_, index) => (
                <Cell
                  key={index}
                  fill={index === 0 ? "#4CAF50" : "#F44336"}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* MONTHLY LINE CHART */}
        <div className="bg-white p-6 shadow rounded mb-10">
          <h2 className="text-xl font-semibold mb-3">Monthly Trends</h2>

          <LineChart width={600} height={350} data={monthly}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line type="monotone" dataKey="income" stroke="#4CAF50" />
            <Line type="monotone" dataKey="expense" stroke="#F44336" />
          </LineChart>
        </div>

        {/* YEARLY BAR CHART */}
        <div className="bg-white p-6 shadow rounded mb-10">
          <h2 className="text-xl font-semibold mb-3">Yearly Analytics</h2>

          <BarChart width={600} height={350} data={yearly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Bar dataKey="income" fill="#4CAF50" />
            <Bar dataKey="expense" fill="#F44336" />
          </BarChart>
        </div>

        {/* CATEGORY DONUT CHART */}
<div className="bg-white p-6 shadow rounded mb-10">
  <h2 className="text-xl font-semibold mb-3">Category Breakdown</h2>

  {category.length > 0 && (
    <PieChart width={450} height={350}>

      <Pie
        data={categoryData}
        dataKey="total"
        nameKey="category"
        innerRadius={50}
        outerRadius={120}
        label
      >
        {categoryData.map((_, i) => (
          <Cell key={i} fill={colors[i % colors.length]} />
        ))}
      </Pie>

      <Tooltip />

    </PieChart>
  )}
</div>

      </div>
    </>
  );
}

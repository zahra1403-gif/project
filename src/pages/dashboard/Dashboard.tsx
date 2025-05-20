import {
  BarChart3,
  Clipboard,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Link } from "react-router-dom";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const stats = {
  totalSales: 10000,
  todaySales: 1200,
  todayPurchases: 800,
  stockValue: 5000,
  stockCount: 300,
};

const inventoryChartData = {
  labels: ["In Stock", "Out of Stock"],
  datasets: [
    {
      data: [80, 20],
      backgroundColor: ["#10B981", "#EF4444"],
      borderWidth: 0,
    },
  ],
};

const salesChartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Sales",
      data: [1200, 1900, 3000, 2500, 2200, 2800, 3500],
      borderColor: "#3B82F6",
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      tension: 0.4,
    },
  ],
};

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Sales */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                <dd className="text-2xl font-semibold text-gray-900">${stats?.totalSales.toFixed(2)}</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Stock Value */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <Clipboard className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Stock Value</dt>
                <dd className="text-2xl font-semibold text-gray-900">${stats?.stockValue.toFixed(2)}</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Today's Sales */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-emerald-100 rounded-md p-3">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Today's Sales</dt>
                <dd className="flex items-center">
                  <div className="text-2xl font-semibold text-gray-900">${stats?.todaySales.toFixed(2)}</div>
                  <span className="ml-2 flex items-center text-sm font-medium text-emerald-600">
                    <TrendingUp className="w-4 h-4 mr-1" /> 10%
                  </span>
                </dd>
              </dl>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Link to="/sales" className="font-medium text-secondary-600 hover:text-secondary-500">
              View sales
            </Link>
          </div>
        </div>

        {/* Today's Purchases */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Today's Purchases</dt>
                <dd className="flex items-center">
                  <div className="text-2xl font-semibold text-gray-900">${stats?.todayPurchases.toFixed(2)}</div>
                  <span className="ml-2 flex items-center text-sm font-medium text-blue-600">
                    <TrendingDown className="w-4 h-4 mr-1" /> 5%
                  </span>
                </dd>
              </dl>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <Link to="/purchases" className="font-medium text-blue-600 hover:text-blue-500">
              View purchases
            </Link>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Inventory Chart */}
        <div className="bg-white p-5 shadow rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Inventory Status</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <Doughnut data={inventoryChartData} />
        </div>

        {/* Sales Chart */}
        <div className="bg-white p-5 shadow rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Sales This Week</h2>
            <Clipboard className="h-5 w-5 text-gray-400" />
          </div>
          <Line data={salesChartData} options={lineChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

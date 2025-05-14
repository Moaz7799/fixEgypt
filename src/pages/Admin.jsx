import "leaflet/dist/leaflet.css";
import { useMemo, useState } from "react";
import DataTable from "react-data-table-component";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28FD0",
  "#E27D60",
  "#85DCB",
  "#E8A87C",
  "#C38D9E",
  "#41B3A3",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border">
        <p className="font-bold text-gray-700">
          {label.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </p>
        <p className="text-blue-600">{payload[0].value} Reports</p>
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const total =
      payload[0].payload.total ||
      payload.reduce((sum, entry) => sum + entry.value, 0);
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border">
        <p className="font-bold text-gray-700 capitalize">
          {payload[0].name.replace(/_/g, " ")}
        </p>
        <p className="text-blue-600">{payload[0].value} Reports</p>
        <p className="text-sm text-gray-500">
          ({((payload[0].value / total) * 100).toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
};

const RADIAN = Math.PI / 180;
const CustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.35;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#475569"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-semibold"
    >
      {`${(percent * 100).toFixed(0)}% ${name.replace(/_/g, " ")}`}
    </text>
  );
};

export default function Admin({ realUsers, realReports }) {
  // Dummy Users
  const users = [
    {
      nationalId: "28504199501234",
      firstName: "Ahmed",
      lastName: "Saleh",
      email: "ahmed.saleh@example.com",
      password: "password123",
      phone: "+201112223334",
      address: "12 Tahrir St.",
      city: "Cairo",
      governorate: "Cairo",
    },
    {
      nationalId: "29708200104567",
      firstName: "Mona",
      lastName: "Hassan",
      email: "mona.hassan@example.com",
      password: "qwerty456",
      phone: "+201223334445",
      address: "45 Nile Corniche",
      city: "Giza",
      governorate: "Giza",
    },
    {
      nationalId: "30003199006543",
      firstName: "Youssef",
      lastName: "Mahmoud",
      email: "youssef.mahmoud@example.com",
      password: "letmein789",
      phone: "+201334445556",
      address: "78 El-Orouba",
      city: "Alexandria",
      governorate: "Alexandria",
    },
    {
      nationalId: "29006198702321",
      firstName: "Fatma",
      lastName: "Ibrahim",
      email: "fatma.ibrahim@example.com",
      password: "welcome321",
      phone: "+201445556667",
      address: "22 Corniche El Nile",
      city: "Luxor",
      governorate: "Luxor",
    },
    {
      nationalId: "29801199305432",
      firstName: "Khaled",
      lastName: "Mostafa",
      email: "khaled.mostafa@example.com",
      password: "adminpass",
      phone: "+201556667778",
      address: "5 Ramses Square",
      city: "Aswan",
      governorate: "Aswan",
    },
    {
      nationalId: "30507199201234",
      firstName: "Sara",
      lastName: "Fathy",
      email: "sara.fathy@example.com",
      password: "passw0rd",
      phone: "+201667778889",
      address: "99 El-Geish Rd.",
      city: "Mansoura",
      governorate: "Dakahlia",
    },
    {
      nationalId: "28810199507890",
      firstName: "Omar",
      lastName: "Abdelaziz",
      email: "omar.abdelaziz@example.com",
      password: "secret999",
      phone: "+201778889900",
      address: "10 Port Said St.",
      city: "Suez",
      governorate: "Suez",
    },
    {
      nationalId: "29209199003456",
      firstName: "Nour",
      lastName: "Rashad",
      email: "nour.rashad@example.com",
      password: "mypassword",
      phone: "+201889900112",
      address: "17 El-Horreya Rd.",
      city: "Ismailia",
      governorate: "Ismailia",
    },
    {
      nationalId: "29912198802345",
      firstName: "Mahmoud",
      lastName: "Tarek",
      email: "mahmoud.tarek@example.com",
      password: "hello2025",
      phone: "+201990011223",
      address: "65 26th of July St.",
      city: "Port Said",
      governorate: "Port Said",
    },
    {
      nationalId: "30105199405678",
      firstName: "Dalia",
      lastName: "Youssef",
      email: "dalia.youssef@example.com",
      password: "secure456",
      phone: "+202011122334",
      address: "88 El-Salam Rd.",
      city: "Fayoum",
      governorate: "Faiyum",
    },
  ];

  // Dummy Reports
  const reports = [
    {
      id: 1,
      title: "Pothole on Main St.",
      description: "Large pothole causing traffic issues near the market.",
      category: "road_damage",
      location: { lat: 30.06263, lng: 31.24967 },
      image: "https://via.placeholder.com/200x150?text=Road+Damage",
      status: "pending",
    },
    {
      id: 2,
      title: "Burst Water Pipe",
      description: "Water leak flooding the sidewalk.",
      category: "water_issue",
      location: { lat: 30.0444, lng: 31.2357 },
      image: "https://via.placeholder.com/200x150?text=Water+Issue",
      status: "in_progress",
    },
    {
      id: 3,
      title: "Street Light Out",
      description: "No lighting around the park entrance at night.",
      category: "street_lighting",
      location: { lat: 30.05, lng: 31.2333 },
      image: "https://via.placeholder.com/200x150?text=Street+Lighting",
      status: "resolved",
    },
    {
      id: 4,
      title: "Overflowing Garbage Bin",
      description: "Bin hasn’t been emptied in two weeks.",
      category: "waste_management",
      location: { lat: 30.0561, lng: 31.2234 },
      image: "https://via.placeholder.com/200x150?text=Waste+Management",
      status: "pending",
    },
    {
      id: 5,
      title: "Broken Bus Stop Bench",
      description: "Bench slats are broken and unsafe.",
      category: "public_transportation",
      location: { lat: 30.0366, lng: 31.2243 },
      image: "https://via.placeholder.com/200x150?text=Public+Transport",
      status: "in_progress",
    },
    {
      id: 6,
      title: "Graffiti on Wall",
      description: "Vandalism on the side of the government building.",
      category: "public_property_damage",
      location: { lat: 30.0459, lng: 31.2389 },
      image: "https://via.placeholder.com/200x150?text=Property+Damage",
      status: "resolved",
    },
    {
      id: 7,
      title: "Sewage Smell",
      description: "Foul odor coming from drain near café.",
      category: "sewage_problem",
      location: { lat: 30.0483, lng: 31.243 },
      image: "https://via.placeholder.com/200x150?text=Sewage+Problem",
      status: "pending",
    },
    {
      id: 8,
      title: "Power Outage",
      description: "No electricity in block 12 since morning.",
      category: "electricity_issue",
      location: { lat: 30.04, lng: 31.235 },
      image: "https://via.placeholder.com/200x150?text=Electricity+Issue",
      status: "in_progress",
    },
    {
      id: 9,
      title: "Tree Fallen",
      description: "Fallen tree blocking sidewalk after storm.",
      category: "environmental_issue",
      location: { lat: 30.0522, lng: 31.2268 },
      image: "https://via.placeholder.com/200x150?text=Environmental+Issue",
      status: "resolved",
    },
    {
      id: 10,
      title: "Other: Miscellaneous Concern",
      description: "Unspecified hazard near the community center.",
      category: "other",
      location: { lat: 30.0478, lng: 31.2315 },
      image: "https://via.placeholder.com/200x150?text=Other+Issue",
      status: "pending",
    },
  ];

  const [userList, setUserList] = useState(users || []);
  const [reportList, setReportList] = useState(reports || []);
  const [statusFilter, setStatusFilter] = useState(null);

  const handleStatusChange = (rowId, newStatus) => {
    setReportList((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, status: newStatus } : r))
    );
  };

  const handleVerify = (nationalId) => {
    setUserList((prev) =>
      prev.map((u) =>
        u.nationalId === nationalId ? { ...u, verified: true } : u
      )
    );
  };

  // Columns definition for react-data-table-component
  const columns = useMemo(
    () => [
      {
        name: "Title",
        selector: (row) => row.title,
        sortable: true,
      },
      {
        name: "Category",
        selector: (row) => row.category.replace("_", " "),
        sortable: true,
        cell: (row) => (
          <span className="capitalize">{row.category.replace("_", " ")}</span>
        ),
      },
      {
        name: "Status",
        selector: (row) => row.status,
        sortable: true,
        cell: (row) => (
          <select
            className="border px-2 py-1 rounded"
            value={row.status}
            onChange={(e) => handleStatusChange(row.id, e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        ),
      },
      {
        name: "Actions",
        cell: (row) => (
          <button
            onClick={() => console.log("View", row.id)}
            className="text-blue-500 hover:underline"
          >
            View
          </button>
        ),
      },
    ],
    []
  );

  // Define columns for users
  const userColumns = useMemo(
    () => [
      {
        name: "Name",
        selector: (row) => `${row.firstName} ${row.lastName}`,
        sortable: true,
        cell: (row) => (
          <span>
            {row.firstName} {row.lastName}
          </span>
        ),
      },
      {
        name: "Email",
        selector: (row) => row.email,
        sortable: true,
      },
      {
        name: "Verified",
        selector: (row) => row.verified,
        sortable: true,
        cell: (row) => (row.verified ? "✔️" : "❌"),
      },
      {
        name: "Actions",
        cell: (row) =>
          !row.verified ? (
            <button
              onClick={() => handleVerify(row.nationalId)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Verify
            </button>
          ) : null,
        ignoreRowClick: true,
        _allowOverflow: true,
        _button: true,
      },
    ],
    []
  );

  // Analytics: count by category and status
  const categoryCounts = reportList.reduce((acc, rpt) => {
    acc[rpt.category] = (acc[rpt.category] || 0) + 1;
    return acc;
  }, {});

  const statusCounts = reportList.reduce((acc, rpt) => {
    acc[rpt.status] = (acc[rpt.status] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryCounts).map(
    ([name, value], i) => ({ name, value })
  );
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans bg-gradient-to-br  from-[#6348ad] to-[#665b83] w-full">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-5xl font-bold mb-6">Admin Dashboard</h1>

        {/* Users Section */}
        <section className="bg-[#a4ebff] p-4 rounded-lg shadow ">
          <h2 className="text-3xl font-bold mb-4 text-black">Users</h2>
          <DataTable
            columns={userColumns}
            data={userList}
            pagination
            highlightOnHover
            responsive={true}
            customStyles={{
              headRow: { style: { backgroundColor: "#f9fafb" } },
              rows: { style: { backgroundColor: "#fff" } },
            }}
          />
        </section>

        {/* Reports Section */}
        <section className="bg-[#ddd1ff] p-4 rounded-lg shadow ">
          <h2 className="text-3xl font-bold mb-4 text-black">Reports</h2>
          <DataTable
            columns={columns}
            data={reportList}
            pagination
            highlightOnHover
            responsive={true}
            customStyles={{
              headRow: { style: { backgroundColor: "#f9fafb" } },
              rows: { style: { backgroundColor: "#fff" } },
            }}
          />
        </section>

        {/* Analytics & Trends */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-3xl font-bold mb-2">Reports by Category</h3>
            <div className="h-[300px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="40%" // Relative values work better for responsiveness
                    outerRadius="70%" // Percentage-based radius
                    paddingAngle={2}
                    labelLine={false}
                    label={({ percent, name }) =>
                      `${(percent * 100).toFixed(0)}%`
                    } // Simpler label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="#fff"
                        strokeWidth={2}
                        className="outline-none" // Remove focus outlines
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    layout="horizontal" // Better for mobile
                    verticalAlign="bottom"
                    align="center"
                    formatter={(value) => (
                      <span className="text-xs md:text-sm text-gray-600 capitalize">
                        {value.replace(/_/g, " ")}
                      </span>
                    )}
                    iconSize={10}
                    iconType="circle"
                    className="px-4" // Add horizontal padding
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow h-full flex flex-col">
            {" "}
            {/* Added flex classes */}
            <h3 className="text-3xl font-bold mb-4">Reports by Status</h3>
            <div className="flex-1">
              {" "}
              {/* This div will take remaining space */}
              <ResponsiveContainer width="100%" height="100%">
                {" "}
                {/* Full height of parent */}
                <BarChart
                  data={statusData}
                  margin={{ top: 50, right: 20, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={{ stroke: "#cbd5e1" }}
                    tickFormatter={(name) =>
                      name
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())
                    }
                    tick={{ fill: "#64748b" }}
                  />
                  <YAxis
                    axisLine={{ stroke: "#cbd5e1" }}
                    tickLine={false}
                    tick={{ fill: "#64748b" }}
                    width={40} // Fixed width for consistent spacing
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "#f1f5f9" }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                    <LabelList
                      dataKey="value"
                      position="top"
                      fill="#475569"
                      fontSize={12}
                      fontWeight={600}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Map view */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-3xl font-bold mb-4 text-black">Map View</h2>
          <div className="h-96 rounded overflow-hidden">
            <MapContainer
              center={[30.0444, 31.2357]}
              zoom={13}
              scrollWheelZoom
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {reportList.map((rpt) => (
                <Marker
                  key={rpt.id}
                  position={[rpt.location.lat, rpt.location.lng]}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>{rpt.title}</strong>
                      <p>{rpt.category.replace("_", " ")}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </section>
      </div>
    </div>
  );
}

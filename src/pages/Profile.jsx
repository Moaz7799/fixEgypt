import { LogOut } from "lucide-react";

// Sample data; replace with real fetch or context
const user = {
  name: "John Doe",
  email: "john.doe@example.com",
  points: 1250,
};

const reports = [
  {
    id: 1,
    title: "Broken Streetlight",
    description:
      "The streetlight on 5th avenue is flickering and needs repair.",
    category: "street_lighting",
    location: { lat: 30.045, lng: 31.238 },
    imageUrl: "https://picsum.photos/600/400?random=1",
  },
  {
    id: 2,
    title: "Pothole on Main Rd",
    description: "Large pothole causing traffic slowdowns.",
    category: "road_damage",
    location: { lat: 30.0465, lng: 31.2392 },
    imageUrl: "https://picsum.photos/600/400?random=2",
  },
  {
    id: 3,
    title: "Overflowing Sewage",
    description: "Sewage pipe has burst, water flooding the sidewalk.",
    category: "sewage_problem",
    location: { lat: 30.0473, lng: 31.2375 },
    imageUrl: "https://picsum.photos/600/400?random=3",
  },
  {
    id: 4,
    title: "Water Leak",
    description: "Persistent water leak from underground pipe.",
    category: "water_issue",
    location: { lat: 30.0448, lng: 31.2401 },
    imageUrl: "https://picsum.photos/600/400?random=4",
  },
  {
    id: 5,
    title: "Damaged Trash Bin",
    description: "Public trash bin is broken and overflowing.",
    category: "waste_management",
    location: { lat: 30.0457, lng: 31.2368 },
    imageUrl: "https://picsum.photos/600/400?random=5",
  },
  {
    id: 6,
    title: "Graffiti on Wall",
    description: "Unauthorized graffiti defacing public property.",
    category: "public_property_damage",
    location: { lat: 30.0461, lng: 31.241 },
    imageUrl: "https://picsum.photos/600/400?random=6",
  },
  {
    id: 7,
    title: "Broken Traffic Light",
    description: "Traffic signal stuck on red, causing delays.",
    category: "public_transportation",
    location: { lat: 30.0478, lng: 31.2387 },
    imageUrl: "https://picsum.photos/600/400?random=7",
  },
  {
    id: 8,
    title: "Weak Wi-Fi Signal",
    description: "Public Wi‑Fi hotspot barely works in this area.",
    category: "other",
    location: { lat: 30.0452, lng: 31.2395 },
    imageUrl: "https://picsum.photos/600/400?random=8",
  },
  {
    id: 9,
    title: "Dim Street Lamps",
    description: "Multiple street lamps are too dim at night.",
    category: "street_lighting",
    location: { lat: 30.0469, lng: 31.2372 },
    imageUrl: "https://picsum.photos/600/400?random=9",
  },
  {
    id: 10,
    title: "Air Pollution Smell",
    description: "Strong chemical odor near the industrial zone.",
    category: "environmental_issue",
    location: { lat: 30.047, lng: 31.2405 },
    imageUrl: "https://picsum.photos/600/400?random=10",
  },
];

// Helpers (could be moved to utils)
function getCategoryColor(category) {
  const colors = {
    road_damage: "#ff4444",
    water_issue: "#3b82f6",
    electricity_issue: "#f59e0b",
    waste_management: "#10b981",
    public_property_damage: "#8b5cf6",
    street_lighting: "#fcd34d",
    sewage_problem: "#6b7280",
    public_transportation: "#ef4444",
    environmental_issue: "#84cc16",
    other: "#94a3b8",
  };
  return colors[category] || colors.other;
}

function formatCategoryLabel(category) {
  const labels = {
    road_damage: "Road Damage",
    water_issue: "Water Issue",
    electricity_issue: "Electricity Issue",
    waste_management: "Waste Management",
    public_property_damage: "Property Damage",
    street_lighting: "Street Lighting",
    sewage_problem: "Sewage Problem",
    public_transportation: "Transportation",
    environmental_issue: "Environmental",
    other: "Other",
  };
  return labels[category] || "Uncategorized";
}

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12 bg-gradient-to-br from-[#00f260] to-[#0575e6]">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#005bea] to-[#00c6fb] p-6 rounded-t-2xl">
          <div className="w-6" />
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-white">{user.name}</h1>
            <p className="text-xl text-white opacity-80">{user.email}</p>
          </div>

          <button className="p-2 rounded-full bg-white hover:bg-gray-100 transition">
            <LogOut className="w-5 h-5 text-gray-700" />
          </button>
          {/* symmetry placeholder */}
        </div>

        {/* Points Section */}
        <div className="p-6 ">
          <div className="max-w-xs mx-auto bg-white rounded-xl shadow-lg text-center p-6">
            <h2 className="text-lg text-gray-500 uppercase">Total Points</h2>
            <p className="text-5xl font-bold text-[#F59081] mt-2">
              {user.points}
            </p>
          </div>
        </div>

        {/* Reports List Section */}
        <div className="p-6 grid gap-6 md:grid-cols-2">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <img
                src={report.imageUrl}
                alt={report.title}
                className="w-full h-48 
                object-cover 
                rounded-t-xl 
                shadow-md 
                transition-transform duration-300 
                hover:scale-105 
                filter brightness-95"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {report.title}
                </h3>
                <span
                  className="inline-block text-xs font-medium px-2 py-1 rounded-full text-white mt-2"
                  style={{ backgroundColor: getCategoryColor(report.category) }}
                >
                  {formatCategoryLabel(report.category)}
                </span>
                <p className="text-sm text-gray-600 mt-2">
                  {report.description}
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  📍 {report.location.lat.toFixed(4)},{" "}
                  {report.location.lng.toFixed(4)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

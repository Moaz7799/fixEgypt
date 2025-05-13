import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

const CATEGORY_COLORS = {
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

const CATEGORY_LABELS = {
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

const getCategoryIcon = (category) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M32 0C20 0 12 10 12 22C12 38 32 58 32 58S52 38 52 22C52 10 44 0 32 0Z" 
          fill="${CATEGORY_COLORS[category] || "#94a3b8"}"
        />
        <path
          d="M32 12a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z"
          fill="#fff"
          opacity="0.25"
        />
      </svg>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40], // Anchor at the tip of the pin
    popupAnchor: [0, -40], // Popup appears above the pin
  });
};

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Map click handler component
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => onMapClick(e.latlng),
  });
  return null;
};

export default function Home() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: { lat: null, lng: null },
    images: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedPosition, setSelectedPosition] = useState(null);

  const [markers, setMarkers] = useState([]);

  // Handle map clicks
  const handleMapClick = (latlng) => {
    setSelectedPosition(latlng);
    setFormData((prev) => ({
      ...prev,
      location: {
        lat: latlng.lat,
        lng: latlng.lng,
      },
    }));
  };

  // Update marker position when form inputs change
  useEffect(() => {
    if (formData.location.lat && formData.location.lng) {
      setSelectedPosition([formData.location.lat, formData.location.lng]);
    }
  }, [formData.location.lat, formData.location.lng]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.location.lat || !formData.location.lng)
      newErrors.location = "Location is required";
    if (formData.images.length === 0) newErrors.images = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "lat" || name === "lng") {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: parseFloat(value) || null,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      console.log("Submitting report:", formData);
      // await axios.post('/api/reports', formData);

      setMarkers((prev) => [...prev, formData]);

      alert("Report submitted successfully!");

      // Reset form but keep location (optional)
      setFormData({
        title: "",
        category: "",
        description: "",
        location: { lat: null, lng: null },
        images: [],
      });
      // Reset form after successful submission if needed
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic image validation
    if (!file.type.match("image.*")) {
      setErrors((prev) => ({ ...prev, images: "Please select an image file" }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setErrors((prev) => ({
        ...prev,
        images: "Image must be less than 10MB",
      }));
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      setFormData((prev) => ({
        ...prev,
        images: [base64],
      }));
      setErrors((prev) => ({ ...prev, images: undefined }));
    } catch (error) {
      console.error("Image conversion failed:", error);
      setErrors((prev) => ({ ...prev, images: "Failed to process image" }));
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row p-[20px] bg-gradient-to-br  from-[#D6C7FF] to-[#AB8BFF] ">
      {/* Left side (Form) */}
      <div className="h-1/2 lg:h-auto lg:w-1/4 bg-white p-6 shadow-lg border-b lg:border-r border-gray-200 overflow-y-auto lg:rounded-l-2xl lg:rounded-t-none lg:overflow-auto hide-scrollbar rounded-t-2xl ">
        <h2 className="text-3xl font-bold mb-6 text-purple-700">
          Report a Problem
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              className={`w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.title ? "border-red-500" : "focus:ring-purple-400"
              }`}
              placeholder="E.g. Trash in the street"
              onChange={handleChange}
              value={formData.title}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              name="category"
              className={`w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.category ? "border-red-500" : "focus:ring-purple-400"
              }`}
              onChange={handleChange}
              value={formData.category}
            >
              <option value="">Select category</option>
              <option value="road_damage">Road Damage</option>
              <option value="water_issue">Water Issue</option>
              <option value="electricity_issue">Electricity Issue</option>
              <option value="waste_management">Waste Management</option>
              <option value="public_property_damage">
                Public Property Damage
              </option>
              <option value="street_lighting">Street Lighting</option>
              <option value="sewage_problem">Sewage Problem</option>
              <option value="public_transportation">
                Public Transportation
              </option>
              <option value="environmental_issue">Environmental Issue</option>
              <option value="other">Other</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              rows="3"
              className={`w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.description ? "border-red-500" : "focus:ring-purple-400"
              }`}
              placeholder="More details..."
              onChange={handleChange}
              value={formData.description}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Location */}
          <div className="relative">
            <label className="block text-sm font-medium">Location</label>
            <div className="grid grid-cols-2 gap-4 mt-1">
              <div>
                <input
                  type="number"
                  name="lat"
                  step="any"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.location ? "border-red-500" : "focus:ring-purple-400"
                  }`}
                  placeholder="Latitude"
                  onChange={handleChange}
                  value={formData.location.lat || ""}
                />
              </div>
              <div>
                <input
                  type="number"
                  name="lng"
                  step="any"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.location ? "border-red-500" : "focus:ring-purple-400"
                  }`}
                  placeholder="Longitude"
                  onChange={handleChange}
                  value={formData.location.lng || ""}
                />
              </div>
            </div>
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location}</p>
            )}
            {formData.location.lat && (
              <button
                type="button"
                onClick={() => {
                  setSelectedPosition(null);
                  setFormData((prev) => ({
                    ...prev,
                    location: { lat: null, lng: null },
                  }));
                }}
                className="absolute -top-1 right-0 text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Remove Marker
              </button>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Photo
            </label>

            <div className="mt-1">
              {/* Hidden file input */}
              <input
                type="file"
                name="image"
                id="image-upload"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              {/* Custom styled button */}
              <label
                htmlFor="image-upload"
                className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-white transition-colors
        ${
          errors.images
            ? "bg-red-500 hover:bg-red-600"
            : "bg-purple-600 hover:bg-purple-700"
        }
        ${formData.images.length > 0 ? "mr-3" : ""}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
                Choose File
              </label>

              {/* Selected file name */}
              {formData.images.length > 0 && (
                <span className="text-gray-600 text-sm ml-2 truncate">
                  {formData.images[0].name || "Selected file"}
                </span>
              )}
            </div>

            {/* Error message */}
            {errors.images && (
              <p className="text-red-500 text-xs mt-1">{errors.images}</p>
            )}

            {/* Image preview */}
            {formData.images.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Preview:</p>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, images: [] })}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="border rounded-lg p-1">
                  <img
                    src={formData.images[0]}
                    alt="Preview"
                    className="w-full max-h-48 object-contain rounded-md"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>

      {/* Right side (Map) */}
      <div className="h-1/2 lg:h-auto lg:w-3/4 bg-gray-100 shadow-lg lg:rounded-r-2xl overflow-auto rounded-b-2xl lg:rounded-bl-none">
        <MapContainer
          center={[30.033333, 31.233334]}
          zoom={13}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onMapClick={handleMapClick} />

          {selectedPosition && (
            <Marker
              position={selectedPosition}
              icon={getCategoryIcon(formData.category)}
            >
              <Popup>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-lg">
                    {formData.title || "New Report"}
                  </h3>
                  <span
                    className="inline-block px-2 py-1 rounded-full text-sm text-white"
                    style={{
                      backgroundColor: CATEGORY_COLORS[formData.category],
                    }}
                  >
                    {CATEGORY_LABELS[formData.category] || "Uncategorized"}
                  </span>
                </div>
              </Popup>
            </Marker>
          )}
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={[marker.location.lat, marker.location.lng]}
              icon={getCategoryIcon(marker.category)}
            >
              <Popup>
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-lg">{marker.title}</h3>
                  <span
                    className="inline-block px-2 py-1 rounded-full text-sm text-white font-medium"
                    style={{
                      backgroundColor: CATEGORY_COLORS[marker.category],
                      border: `2px solid ${CATEGORY_COLORS[marker.category]}`,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    {CATEGORY_LABELS[marker.category]}
                  </span>
                  <p className="text-gray-600">{marker.description}</p>
                  <button
                    onClick={() =>
                      setMarkers((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

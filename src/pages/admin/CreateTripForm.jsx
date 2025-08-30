import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { X, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


function SortableImage({ id, imageUrl, index, onRemove, isDisabled }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(index);
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <img
        src={imageUrl}
        alt={`Image ${index + 1}`}
        className="w-full h-24 object-cover rounded-md"
      />

      {/* Drag handle only */}
      {!isDisabled && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-1 left-1 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 cursor-move"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 7h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"/>
          </svg>
        </div>
      )}

      {/* Remove button */}
      {!isDisabled && (
        <button
          type="button"
          onClick={handleRemove}
          onMouseDown={(e) => e.stopPropagation()} // stop drag start
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}


const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export default function CreateTripForm({
  closeDrawer,
  refreshTrips,
  editTripData,
  viewTripData,
  enquiryData,
  isCustomItinerary = false,
  isReadOnly = false,
}) {
  const initialFormData = {
    tripType: "PACKAGE",
    title: "",
    state: "",
    description: "",
    category: "",
    isSessional: false,
    overview: [""],
    inclusions: [""],
    exclusions: [""],
    activities: [""],
    tags: [""],
    itinerary: [{ dayNumber: "", title: "", description: "", points: [""] }],
    startDate: "",
    endDate: "",
    duration: "",
    payment: {
      actualPrice: 0,
      grandTotal: 0,
      activities: 0,
      insurance: 0,
      taxation: 0,
      subTotal: 0,
    },
    totalSeats: "",
    pickupDropLocation: "",
    isActive: true,
    images: [],
    existingImages: [],
  };

  const isEditMode = Boolean(editTripData);
  const isViewMode = Boolean(viewTripData);
  const isDisabled = isViewMode || isReadOnly;

  const [formData, setFormData] = useState(initialFormData);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    description: false,
    itinerary: false,
    payment: false,
    media: false,
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImagePreviews, setExistingImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize form data based on mode
  useEffect(() => {
    const initializeFormData = async () => {
      // If we have editTripData (from custom itinerary), use it directly
      if (isCustomItinerary && editTripData) {
        setFormData(editTripData);

        // Set existing image previews
        if (
          editTripData.existingImages &&
          editTripData.existingImages.length > 0
        ) {
          setExistingImagePreviews(editTripData.existingImages);
        }
        setLoading(false);
        return;
      }

      if ((editTripData || viewTripData) && !isCustomItinerary) {
        setLoading(true);
        try {
          const tripId = (editTripData || viewTripData)._id;

          // Fetch complete trip data from backend
          const response = await axiosInstance.get(
            `/api/admin/trips/${tripId}`
          );

          const tripData = response.data;

          // Convert backend data to form format
          const formattedData = {
            tripType: tripData.tripType || "PACKAGE",
            title: tripData.title || "",
            state: tripData.state || "",
            description: tripData.description || "",
            category: tripData.category || "",
            isSessional: tripData.isSessional || false,
            overview:
              tripData.overview && tripData.overview.length > 0
                ? tripData.overview
                : [""],
            inclusions:
              tripData.inclusions && tripData.inclusions.length > 0
                ? tripData.inclusions
                : [""],
            exclusions:
              tripData.exclusions && tripData.exclusions.length > 0
                ? tripData.exclusions
                : [""],
            activities:
              tripData.activities && tripData.activities.length > 0
                ? tripData.activities
                : [""],
            tags:
              tripData.tags && tripData.tags.length > 0 ? tripData.tags : [""],
            itinerary:
              tripData.itinerary && tripData.itinerary.length > 0
                ? tripData.itinerary.map((item) => ({
                    dayNumber: item.dayNumber || "",
                    title: item.title || "",
                    description: item.description || "",
                    points:
                      item.points && item.points.length > 0
                        ? item.points
                        : [""],
                  }))
                : [{ dayNumber: "", title: "", description: "", points: [""] }],
            startDate: tripData.startDate
              ? new Date(tripData.startDate).toISOString().split("T")[0]
              : "",
            endDate: tripData.endDate
              ? new Date(tripData.endDate).toISOString().split("T")[0]
              : "",
            duration: tripData.duration || "",
            payment: tripData.payment || {
              actualPrice: 0,
              grandTotal: 0,
              activities: 0,
              insurance: 0,
              taxation: 0,
              subTotal: 0,
            },
            totalSeats: tripData.totalSeats || "",
            pickupDropLocation: tripData.pickupDropLocation || "",
            isActive:
              tripData.isActive !== undefined ? tripData.isActive : true,
            images: [],
            existingImages: tripData.images || [],
          };

          setFormData(formattedData);

          // Set existing image previews
          if (tripData.images && tripData.images.length > 0) {
            setExistingImagePreviews(tripData.images);
          }
        } catch (error) {
          console.error("Failed to fetch trip data:", error);
          alert("Failed to load trip data");
        } finally {
          setLoading(false);
        }
      }
    };

    initializeFormData();
  }, [editTripData, viewTripData, isCustomItinerary]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox")
      setFormData((prev) => ({ ...prev, [name]: checked }));
    else if (type === "file") handleImageUpload(files);
    else setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload with preview and limit
  const handleImageUpload = (files) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const invalidFiles = Array.from(files).filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      alert("Only JPG, PNG, and WebP images are allowed");
      return;
    }

    const totalImages = formData.images.length + files.length;
    if (totalImages > 3) {
      alert("Maximum 3 images allowed");
      return;
    }

    const newImages = Array.from(files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));

    // Create previews
    const newPreviews = newImages.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // Remove uploaded image
  // const removeImage = (index) => {
  //   const newImages = [...formData.images];
  //   const newPreviews = [...imagePreviews];

  //   newImages.splice(index, 1);
  //   URL.revokeObjectURL(newPreviews[index]);
  //   newPreviews.splice(index, 1);

  //   setFormData((prev) => ({ ...prev, images: newImages }));
  //   setImagePreviews(newPreviews);
  // };

  // Remove uploaded image
  const removeImage = (index) => {
    // Create new arrays without the removed image
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);

    // Update both state variables
    setFormData((prev) => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
  };

  // DND sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Remove existing image (for edit mode)
  const removeExistingImage = (index) => {
    const newExistingImages = [...formData.existingImages];
    const newExistingPreviews = [...existingImagePreviews];

    newExistingImages.splice(index, 1);
    newExistingPreviews.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      existingImages: newExistingImages,
    }));
    setExistingImagePreviews(newExistingPreviews);
  };

  // Handle drag end for existing images
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = existingImagePreviews.findIndex(
        (img) => img === active.id
      );
      const newIndex = existingImagePreviews.findIndex(
        (img) => img === over.id
      );

      const newPreviews = arrayMove(existingImagePreviews, oldIndex, newIndex);
      const newImages = arrayMove(formData.existingImages, oldIndex, newIndex);

      setExistingImagePreviews(newPreviews);
      setFormData((prev) => ({ ...prev, existingImages: newImages }));
    }
  };



  // Dynamic array handlers
  const handleArrayChange = (field, idx, value) => {
    const arr = [...formData[field]];
    arr[idx] = value;
    setFormData((prev) => ({ ...prev, [field]: arr }));
  };
  const addArrayItem = (field) =>
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  const removeArrayItem = (field, idx) =>
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx),
    }));

  // Itinerary handlers
  const handleItineraryChange = (idx, key, value) => {
    const arr = [...formData.itinerary];
    arr[idx][key] = value;
    setFormData((prev) => ({ ...prev, itinerary: arr }));
  };
  const addItineraryItem = () =>
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { dayNumber: "", title: "", description: "", points: [""] },
      ],
    }));
  const removeItineraryItem = (idx) =>
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== idx),
    }));

  // Itinerary points handlers
  const handlePointChange = (dayIdx, pointIdx, value) => {
    const arr = [...formData.itinerary];
    arr[dayIdx].points[pointIdx] = value;
    setFormData((prev) => ({ ...prev, itinerary: arr }));
  };
  const addPoint = (dayIdx) => {
    const arr = [...formData.itinerary];
    arr[dayIdx].points.push("");
    setFormData((prev) => ({ ...prev, itinerary: arr }));
  };
  const removePoint = (dayIdx, pointIdx) => {
    const arr = [...formData.itinerary];
    arr[dayIdx].points = arr[dayIdx].points.filter((_, i) => i !== pointIdx);
    setFormData((prev) => ({ ...prev, itinerary: arr }));
  };

  // Payment
  const handlePaymentChange = (key, value) =>
    setFormData((prev) => ({
      ...prev,
      payment: { ...prev.payment, [key]: parseFloat(value) || 0 },
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ✅ PREVENT SUBMIT IF READONLY
    if (isReadOnly) {
      alert("Cannot modify itinerary after payment has been made");
      return;
    }

    try {
      let url, method, res;

      if (isCustomItinerary && enquiryData) {
        // ✅ For custom itinerary, send as JSON without image fields
        const { images, existingImages, ...itineraryData } = formData;

        // Ensure payment calculations are correct
        const payment = itineraryData.payment || {};
        const subTotal = parseFloat(payment.subTotal) || 0;
        const activities = parseFloat(payment.activities) || 0;
        const insurance = parseFloat(payment.insurance) || 0;
        const taxation = parseFloat(payment.taxation) || 0;

        // Calculate correct grandTotal
        const grandTotal = subTotal + activities + insurance + taxation;

        // Update with corrected payment data
        const validatedData = {
          ...itineraryData,
          payment: {
            ...payment,
            grandTotal: grandTotal,
            // Ensure actualPrice is at least grandTotal
            actualPrice: Math.max(
              parseFloat(payment.actualPrice) || 0,
              grandTotal
            ),
          },
        };

        url = `/api/admin/enquiries/${enquiryData._id}/create-itinerary`;
        method = "post";
        res = await axiosInstance[method](url, itineraryData, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // For regular trip creation/update, use FormData

        // In your handleSubmit function, modify the FormData creation:
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
          if (key === "images") {
            for (let i = 0; i < formData.images.length; i++) {
              data.append("images", formData.images[i]);
            }
          } else if (key === "existingImages") {
            // Stringify the array for backend parsing
            data.append(
              "existingImages",
              JSON.stringify(formData.existingImages)
            );
          } else if (
            [
              "overview",
              "inclusions",
              "exclusions",
              "activities",
              "tags",
              "itinerary",
            ].includes(key)
          ) {
            data.append(key, JSON.stringify(formData[key]));
          } else if (key === "payment") {
            data.append(key, JSON.stringify(formData.payment));
          } else if (key === "startDate" || key === "endDate") {
            if (formData[key]) {
              data.append(key, new Date(formData[key]).toISOString());
            } else {
              data.append(key, "");
            }
          } else {
            data.append(key, formData[key]);
          }
        });

        if (isEditMode) {
          url = `/api/admin/updateTrip/${editTripData._id}`;
          method = "put";
        } else {
          url = "/api/admin/createTrip";
          method = "post";
        }
        res = await axiosInstance[method](url, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert(res.data.message);
      setFormData(initialFormData);
      setImagePreviews([]);
      setExistingImagePreviews([]);
      closeDrawer();
      refreshTrips();
    } catch (err) {
      console.error("Submit error:", err);
      alert(
        err.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} trip`
      );
    }
  };
  // Add this useEffect to auto-calculate grandTotal
  useEffect(() => {
    const calculateGrandTotal = () => {
      const payment = formData.payment;
      const subTotal = parseFloat(payment.subTotal) || 0;
      const activities = parseFloat(payment.activities) || 0;
      const insurance = parseFloat(payment.insurance) || 0;
      const taxation = parseFloat(payment.taxation) || 0;

      return subTotal + activities + insurance + taxation;
    };

    // Auto-update grandTotal when other fields change
    setFormData((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        grandTotal: calculateGrandTotal(),
      },
    }));
  }, [
    formData.payment.subTotal,
    formData.payment.activities,
    formData.payment.insurance,
    formData.payment.taxation,
  ]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  if (loading) {
    return (
      <div className="p-6 relative h-full overflow-y-auto bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trip data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 relative h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditMode
            ? "Edit Trip"
            : isViewMode
            ? "Trip Details"
            : "Create New Trip"}
        </h2>
        <button
          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          onClick={closeDrawer}
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip Type */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-800">Trip Type</h3>
          </div>
          <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Trip Type
              </label>
              <select
                name="tripType"
                value={formData.tripType}
                onChange={handleChange}
                disabled={isDisabled}
                className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  isDisabled ? "bg-gray-100" : ""
                }`}
              >
                <option value="PACKAGE">Package Trip</option>
                <option value="CUSTOMIZED">Customized Trip</option>
              </select>
            </div>
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <button
            type="button"
            className="w-full flex justify-between items-center p-4 text-left"
            onClick={() => toggleSection("basic")}
          >
            <h3 className="text-lg font-medium text-gray-800">
              Basic Information
            </h3>
            {expandedSections.basic ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>

          {expandedSections.basic && (
            <div className="px-4 py-5 sm:p-6 border-t border-gray-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trip Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter trip title"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={isDisabled}
                    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      isDisabled ? "bg-gray-100" : ""
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>

                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={isDisabled}
                    required
                    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      isDisabled ? "bg-gray-100" : ""
                    }`}
                  >
                    <option value="">Select state</option>
                    {STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    placeholder="Enter category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={isDisabled}
                    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      isDisabled ? "bg-gray-100" : ""
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Seats
                  </label>
                  <input
                    type="number"
                    name="totalSeats"
                    placeholder="Enter total seats"
                    value={formData.totalSeats}
                    onChange={handleChange}
                    disabled={isDisabled}
                    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      isDisabled ? "bg-gray-100" : ""
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    disabled={isDisabled}
                    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      isDisabled ? "bg-gray-100" : ""
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    disabled={isDisabled}
                    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      isDisabled ? "bg-gray-100" : ""
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    placeholder="e.g. 5 Days 4 Nights"
                    value={formData.duration}
                    onChange={handleChange}
                    disabled={isDisabled}
                    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      isDisabled ? "bg-gray-100" : ""
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup/Drop Location
                  </label>
                  <input
                    type="text"
                    name="pickupDropLocation"
                    placeholder="Enter location"
                    value={formData.pickupDropLocation}
                    onChange={handleChange}
                    disabled={isDisabled}
                    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      isDisabled ? "bg-gray-100" : ""
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Enter trip description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isDisabled}
                  rows={3}
                  className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    isDisabled ? "bg-gray-100" : ""
                  }`}
                />
              </div>

              <div className="flex items-center">
                <input
                  id="isSessional"
                  name="isSessional"
                  type="checkbox"
                  checked={formData.isSessional}
                  onChange={handleChange}
                  disabled={isDisabled}
                  className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                    isDisabled ? "bg-gray-100" : ""
                  }`}
                />
                <label
                  htmlFor="isSessional"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Sessional Trip
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Description Sections */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <button
            type="button"
            className="w-full flex justify-between items-center p-4 text-left"
            onClick={() => toggleSection("description")}
          >
            <h3 className="text-lg font-medium text-gray-800">Trip Details</h3>
            {expandedSections.description ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>

          {expandedSections.description && (
            <div className="px-4 py-5 sm:p-6 border-t border-gray-200 space-y-6">
              {[
                "overview",
                "inclusions",
                "exclusions",
                "activities",
                "tags",
              ].map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field}
                  </label>
                  {formData[field].map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) =>
                          handleArrayChange(field, idx, e.target.value)
                        }
                        disabled={isDisabled}
                        className={`block flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          isDisabled ? "bg-gray-100" : ""
                        }`}
                        placeholder={`Enter ${field.slice(0, -1)} item`}
                      />
                      {formData[field].length > 1 && !isDisabled && (
                        <button
                          type="button"
                          className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => removeArrayItem(field, idx)}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  {!isDisabled && (
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => addArrayItem(field)}
                    >
                      <Plus size={16} className="mr-1" /> Add{" "}
                      {field.slice(0, -1)}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Itinerary Section */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <button
            type="button"
            className="w-full flex justify-between items-center p-4 text-left"
            onClick={() => toggleSection("itinerary")}
          >
            <h3 className="text-lg font-medium text-gray-800">Itinerary</h3>
            {expandedSections.itinerary ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>

          {expandedSections.itinerary && (
            <div className="px-4 py-5 sm:p-6 border-t border-gray-200 space-y-4">
              {formData.itinerary.map((item, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg p-4 bg-gray-50 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-700">Day {idx + 1}</h4>
                    {formData.itinerary.length > 1 && !isDisabled && (
                      <button
                        type="button"
                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={() => removeItineraryItem(idx)}
                      >
                        <Trash2 size={14} className="mr-1" /> Remove Day
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Day Number
                      </label>
                      <input
                        type="number"
                        placeholder="Day"
                        value={item.dayNumber}
                        onChange={(e) =>
                          handleItineraryChange(
                            idx,
                            "dayNumber",
                            e.target.value
                          )
                        }
                        disabled={isDisabled}
                        className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          isDisabled ? "bg-gray-100" : ""
                        }`}
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        placeholder="Day title"
                        value={item.title}
                        onChange={(e) =>
                          handleItineraryChange(idx, "title", e.target.value)
                        }
                        disabled={isDisabled}
                        className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          isDisabled ? "bg-gray-100" : ""
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      placeholder="Day description"
                      value={item.description}
                      onChange={(e) =>
                        handleItineraryChange(
                          idx,
                          "description",
                          e.target.value
                        )
                      }
                      disabled={isDisabled}
                      rows={3}
                      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        isDisabled ? "bg-gray-100" : ""
                      }`}
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Points
                    </label>
                    <div className="space-y-2">
                      {item.points.map((point, pIdx) => (
                        <div key={pIdx} className="flex gap-2">
                          <input
                            type="text"
                            placeholder={`Point ${pIdx + 1}`}
                            value={point}
                            onChange={(e) =>
                              handlePointChange(idx, pIdx, e.target.value)
                            }
                            disabled={isDisabled}
                            className={`block flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                              isDisabled ? "bg-gray-100" : ""
                            }`}
                          />
                          {item.points.length > 1 && !isDisabled && (
                            <button
                              type="button"
                              className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              onClick={() => removePoint(idx, pIdx)}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                      {!isDisabled && (
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => addPoint(idx)}
                        >
                          <Plus size={16} className="mr-1" /> Add Point
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {!isDisabled && (
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={addItineraryItem}
                >
                  <Plus size={16} className="mr-1" /> Add Day
                </button>
              )}
            </div>
          )}
        </div>

        {/* Payment Section */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <button
            type="button"
            className="w-full flex justify-between items-center p-4 text-left"
            onClick={() => toggleSection("payment")}
          >
            <h3 className="text-lg font-medium text-gray-800">
              Payment Details
            </h3>
            {expandedSections.payment ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>

          {expandedSections.payment && (
            <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { key: "actualPrice", label: "Actual Price" },
                  { key: "subTotal", label: "Subtotal" },
                  { key: "activities", label: "Activities" },
                  { key: "insurance", label: "Insurance" },
                  { key: "taxation", label: "Taxation" },
                ].map((item) => (
                  <div key={item.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {item.label}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₹</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.payment[item.key]}
                        onChange={(e) =>
                          handlePaymentChange(item.key, e.target.value)
                        }
                        disabled={isDisabled}
                        className={`block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          isDisabled ? "bg-gray-100" : ""
                        }`}
                      />
                    </div>
                  </div>
                ))}

                {/* Grand Total (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grand Total (Auto-calculated)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">₹</span>
                    </div>
                    <input
                      type="number"
                      value={formData.payment.grandTotal}
                      readOnly
                      className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Subtotal + Activities + Insurance + Taxation
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Media Section */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <button
            type="button"
            className="w-full flex justify-between items-center p-4 text-left"
            onClick={() => toggleSection("media")}
          >
            <h3 className="text-lg font-medium text-gray-800">Media</h3>
            {expandedSections.media ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>

          {expandedSections.media && (
            <div className="px-4 py-5 sm:p-6 border-t border-gray-200 space-y-4">
              {/* Existing Images (for edit mode) */}

              {existingImagePreviews.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Existing Images (Drag to reorder)
                  </label>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext items={existingImagePreviews}>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                        {existingImagePreviews.map((imageUrl, index) => (
                          <SortableImage
                            key={imageUrl}
                            id={imageUrl}
                            imageUrl={imageUrl}
                            index={index}
                            onRemove={removeExistingImage}
                            isDisabled={isDisabled}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}

              {/* New Image Upload */}
              {/* {!isDisabled && (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload New Images (Max 3)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="images"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload images</span>
                          <input
                            id="images"
                            name="images"
                            type="file"
                            multiple
                            onChange={handleChange}
                            className="sr-only"
                            accept="image/*"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB.{" "}
                        {3 -
                          (formData.images.length +
                            formData.existingImages.length)}{" "}
                        remaining
                      </p>
                    </div>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Images
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )} */}
              {/* New Image Upload */}
              {!isDisabled && (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload New Images (Max 3)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="images"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload images</span>
                          <input
                            id="images"
                            name="images"
                            type="file"
                            multiple
                            onChange={handleChange}
                            className="sr-only"
                            accept="image/*"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB.{" "}
                        {3 -
                          (formData.images.length +
                            formData.existingImages.length)}{" "}
                        remaining
                      </p>
                    </div>
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Images
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={closeDrawer}
          >
            {isViewMode ? "Close" : "Cancel"}
          </button>
          {!isViewMode && (
            <button
              type="submit"
              className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isEditMode ? "Update Trip" : "Create Trip"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

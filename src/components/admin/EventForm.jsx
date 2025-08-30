import React, { useState, useRef } from "react";

const EventForm = ({ event, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    shortDescription: event?.shortDescription || "",
    date: event?.date ? new Date(event.date).toISOString().split("T")[0] : "",
    endDate: event?.endDate
      ? new Date(event.endDate).toISOString().split("T")[0]
      : "",
    location: event?.location || "",
    venue: event?.venue || "",
    price: event?.price || "",
    capacity: event?.capacity || "",
    category: event?.category || "Adventure",
    organizer: event?.organizer || "",
    status: event?.status || "draft",
    highlights: event?.highlights || [""],
    inclusions: event?.inclusions || [""],
    exclusions: event?.exclusions || [""],
    termsConditions: event?.termsConditions || [""],
  });

  const [coverImageFile, setCoverImageFile] = useState(null);
  const [scheduleItemFiles, setScheduleItemFiles] = useState({});
  const [includedItemFiles, setIncludedItemFiles] = useState({});
  const [coverImage, setCoverImage] = useState(event?.coverImage || null);

  const [scheduleItems, setScheduleItems] = useState(
    event?.scheduleItems?.map((item) => ({
      ...item,
      image: item.image || null,
    })) || [{ time: "", activity: "", image: null }]
  );

  const [includedItems, setIncludedItems] = useState(
    event?.includedItems?.map((item) => ({
      ...item,
      image: item.image || null,
    })) || [{ image: null, description: "" }]
  );

  const coverInputRef = useRef(null);
  const scheduleImageRefs = useRef([]);
  const includedImageRefs = useRef([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create FormData object to handle file uploads
    const formDataToSend = new FormData();

    // Append all form data
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((item, index) => {
          formDataToSend.append(`${key}[${index}]`, item);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append cover image if available
    if (coverImageFile) {
      formDataToSend.append("coverImage", coverImageFile);
    }

    // Append schedule items with images
    scheduleItems.forEach((item, index) => {
      formDataToSend.append(`scheduleItems[${index}][time]`, item.time);
      formDataToSend.append(`scheduleItems[${index}][activity]`, item.activity);

      if (scheduleItemFiles[index]) {
        formDataToSend.append(
          `scheduleItems[${index}][image]`,
          scheduleItemFiles[index]
        );
      }
    });

    // Append included items with images
    includedItems.forEach((item, index) => {
      formDataToSend.append(
        `includedItems[${index}][description]`,
        item.description
      );

      if (includedItemFiles[index]) {
        formDataToSend.append(
          `includedItems[${index}][image]`,
          includedItemFiles[index]
        );
      }
    });

    // Send the FormData object to the parent component
    onSave(formDataToSend);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayFieldChange = (field, index, value) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const addArrayFieldItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayFieldItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleScheduleItemChange = (index, field, value) => {
    const newSchedule = [...scheduleItems];
    newSchedule[index][field] = value;
    setScheduleItems(newSchedule);
  };

  const addScheduleItem = () => {
    setScheduleItems([
      ...scheduleItems,
      { time: "", activity: "", image: null },
    ]);
  };

  const removeScheduleItem = (index) => {
    setScheduleItems(scheduleItems.filter((_, i) => i !== index));

    // Also remove any associated file
    const newFiles = { ...scheduleItemFiles };
    delete newFiles[index];
    setScheduleItemFiles(newFiles);
  };

  const handleIncludedItemChange = (index, field, value) => {
    const newIncluded = [...includedItems];
    newIncluded[index][field] = value;
    setIncludedItems(newIncluded);
  };

  const addIncludedItem = () => {
    setIncludedItems([...includedItems, { image: null, description: "" }]);
  };

  const removeIncludedItem = (index) => {
    setIncludedItems(includedItems.filter((_, i) => i !== index));

    // Also remove any associated file
    const newFiles = { ...includedItemFiles };
    delete newFiles[index];
    setIncludedItemFiles(newFiles);
  };

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImage(e.target.result); // For preview
        setCoverImageFile(file); // For upload
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScheduleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newSchedule = [...scheduleItems];
        newSchedule[index].image = e.target.result; // For preview
        setScheduleItems(newSchedule);

        // Store the file for upload
        setScheduleItemFiles((prev) => ({
          ...prev,
          [index]: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIncludedImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newIncluded = [...includedItems];
        newIncluded[index].image = e.target.result; // For preview

        // Store the file for upload
        setIncludedItemFiles((prev) => ({
          ...prev,
          [index]: file,
        }));

        setIncludedItems(newIncluded);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScheduleImage = (index) => {
    const newSchedule = [...scheduleItems];
    newSchedule[index].image = null;
    setScheduleItems(newSchedule);

    // Also remove the file
    const newFiles = { ...scheduleItemFiles };
    delete newFiles[index];
    setScheduleItemFiles(newFiles);
  };

  const removeIncludedImage = (index) => {
    const newIncluded = [...includedItems];
    newIncluded[index].image = null;
    setIncludedItems(newIncluded);

    // Also remove the file
    const newFiles = { ...includedItemFiles };
    delete newFiles[index];
    setIncludedItemFiles(newFiles);
  };

  const triggerCoverInput = () => {
    coverInputRef.current?.click();
  };

  const triggerScheduleImageInput = (index) => {
    scheduleImageRefs.current[index]?.click();
  };

  const triggerIncludedImageInput = (index) => {
    includedImageRefs.current[index]?.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-end z-50 p-0 overflow-hidden">
      <div className="bg-white w-full max-w-4xl h-screen overflow-y-auto transform transition-transform duration-300">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800">
            {event ? "Edit Event" : "Create New Event"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6"
          encType="multipart/form-data"
        >
          {/* Cover Image Upload */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image *
            </label>
            <div
              onClick={triggerCoverInput}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors bg-white"
            >
              {coverImage ? (
                <div className="relative">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg mx-auto"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCoverImage(null);
                      setCoverImageFile(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400 mx-auto mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 002 2z"
                    />
                  </svg>
                  <p className="text-gray-600">Click to upload cover image</p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </>
              )}
              <input
                type="file"
                ref={coverInputRef}
                onChange={handleCoverImageUpload}
                className="hidden"
                accept="image/*"
                name="coverImage"
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                >
                  <option value="Adventure">Adventure</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Food">Food</option>
                  <option value="Festival">Festival</option>
                  <option value="Music">Music</option>
                  <option value="Wellness">Wellness</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description *
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
                placeholder="Brief description for event cards"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
                placeholder="Detailed description of your event"
              />
            </div>
          </div>

          {/* Date & Location */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Date & Location
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div> */}

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="text"
                  value={item.time}
                  onChange={(e) =>
                    handleScheduleItemChange(index, "time", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="e.g., 10:00 AM - 11:00 AM"
                  name={`scheduleItems[${index}][time]`}
                />
              </div> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                  placeholder="City, State"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Venue name"
                />
              </div>
            </div>
          </div>

          {/* Schedule Items with Image Upload */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Schedule
            </h3>
            {scheduleItems.map((item, index) => (
              <div key={index} className="border p-4 rounded-lg mb-4 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time
                      </label>
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) =>
                          handleScheduleItemChange(
                            index,
                            "time",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="e.g., 10:00 AM - 11:00 AM"
                        name={`scheduleItems[${index}][time]`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing & Capacity */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Pricing & Capacity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity *
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                  placeholder="Number of attendees"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organizer *
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                  placeholder="Organizer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Highlights
            </h3>
            {formData.highlights.map((highlight, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) =>
                    handleArrayFieldChange("highlights", index, e.target.value)
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Event highlight"
                />
                <button
                  type="button"
                  onClick={() => removeArrayFieldItem("highlights", index)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayFieldItem("highlights")}
              className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              + Add Highlight
            </button>
          </div>

          {/* Included Items with Image Upload */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Included Items
            </h3>
            {includedItems.map((item, index) => (
              <div key={index} className="border p-4 rounded-lg mb-4 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left side - Image Upload */}
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Image
                    </label>
                    <div
                      onClick={() => triggerIncludedImageInput(index)}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors h-40"
                    >
                      {item.image ? (
                        <div className="relative h-full">
                          <img
                            src={item.image}
                            alt="Included item preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeIncludedImage(index);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-gray-400 mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 002 2z"
                            />
                          </svg>
                          <p className="text-gray-600 text-sm">
                            Click to upload
                          </p>
                          <p className="text-gray-500 text-xs">item image</p>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={(el) => (includedImageRefs.current[index] = el)}
                        onChange={(e) => handleIncludedImageUpload(index, e)}
                        className="hidden"
                        accept="image/*"
                        name={`includedItems[${index}][image]`}
                      />
                    </div>
                  </div>

                  {/* Right side - Text Field */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) =>
                          handleIncludedItemChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-y min-h-[100px]"
                        placeholder="What's included"
                        name={`includedItems[${index}][description]`}
                      />
                    </div>

                    {/* Remove Button */}
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => removeIncludedItem(index)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        Remove Item
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addIncludedItem}
              className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors w-full"
            >
              + Add Included Item
            </button>
          </div>

          {/* Inclusions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Inclusions
            </h3>
            {formData.inclusions.map((inclusion, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={inclusion}
                  onChange={(e) =>
                    handleArrayFieldChange("inclusions", index, e.target.value)
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="What's included"
                  name={`inclusions[${index}]`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayFieldItem("inclusions", index)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayFieldItem("inclusions")}
              className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              + Add Inclusion
            </button>
          </div>

          {/* Exclusions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Exclusions
            </h3>
            {formData.exclusions.map((exclusion, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={exclusion}
                  onChange={(e) =>
                    handleArrayFieldChange("exclusions", index, e.target.value)
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="What's not included"
                  name={`exclusions[${index}]`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayFieldItem("exclusions", index)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayFieldItem("exclusions")}
              className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              + Add Exclusion
            </button>
          </div>

          {/* Terms & Conditions */}
          {/* <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Terms & Conditions
            </h3>
            {formData.termsConditions.map((term, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={term}
                  onChange={(e) =>
                    handleArrayFieldChange(
                      "termsConditions",
                      index,
                      e.target.value
                    )
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Term or condition"
                  name={`termsConditions[${index}]`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayFieldItem("termsConditions", index)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayFieldItem("termsConditions")}
              className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              + Add Term
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-,,, complete this code ,, give me the fix code */}

          {/* ... (previous form sections remain the same) ... */}

          {/* Terms & Conditions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Terms & Conditions
            </h3>
            {formData.termsConditions.map((term, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={term}
                  onChange={(e) =>
                    handleArrayFieldChange(
                      "termsConditions",
                      index,
                      e.target.value
                    )
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Term or condition"
                  name={`termsConditions[${index}]`}
                />
                <button
                  type="button"
                  onClick={() => removeArrayFieldItem("termsConditions", index)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayFieldItem("termsConditions")}
              className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              + Add Term
            </button>
          </div>

          {/* Form Buttons */}
          <div className="flex justify-end gap-3 pt-6 sticky bottom-0 bg-white border-t p-4 -mx-6 -mb-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {event ? "Update Event" : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;

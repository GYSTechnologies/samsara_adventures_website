import React, { useState } from "react";
import { Globe, Camera, PawPrint } from "lucide-react";

const AddOnServices = ({ onAddOnSelect }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const services = [
    {
      id: 1,
      icon: <Globe className="w-6 h-6 text-white" />,
      title: "Translator",
      description: "Enhance your experience with a professional translator.",
    },
    {
      id: 2,
      icon: <Camera className="w-6 h-6 text-white" />,
      title: "Photographer",
      description: "Capture your memories with a skilled photographer.",
    },
    {
      id: 3,
      icon: <PawPrint className="w-6 h-6 text-white" />,
      title: "Pet Allowance",
      description: "Bring your furry friend along for the adventure.",
    },
  ];

  const toggleService = (service) => {
    const newSelection = selectedServices.includes(service.id)
      ? selectedServices.filter((id) => id !== service.id)
      : [...selectedServices, service.id];

    setSelectedServices(newSelection);
    onAddOnSelect(newSelection.map((id) => services.find((s) => s.id === id)));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
      <h2 className="text-xl font-semibold mb-4">Add-on Services</h2>
      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition cursor-pointer"
            onClick={() => toggleService(service)}
          >
            <div className="flex items-center gap-4">
              {/* ICON ALWAYS SAME (NO CHECKMARK) */}
              <div className="bg-blue-500 p-2 rounded-lg">{service.icon}</div>

              <div>
                <h3 className="font-semibold">{service.title}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            </div>

            {/* BUTTON ONLY CHANGES */}
            <button
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                selectedServices.includes(service.id)
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {selectedServices.includes(service.id) ? "Added" : "Add"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddOnServices;

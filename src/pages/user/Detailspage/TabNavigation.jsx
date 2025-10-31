import React from "react";

const TabNavigation = ({ activeTab, onTabChange, tabs }) => (
  <div className=" border-b border-gray-200 sticky top-0 z-10">
    <div className="flex space-x-1 ">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-2 px-2 text-sm font-medium  rounded-t-lg transition-colors ${
            activeTab === tab.id
              ? 'bg-lime-700 text-white'
              : 'text-gray-600 hover:text-gray-900 bg-gray-50'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </div>
);

export default TabNavigation;
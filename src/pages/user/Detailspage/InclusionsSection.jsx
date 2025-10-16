import React from "react";
import { Check, X } from "lucide-react";

const InclusionsSection = ({ inclusions = [], exclusions = [] }) => (
  <div className="bg-white p-4 sm:p-6">
    <div className="space-y-6">
      {inclusions.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Inclusions</h4>
          <div className="space-y-2">
            {inclusions.map((inclusion, index) => (
              <div key={index} className="flex items-start gap-3">
                {/* <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" /> */}
                <span className="text-sm rounded-lg border border-green-600 px-2 py-1 text-gray-700">{inclusion}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {exclusions.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Exclusions</h4>
          <div className="space-y-2">
            {exclusions.map((exclusion, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-sm rounded-lg border border-red-400 px-2 py-1 text-gray-800">{exclusion}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default InclusionsSection;
import React from "react";

/*
  Vertical Stream Timeline (connector-per-row approach)
  - Three columns: Day label | rail (top-line, dot, bottom-line) | content card
  - No absolute offsets; lines are flex-1 so they auto-fit row heights
  - Works with variable content and responsive layouts
*/

const Rail = ({ isFirst, isLast }) => (
  <div className="flex flex-col items-center">
    <div className={`w-px flex-1 ${isFirst ? "bg-transparent" : "bg-gray-300"}`} />
    <div className="w-2.5 h-2.5 rounded-full bg-[#4F7F1D]" />
    <div className={`w-px flex-1 ${isLast ? "bg-transparent" : "bg-gray-300"}`} />
  </div>
);

const ItinerarySection = ({ itinerary = [] }) => {
  return (
    <div className="px-4 sm:px-6">
      <div className="bg-white rounded-[18px] shadow-sm border border-gray-200 p-5 sm:p-6">
        <div className="space-y-6 sm:space-y-8">
          {itinerary.map((day, idx) => {
            // const isFirst = idx === 0;
            // const isLast = idx === itinerary.length - 1;

            return (
              <div key={day.dayNumber} className="grid grid-cols-[42px_1fr] sm:grid-cols-[108px_1fr] items-start gap-3 sm:gap-4">
                {/* Day label */}
                <div className="pt-1">
                  <span className="text-base sm:text-lg font-semibold text-gray-900 underline underline-offset-4 decoration-transparent hover:decoration-gray-400 transition">
                    Day {day.dayNumber}
                  </span>
                </div>

                {/* Rail (top-line, dot, bottom-line) */}
                {/* <Rail isFirst={isFirst} isLast={isLast} /> */}

                {/* Content card */}
                <div className="bg-white rounded-xl border border-lime-700 px-4 sm:px-5 py-3 sm:py-4">
                  <h4 className="text-[15px] sm:text-lg font-semibold text-gray-900">
                    {day.title}
                  </h4>

                  {day.description && (
                    <ul className="mt-2 list-disc pl-5 text-gray-700 text-[13px] sm:text-sm space-y-1">
                      <li>{day.description}</li>
                    </ul>
                  )}

                  {Array.isArray(day.points) && day.points.length > 0 && (
                    <ul className="mt-2 list-disc pl-5 text-gray-700 text-[13px] sm:text-sm space-y-1">
                      {day.points.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ItinerarySection;

import React, { useState, useEffect } from "react";

// Counter Component
const Counter = ({ target, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(target);
    if (start === end) return;

    const incrementTime = Math.floor(duration / end);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);

      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

const AdventureCart = () => {
  return (
    <div className="min-h-screen bg-[#eff5d2] font-sans">
      <div className="container mx-auto px-4 py-8 lg:py-16">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Wander Without Limits
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover curated travel experiences designed for curious explorers
            like you.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          {/* Left Side - Van Image */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
                alt="Yellow van on desert road"
                className="w-full h-64 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>

          {/* Right Side - Statistics */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-right mb-8">
              <p className="text-lg lg:text-xl text-gray-700 italic leading-relaxed">
                At AdventureGo, we create journeys that go beyond the map —{" "}
                <span className="text-gray-500">
                  from hidden trails to iconic wonders.
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Stats Cards */}
              <div className="bg-blue-100 rounded-3xl p-6 lg:p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  <Counter target={250} suffix="+" />
                </div>
                <div className="text-gray-600 font-medium">Custom Itineraries</div>
                <div className="text-gray-600 font-medium">Planned</div>
              </div>

              <div className="bg-yellow-100 rounded-3xl p-6 lg:p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  <Counter target={98} suffix="%" />
                </div>
                <div className="text-gray-600 font-medium">Positive Traveler</div>
                <div className="text-gray-600 font-medium">Feedback</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Bottom Left Stats */}
          <div className="lg:col-span-5 flex items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="bg-purple-100 rounded-3xl p-6 lg:p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  <Counter target={1200} suffix="+" />
                </div>
                <div className="text-gray-600 font-medium">Verified Guest</div>
                <div className="text-gray-600 font-medium">Ratings</div>
              </div>

              <div className="bg-teal-100 rounded-3xl p-6 lg:p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  <Counter target={900} suffix="+" />
                </div>
                <div className="text-gray-600 font-medium">Trusted Travel</div>
                <div className="text-gray-600 font-medium">Partnerships</div>
              </div>
            </div>
          </div>

          {/* Bottom Right - Lake Image */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="https://media.istockphoto.com/id/1065043970/photo/young-woman-sitting-on-edge-looks-out-at-view.jpg?s=612x612&w=0&k=20&c=zXlF6EJwCHDAtEJ_kh8zs6PqliCKZA75F93ffAkJURY="
                alt="Crystal clear lake with mountains and boats"
                className="w-full h-64 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdventureCart;

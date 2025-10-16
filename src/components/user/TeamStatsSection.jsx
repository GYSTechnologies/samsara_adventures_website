import React from "react";
import { MapPin, Briefcase, Mountain, Headphones } from "lucide-react";
import CountUp from "react-countup";

export default function TeamStatsSection() {
  const stats = [
    { icon: <MapPin className="w-10 h-10" />, value: 10, suffix: "+", label: "Locations" },
    { icon: <Briefcase className="w-10 h-10" />, value: 100, suffix: "+", label: "Travelers" },
    { icon: <Mountain className="w-10 h-10" />, value: 20, suffix: "+", label: "Best deals" },
    { icon: <Headphones className="w-10 h-10" />, value: 24, suffix: "/7", label: "Support" },
  ];

  return (
    <div className="bg-[#eff5d2] pb-10">
      {/* Stats Section with Background */}
      <div
        className="relative bg-cover bg-center bg-no-repeat py-16 lg:py-24"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1582332716012-3614d2147340?q=80&w=1170&auto=format&fit=crop')`,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            {stats.map((item, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                {item.icon}
                <div className="text-3xl md:text-4xl font-bold">
                  <CountUp end={item.value} duration={4.5} suffix={item.suffix} />
                </div>
                <div className="text-sm md:text-base opacity-90">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section
      <div className="py-16 lg:py-20 bg-[#eff5d2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="mb-4">
              <span className="text-blue-500 font-medium text-sm uppercase tracking-wide">
                OUR TEAM
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Meet our Adventures Behind<br />
              Samsara Adventures
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                name: "Rishabh Singh",
                role: "Founder & CEO",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=387&q=80",
                bio: "With a passion for exploration, Rishabh founded Samsara to share the beauty of the world with others",
              },
              {
                name: "Raksha Singh",
                role: "Co-Founder",
                img: "https://images.unsplash.com/photo-1600600423621-70c9f4416ae9?q=80&w=688&auto=format&fit=crop",
                bio: "Raksha ensures every journey with Samsara is unforgettable with her creative leadership",
              },
              {
                name: "Ranveer Singh",
                role: "Operations Head",
                img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=1470&q=80",
                bio: "Ranveer manages operations seamlessly to give travelers the best experiences possible",
              },
            ].map((member, idx) => (
              <div key={idx} className="text-center group">
                <div className="relative mb-6 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-500 text-sm font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div> 
      </div> */}
    </div>
  );
}

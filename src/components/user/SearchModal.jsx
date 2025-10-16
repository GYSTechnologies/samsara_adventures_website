// components/nav/SearchModal.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, X } from "lucide-react";
import { debounce } from "lodash";
import axiosInstance from "../../api/axiosInstance";

export default function SearchModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Fetch suggestions
  const fetchSuggestions = async (q) => {
    if (!q || q.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/api/trip/search?query=${encodeURIComponent(q)}`);
      setSuggestions(res?.data?.results ?? []);
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetch = useRef(debounce(fetchSuggestions, 300)).current;

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      debouncedFetch(searchQuery);
    } else {
      setSuggestions([]);
    }
    return () => debouncedFetch.cancel();
  }, [searchQuery, debouncedFetch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const target = suggestions?.[0]?.state ?? searchQuery.trim();
    if (target) {
      navigate(`/destination/${encodeURIComponent(target)}`);
      onClose();
      setSearchQuery("");
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (result) => {
    navigate(`/destination?state=${encodeURIComponent(result.state)}`);
    onClose();
    setSearchQuery("");
    setSuggestions([]);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden"
      onClick={onClose}
    >
      <div
        className="bg-white h-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Close search"
          >
            <X size={20} className="text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Search Destinations</h2>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center bg-gray-50 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-lime-500/20 focus-within:bg-white transition-all">
              <Search size={20} className="text-gray-400 mr-3" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base w-full"
              />
              {isLoading && (
                <Loader2 className="h-5 w-5 animate-spin text-lime-600 ml-2" />
              )}
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-4">
          {isLoading && suggestions.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin text-lime-600 mr-2" />
              <span>Searching...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="space-y-2">
              {suggestions.map((result, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition"
                  onClick={() => handleSuggestionClick(result)}
                >
                  {result.images?.[0] ? (
                    <img
                      src={result.images[0]}
                      alt={result.state}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-lime-100 grid place-items-center">
                      <Search className="w-5 h-5 text-lime-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 truncate">
                      {result.state}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {result.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery.trim().length >= 2 && !isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No destinations found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Start typing to search destinations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

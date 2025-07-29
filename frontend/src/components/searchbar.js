import React from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const Searchbar = () => {
  const navigate = useNavigate();

  const handleSearch = () => {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;
    navigate(`/search/${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative h-24">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-2 w-full max-w-4xl p-4 bg-gray-200 rounded-lg shadow-md border border-black flex items-center gap-2 z-50">
        <input
          type="text"
          id="searchInput"
          placeholder="Search..."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Search className="text-white" />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
};

export default Searchbar;

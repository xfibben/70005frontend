"use client";
import React from 'react';

const SearchBar = ({ onSearch }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Buscar escuela..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full px-3 py-2 border rounded-md"
      />
    </div>
  );
};

export default SearchBar;
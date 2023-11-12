"use client";
import SearchFilter from './search-filter';

export default function SearchFilters() {

  return (
    <div className="flex flex-col w-full mt-5 justify-start">
      <SearchFilter filter="skills" label="Taidot" />
      <SearchFilter filter="providers" label="Välittäjät" />

    </div>
  );
}

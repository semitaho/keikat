"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryParams } from "@/app/hooks/client-hooks";
export default function SearchForm() {
  const { getParam, getString, refreshWithQueryParam } = useQueryParams();
  const search = getString("search");
  const [searchVal, setSearchVal] = useState(search);

  function textChange(event) {
    const search = event.target.value;
    refreshWithQueryParam("search", search);
  }

  function handleClear(event) {
    if (event.target.value === "") {
      refreshWithQueryParam("search", "");
    }
  }

  function onSelect(event) {
    const skills = getParam("skills");

    const newSkill = event.target.value;
    if (newSkill === "") return;
    if (skills.has(newSkill)) return;
    const newSkills = skills.add(newSkill);
    refreshWithQueryParam("skills", newSkills);
  }
  return (
    <form className="w-full gap-2 items-center flex mt-10">
      <div className="w-1/3">
        <input
          autoFocus
          className="appearance-none p-2.5 border px-3 leading-tight focus:outline-none focus:shadow-outline rounded w-full text-gray-700 mr-3  leading-tight focus:outline-none"
          type="search"
          id="search"
          onInput={handleClear}
          value={searchVal}
          onChange={(event) => setSearchVal(event.target.value)}
          onKeyUp={textChange}
          placeholder="Hae toimeksiantoja..."
          aria-label="Search"
        />
      </div>
      <div>
        <select
          id="default"
          onChange={onSelect}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Valitse taidot</option>
          <option value="java">Java</option>
        </select>
      </div>
    </form>
  );
}

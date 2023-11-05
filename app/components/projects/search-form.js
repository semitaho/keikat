"use client";
import { useState } from "react";
import SelectList from "./../ui/select-list";
import { useQueryParams } from "@/app/hooks/client-hooks";
export default function SearchForm({ skills }) {
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
    console.log("new skills", newSkills);

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
        <SelectList
          label="Valitse taidot"
          onSelect={onSelect}
          options={skills}
        ></SelectList>
      </div>
    </form>
  );
}

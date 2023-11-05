"use client";

import { useQueryParams } from "@/app/hooks/client-hooks";
import { useSearchParams } from "next/navigation";
import Tag from "./tag";

export default function SearchFilters() {
  const { getParam, refreshWithQueryParam} = useQueryParams();

  function onRemoveSkillHandler(skillToRemove) {
    console.log('skill to rmeove:', skillToRemove);
    const currentSkills = getParam("skills");
    currentSkills.delete(skillToRemove);
    refreshWithQueryParam("skills", currentSkills);
  }
  const skills = getParam("skills");
  console.log("skills", skills);
  return (
    <div className="flex w-full mt-5 justify-start">
      {skills.size > 0 && (
        <div>
          <label>Taidot:</label>
          {Array.from(skills).map((skill) => (
            <Tag key={skill} onRemove={onRemoveSkillHandler.bind(this, skill)}>{skill}</Tag>
          ))}
        </div>
      )}
    </div>
  );
}

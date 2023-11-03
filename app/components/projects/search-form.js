"use client";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const [searchVal, setSearchVal] = useState(search);
  const ref = useRef(search);

  function textChange(event) {
    router.push("/projektit?search=" + ref.current.value);
  }
  return (
    <div className="w-full mx-auto mt-10">
      <form>
        <input
          autoFocus
          className="appearance-none py-2 px-3 border leading-tight focus:outline-none focus:shadow-outline rounded w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="search"
          id="search"
          ref={ref}
          value={searchVal}
          onChange={event => setSearchVal(event.target.value)}
          onKeyUp={textChange}
          placeholder="Hae toimeksiantoja..."
          aria-label="Search"
        />
      </form>
    </div>
  );
}

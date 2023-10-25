import Link from "next/link";
import { HeaderLink } from "../header-link";

export function Navigation() {
  return (
    <nav className="bg-[#1E90FF] block  flex justify-between p-5  items-center dark:bg-slate-800 border-gray-200">
      <div>
        <HeaderLink  href="/">
            <span className="text-3xl">K€ikat</span> </HeaderLink>

      </div>
      <div>
      <HeaderLink href="/projektit">Vapaat projektit</HeaderLink>

        <HeaderLink href="/ota-yhteytta">Ota yhteyttä</HeaderLink>
      </div>
    </nav>
  );
}

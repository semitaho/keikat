import Link from "next/link";
import { HeaderLink } from "../header-link";

const links = [
  { href: "/projektit", text: "Avoimet toimeksiannot" },
  { href: "/ota-yhteytta", text: "Ota yhteyttä" },
];

export function Navigation() {
  return (
    <nav className="bg-[#1E90FF] justify-between  flex  py-2 px-5  dark:bg-slate-800 border-gray-200">
      <div>
        <HeaderLink href="/">
          <span className="text-3xl">K€ikat</span>
        </HeaderLink>
      </div>
      <div>
        {links.map(({text, href}) => (
          <HeaderLink key={text} href={href}>
            {text}
          </HeaderLink>
        ))}
      </div>
    </nav>
  );
}

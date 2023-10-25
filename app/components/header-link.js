import Link from "next/link";

export function HeaderLink({ href, children }) {
  return <Link className="text-white hover:underline ml-10 text-lg hover:text-gray" 
  href={href}>{children}</Link>;
}

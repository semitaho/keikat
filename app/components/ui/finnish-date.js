'use client'
import { useDateFormat } from "@/app/hooks/server-hooks";
export default function FinnishDate({ children }) {
    const dt = children.toLocaleDateString("fi-FI");
  const df = useDateFormat();
  return <time className="text-gray-400 text-sm">{dt}</time>;
}

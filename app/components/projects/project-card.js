import Image from "next/image";
import Tag from "./tag";
import Link from "next/link";
import { getImageByCategory } from "@/app/lib/parser-util";
import { useDateFormat } from "@/app/hooks/server-hooks";
export default function ProjectCard({
  title,
  subtitle,
  created_at,
  provider,
  start_date,
  category,
  location,
  tags,
  excerpt,
}) {
  const imagepath = `/images/${getImageByCategory(category)}`;
  const [df, aloitusf] = useDateFormat();
  const providerlink = `/projektit?provider=${provider}`;

  return (
    <div className="lg:max-w-[30%] sm:max-w-[40%]  flex flex-col  rounded lg:hover:scale-105 transform transition  bg-white shadow-lg">
      <div>
        <Image
          width={30}
          height={20}
          className="w-full h-full"
          sizes="50vw"
          src={imagepath}
          alt={title}
        />
      </div>

      <div className="px-3 flex-none flex flex-col">
        <div className=" pb-3 pt-5 flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold uppercase">{title}</h3>
            <div className="text-sm text-slate-500 text-right font-bold italic">
              <Link href={providerlink} className="hover:underline">
                {provider}
              </Link>
            </div>
          </div>
          <p className="text-gray-700 text-xs">{subtitle}</p>
        </div>
        <div className="flex justify-between font-red font-semibold text-sm">
          <span className="italic text-xs text-gray-500">
            {start_date && `Aloitus ${aloitusf(start_date)}`}
          </span>
          <span className="text-gray-500 text-xs">83 €</span>
        </div>
      </div>
      <div className="px-3 my-2 flex-grow">
        <div
          className="text-clip"
          dangerouslySetInnerHTML={{ __html: excerpt }}
        ></div>
      </div>

      <div>
        <div className="px-3 py-2">
          <ul className="flex flex-wrap">
            {tags.map((tag) => (
              <li key={tag}>
                <Tag>{tag}</Tag>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-2 items-center flex-none text-gray-400 text-sm justify-between p-3">
          <span className="text-green text-gray-600 italic">{location}</span>
          <time className="text-right">{df(created_at)}</time>
        </div>
      </div>
    </div>
  );
}

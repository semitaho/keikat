import Image from "next/image";
import { CATEGORY_IMAGE_MAP } from "../../data/dummy-data";
import Tag from "./tag";
import Link from "next/link";
import { getImageByCategory } from "@/app/lib/parser-util";
export default function ProjectCard({ title, category, excerpt, slug, tags }) {
  const imagepath = `/images/${getImageByCategory(category)}`;
  return (
    <Link
      className="max-w-[20%] flex flex-col rounded hover:scale-105 transform transition  bg-white shadow-lg"
      href={`/projektit/${slug}`}
    >
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

      <div className="px-3 flex-grow">
        <div className=" pb-3 pt-5">
          <h3 className="font-semibold">{title}</h3>
        </div>
        <p>{excerpt}</p>
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
        <div className="flex justify-end p-3">
          <time className="text-gray-400 text-sm">21.10.2023</time>
        </div>
      </div>
    </Link>
  );
}
